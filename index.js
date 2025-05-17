const Db = require('mysql2-async').default
const { sleepProm } = require('./helpers/sleepProm')
var childProcess = require('child_process')
const minimist = require('minimist')
const OpenAI = require('openai').default

require('dotenv').config()

// const repl = require('repl')
// const net = require('net')

const Router = require('./classes/Router')
const BrowserController = require('./controllers/BrowserController')
const TimerController = require('./controllers/TimerController')
const BotVars = require('./classes/BotVars')
const CacheController = require('./controllers/CacheController')

global.openaiAPI = new OpenAI({
  apiKey: process.env.OPENAIKEY,
})

const routes = {
  search: 'SearchPageController',
  profile: 'ProfilePageController',
  ownProfile: 'OwnProfilePageController',
  messages: 'MessagesPageController',
  notifications: 'NotificationsPageController',
  group: 'GroupPageController',
  password: 'PasswordPageController',
  login: 'LoginPageController',
  blank: 'BlankController',
}

global.AppRouter = new Router(routes)

const args = minimist(process.argv.slice(2))

global.rootDir = process.cwd()
global.botId = args.i
global.route = args.r
global.startPage = args.s
global.param1 = args.p
global.botVars = new BotVars()

if (args.w) {
  // вотчер. приоритет на watch экшены и все остальные
  global.watcher = true
} else {
  // серчер. приоритет на серч экшены. 
  global.watcher = false
}

if (args.n) {
  // селектим в таймер контроллере только экшены для неактивных ботов
  global.notActiveSel = true
} else {
  global.notActiveSel = false
}

global.updateCookies = args.u

if (!global.updateCookies) {
  global.updateCookies = true
} else {
  global.updateCookies = false
}

global.handLaunch = false

if (global.route || global.botId || global.startPage) {
  global.handLaunch = true
}

global.disableFilter = false

if (args.d) {
  global.disableFilter = true
}

global.db = new Db({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  skiptzfix: true,
})

global.actionId = 0
global.logStorage = ''

global.consoleLog = function (...args) {
  const message = args.join(' ') + '\n'
  global.logStorage += message
  console.log(...args)
}

// Создаем сервер для удаленного REPL
// net
//   .createServer((socket) => {
//     const replServer = repl.start({
//       prompt: '> ',
//       input: socket,
//       output: socket,
//       terminal: true,
//       useGlobal: true, // Включаем использование глобальных переменных
//     })

//     replServer.on('exit', () => {
//       socket.end()
//     })
//   })
//   .listen(5001, '127.0.0.1', () => {
//     console.log('REPL сервер запущен на порту 5001')
//   })

class Application {
  async run() {

    let browser = null
    const cacheController = new CacheController()

    while (true) {
      let isError = false
      try {
        let resCMD = childProcess.execSync('clear').toString()
        console.log(resCMD)

        let timer = new TimerController()
        await timer.run()

        if (timer.getActions().length == 0) {
          console.log(`no actions found`)
          await sleepProm(10000)
          continue
        }

        for (let i = 0; i < timer.getActions().length; i++) {
          let action = timer.getActions()[i]

          try {
            if (!browser) {
              browser = new BrowserController(
                action.cookies,
                action.proxy,
                action.localStorage,
                action.updateCookies,
                global.disableFilter,
                cacheController,
              )
              await browser.launch(action.startPage)
            } else {
              await browser.goto(action.startPage)
            }

            global.actionId = action.actionId
            let res = await AppRouter.route(action.path, { ...action, browser })

            if (!res) {
              throw new Error(`AppRouter returned false`)
            }
          } catch (e) {
            console.error(e.message)
            timer.logError(e.message)
            isError = true
          } finally {
            global.logStorage = ''
          }

          if (action.closeBrowser || isError) {
            await browser.close()
            browser = null
          }

          if (isError) {
            console.log(`timer ${action.timerError}`)
            await sleepProm(action.timerError)
          } else {
            console.log(`timer ${action.timer}`)
            await sleepProm(action.timer)
          }
        }
      } catch (e) {
        console.error(e)
        await sleepProm(30000)
      }
    }
  }
}

const App = new Application()
App.run()
