const { sleepProm } = require('./sleepProm')

globalLevelsExecute = async (args) => {
  
  let btnClose = await args.browser.evaluate(() => {
    const element = document.querySelector('button[class*="modal_close-btn"]')

    if (element) {
      element.click()
      return true
    }

    return false
  })

  if (btnClose) {
    consoleLog(`btnClose found, clicked`)
    await sleepProm(3000)
  }

  // проверяем, нет ли у нас формы авторизации. если есть, ставим флаг бота active=0

  const notLoggedIn = await args.browser.evaluate(() => {
    const signInButton = document.querySelector('input[type="submit"][data-l="t,sign_in"]')

    if (signInButton) {
      return true
    }

    return false
  })

  if (notLoggedIn) {
    await global.db.update('UPDATE bots_data SET active=0 WHERE id=?', [global.botId])
    throw new Error(`user is not logged in. bot ${global.botId} active flag set to 0`)
  }

  // проверяем, не заблокирован ли аккаунт

  if (args.browser.getCurrentUrl().includes('st.cmd=anonymVerifyCaptcha')) {
    throw new Error(`user is locked. need enter the captcha`)
  } else if (args.browser.getCurrentUrl().includes('st.cmd=anonymVerify')) {
    await global.db.update('UPDATE bots_data SET active=0 WHERE id=?', [global.botId])
    throw new Error(`user is locked. bot ${global.botId} active flag set to 0`)
  }

  // закрываем модальное всплывающее окно с ошибкой

  let res = await args.browser.evaluate(() => {
    const element = document.querySelector('#buttonId_button_close')

    if (element) {
      element.click()
      return true
    }

    return false
  })

  if (res) {
    res = false
    consoleLog(`close error modal window button found, clicked`)
    await sleepProm(3000)
  }

  // закрываем модальное пром-окно "смотреть видео"

  res = await args.browser.evaluate(() => {
    const promoBanner = document.querySelector('fixed-promo-banner')

    if (promoBanner) {
      const hideButton = Array.from(promoBanner.getElementsByTagName('button')).find(
        (button) => button.innerText === 'Скрыть',
      )

      if (hideButton) {
        hideButton.click()
        return true
      }

      return false
    }
  })

  if (res) {
    res = false
    consoleLog(`promo video block found, closed...`)
    await sleepProm(3000)
  }

  return true
}

module.exports = { globalLevelsExecute }
