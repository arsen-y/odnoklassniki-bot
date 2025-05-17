const { connect } = require('puppeteer-real-browser')
const { sleepProm } = require('../helpers/sleepProm')
const wildcardMatch = require('wildcard-match')

const blockRequest = wildcardMatch(['*yastatic*', '*yandex*', '*googletag*', '*intercept*'], {
  separator: false,
})

const allowedDomains = ['ok.ru', 'okcdn.ru']

class BrowserController {
  constructor(
    cookies,
    proxy,
    localStorage,
    updateCookies = true,
    disableFilter = true,
    cacheController = null,
  ) {
    this.initiated = false
    this.browser = null // инстанс браузера
    this.page = null // инстанс страницы
    this.reqCounter = 0
    this.networkError = false
    this.serverError = false
    this.cookies = cookies // array of objects
    this.proxy = proxy
    this.localStorage = localStorage
    this.updateCookies = updateCookies
    this.disableFilter = disableFilter
    this.cacheController = cacheController

    this.updCookiesInterval = null // идентификатор интервала обновления кук
    this.updCookiesTime = 10000 // через какой промежуток обновляем куки в базе
    this.botsTable = 'bots_data' // имя таблицы где хранятся данные о бота
    this.viewportWidth = 1150
    this.viewportHeight = 700
    this.staticExtensions = ['js', 'css', 'png', 'svg']
  }

  async launch(startUrl) {
    const pathToExtension = `${global.rootDir}/2captcha-solver`

    if (this.proxy.lenth == 0) {
      throw new Error(`proxy not set`)
    }

    let addResProxy = {}
    let addProxy = []

    const residentProxyRegex = /^(\d{1,3}(?:\.\d{1,3}){3}):(\d+):([^:]+):([^:]+)$/
    const residentProxyMatch = this.proxy.match(residentProxyRegex)

    if (residentProxyMatch) {
      const [, ip, port, username, password] = residentProxyMatch

      addResProxy = {
        proxy: {
          host: ip,
          port: port,
          username: username,
          password: password,
        },
      }
    } else {
      addProxy.push(`--proxy-server=${this.proxy}`)
    }

    const { browser, page } = await connect({
      headless: false,

      args: [
        // '--disable-web-security',
        // '--disable-features=IsolateOrigins,site-per-process',
        // '--allow-running-insecure-content',
        // '--disable-blink-features=AutomationControlled',
        // '--no-sandbox',
        // '--mute-audio',
        // '--no-zygote',
        // '--no-xshm',
        '--window-size=1200,920',
        // '--no-first-run',
        // '--no-default-browser-check',
        // '--disable-dev-shm-usage',
        // '--disable-gpu',
        // '--enable-webgl',
        '--ignore-certificate-errors',
        '--lang=en-US,en;q=0.9',
        // '--password-store=basic',
        // '--disable-gpu-sandbox',
        // '--disable-software-rasterizer',
        // '--disable-background-timer-throttling',
        // '--disable-backgrounding-occluded-windows',
        // '--disable-renderer-backgrounding',
        // '--disable-infobars',
        // '--disable-breakpad',
        // '--disable-canvas-aa',
        // '--disable-2d-canvas-clip-aa',
        // '--disable-gl-drawing-for-tests',
        // '--enable-low-end-device-mode',
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        //'--enable-popup-blocking',
        //`--proxy-server=`,
        ...addProxy,
      ],

      customConfig: {},

      turnstile: false,

      connectOption: {},

      ...addResProxy,

      disableXvfb: true,
      ignoreAllFlags: false,
    })

    this.browser = browser
    this.page = page

    // установка интерсептеров
    /////////////////////////////////////////////////////////////////////////////////////////
    await this.page.setRequestInterception(true)

    await this.page.setDefaultNavigationTimeout(0)

    this.page.on('framenavigated', (frame) => {
      const urlN = frame.url() // the new url

      if (urlN != 'about:blank') {
        this.reqCounter = 0
        consoleLog('FRAME NAVIGATED', urlN)
      }
    })

    this.page.once('domcontentloaded', () => {
      console.info('✅ DOM is ready')
      this.reqCounter = 0
    })

    this.page.on('request', async (request) => {
      try {
        this.reqCounter += 1

        const regexVideo = /^https?:\/\/vd\d+\.okcdn\.ru/

        if (regexVideo.test(request.url())) {
          const u = request.url()
          console.log(`request to ${u} (video source) is aborted`)
          request.abort()
          return
        }

        if (this.disableFilter) {
          console.log(`request ${request.url()}`)
          request.continue()
          return
        }

        if (request.url().includes('/res/i/reaction/')) {
          console.log(`request ${request.url()}`)
          request.continue()
          return
        }

        if (request.resourceType() === 'image') {
          const u = request.url()
          console.log(`request to ${u} (image) is aborted`)
          request.abort()
          return
        }

        const parsedUrl = new URL(request.url())
        const hostname = parsedUrl.hostname
        const isAllowedDomain = allowedDomains.some((domain) => hostname === domain || hostname.endsWith('.' + domain))

        if (request.url().startsWith('chrome-extension:')) {
          request.continue()
          return
        } else if (blockRequest(request.url()) || !isAllowedDomain) {
          const u = request.url()
          if (u.length > 200) {
            console.log(`request to ${u.substring(0, 50)}...${u.substring(u.length - 50)} is aborted`)
          } else {
            console.log(`request to ${u} is aborted`)
          }
          request.abort()
          return
        }

        // Кэширование статики
        const urlPath = parsedUrl.pathname
        const ext = urlPath.split('.').pop()

        if (this.cacheController && this.staticExtensions.includes(ext)) {
          const cacheKey = `${parsedUrl.hostname}${parsedUrl.pathname}`

          const cachedData = await this.cacheController.get(cacheKey)

          if (cachedData) {
            console.log(`Cache hit for ${request.url()}`)
            const mimeType =
              request.resourceType() === 'script'
                ? 'application/javascript'
                : request.resourceType() === 'stylesheet'
                  ? 'text/css'
                  : 'image/' + ext
            request.respond({
              status: 200,
              contentType: mimeType,
              body: cachedData,
            })
            return
          }
        }

        request.continue()
      } catch (e) {
        console.log(`request error: ${e.message}`)
      }
    })

    this.page.on('response', async (response) => {
      try {
        this.networkError = false
        if (response.status() >= 400) {
          this.serverError = true
        } else {
          this.serverError = false
        }

        // Если ответ был для статики, добавляем его в кэш
        const url = response.url()
        const parsedUrl = new URL(url)
        const ext = url.split('.').pop()

        if (this.cacheController && !url.startsWith('chrome-extension:') && this.staticExtensions.includes(ext)) {
          const cacheKey = `${parsedUrl.hostname}${parsedUrl.pathname}`
          const body = await response.buffer()
          await this.cacheController.set(cacheKey, body)
          console.log(`Cached ${url}`)
        }

      } catch (e) {
        console.log(`response error: ${e.message}`)
      }
    })

    // сетевые ошибки
    this.page.on('requestfailed', (request) => {
      // consoleLog(
      //   `Request failed: ${request.url()} - ${request.failure().errorText}`
      // );

      this.networkError = true
      this.serverError = false
    })

    /////////////////////////////////////////////////////////////////////////////////////////

    if (this.cookies) {
      await this.page.setCookie(...this.cookies)
    }

    this.initiated = true

    this.updCookiesInterval = setInterval(() => {
      this.updateCookiesInBackground()
    }, this.updCookiesTime)

    await this.page.setViewport({
      width: this.viewportWidth,
      height: this.viewportHeight,
      deviceScaleFactor: 1,
      isMobile: false,
    })

    consoleLog(`setting local storage`)

    await this.page.evaluateOnNewDocument((data) => {
      for (const key in data) {
        window.localStorage.setItem(key, data[key])
      }
    }, this.localStorage)

    // await this.page.evaluateOnNewDocument((data) => {
    //   for (const key in data) {
    //     window.sessionStorage.setItem(key, data[key])
    //   }
    // }, this.sessionStorage)

    consoleLog(`localStorage data set`)

    await this.goto(startUrl)

    await sleepProm(2000)

    await page.setViewport({
      width: this.viewportWidth,
      height: this.viewportHeight,
      deviceScaleFactor: 1,
      isMobile: false,
    })
  }

  async waitForSelector(s) {
    // пример селектора: '#message'
    consoleLog(`waiting for selector ${s}`)
    await this.page.waitForSelector(s, {
      visible: true, // Ожидать, пока элемент станет видимым
      timeout: 30000, // Время ожидания в миллисекундах (30 секунд)
    })
  }

  async goto(url) {
    consoleLog(`going to ${url}`)
    try {
      await this.page.goto(url)
    } catch (e) {
      consoleLog(e.message)
    }
  }

  async hover(s) {
    consoleLog(`hovering to ${s}`)
    await this.page.hover(s)
  }

  async boundingBoxElem(el) {
    return await el.boundingBox()
  }

  async mouseMove(x, y) {
    consoleLog(`moving mouse to ${x}/${y}`)
    await this.page.mouse.move(x, y)
  }

  async close() {
    clearInterval(this.updCookiesInterval)
    await this.updateCookiesInBackground()
    await this.browser.close()
  }

  async updateCookiesInBackground() {
    if (!this.updateCookies) {
      return
    }

    try {
      if (!this.page || !this.initiated) return

      const cookies = await this.page.cookies()

      const localStorageData = await this.page.evaluate(() => {
        let LSData = {}
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          LSData[key] = localStorage.getItem(key)
        }
        return LSData
      })

      await global.db.update(`UPDATE ${this.botsTable} SET cookies=?, localStorage=? WHERE id=?`, [
        JSON.stringify(cookies, null, 2),
        JSON.stringify(localStorageData, null, 2),
        global.botId,
      ])

      console.log('Cookies, localStorage updated in db')
    } catch (error) {
      console.error('Error updating cookies:', error)
    }
  }

  async evaluate(f, ...args) {
    const res = await this.page.evaluate(
      ({ fn666, args }) => {
        const fn666Ready = new Function(`return (${fn666})`)()
        return fn666Ready(...args) // Передача произвольных аргументов в функцию
      },
      {
        fn666: f.toString(),
        args, // Передаём произвольные аргументы в объект
      },
    )

    return res
  }

  async click(s) {
    consoleLog(`clicking on ${s}`)
    await this.page.click(s)
  }

  async clickOnElem(el) {
    consoleLog(`clicking el ${el}`)
    await el.click()
  }

  async clickOnCoords(x,y) {
    consoleLog(`clicking on coords ${x}/${y}`)
    await this.page.mouse.click(x,y)
  }

  async type(s, text) {
    consoleLog(`typing in ${s}`)
    await this.page.type(s, text)
  }

  async typeInElem(el, text) {
    consoleLog(`typing in ${el}`)
    await el.type(text)
  }

  async justType(text) {
    consoleLog(`typing text {text}`)
    await this.page.keyboard.type(text)
  }

  async pressEnter() {
    consoleLog(`pressing enter`)
    await this.page.keyboard.press('Enter')
  }

  async selectAllAndDelete() {
    consoleLog(`selecting all text and deleting...`)

    await sleepProm(1000)
    await this.page.keyboard.down('Control')
    await sleepProm(1000)
    await this.page.keyboard.press('A')
    await sleepProm(1000)
    await this.page.keyboard.up('Control')
    await sleepProm(1000)
    await this.page.keyboard.press('Backspace')
    await sleepProm(1000)
  }

  getCurrentUrl() {
    return this.page.url()
  }

  async reloadPage() {
    return this.page.reload()
  }

  async getElem(sel) {
    return await this.page.$(sel)
  }

  async getElems(sel) {
    return await this.page.$$(sel)
  }

  async getElSel(el, sel) {
    return await el.$$(sel)
  }

  async elemSelectByValue(elem, value) {
    value = String(value)
    consoleLog(`Selecting value='${value}' in select elem '${elem}'`)
    await elem.select(value)
    await sleepProm(500)
  }
}

module.exports = BrowserController
