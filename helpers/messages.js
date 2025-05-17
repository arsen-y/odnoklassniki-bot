const { sleepProm } = require("./sleepProm")

function findNewMessagesText(myUserId, interlocutorId) {
  // Преобразуем ID в строки
  const myIdPrefix = myUserId.toString()
  const interlocutorIdPrefix = interlocutorId.toString()

  // Получаем все элементы <msg-message> в инвертированном порядке
  const messageElements = Array.from(document.querySelectorAll('msg-message')).reverse()

  // Создаем массив для сбора текста сообщений
  let collectedMessages = []

  // Перебираем элементы
  for (let i = 0; i < messageElements.length; i++) {
    const element = messageElements[i]
    const itemId = element.getAttribute('data-item-id')

    // Проверяем, если текущий элемент — это сообщение пользователя
    if (itemId && itemId.startsWith(myIdPrefix)) {
      // Останавливаем перебор, если нашли сообщение бота
      break
    } else {
      // Ищем <span> с атрибутом data-tsid="message_text" внутри элемента
      const textElement = element.querySelector('span[data-tsid="message_text"]')
      if (textElement) {
        // Добавляем innerText элемента в массив
        collectedMessages.push(textElement.innerText)
      }
    }   
  }

  // Инвертируем массив сообщений обратно
  collectedMessages = collectedMessages.reverse()

  // Соединяем элементы массива в строку с разделителем \n
  const collectedText = collectedMessages.join('\n')

  return collectedText.trim()
}

function findNewMessagesCount(myUserId, interlocutorId) {
  // Преобразуем ID в строки
  const myIdPrefix = myUserId.toString()
  const interlocutorIdPrefix = interlocutorId.toString()

  // Получаем все элементы <msg-message> в инвертированном порядке
  const messageElements = Array.from(document.querySelectorAll('msg-message')).reverse()

  let collectedMessages = []

  for (let i = 0; i < messageElements.length; i++) {
    const element = messageElements[i]
    const itemId = element.getAttribute('data-item-id')

    if (itemId && itemId.startsWith(myIdPrefix)) {
      break
    } else {
      collectedMessages.push(itemId)
    }

  }

  return collectedMessages.length
}

function isMessagesPageValid() {
  const element = document.querySelector('input[type="search"][name="chat-search"]')

  if (!element) {
    return false
  }

  return true
}

async function deleteMessage(args) {
  await args.browser.click('button[aria-label="Действия с сообщением"]')

  await sleepProm(3000)

  await args.browser.click('msg-menu-item[data-l="t,messageActionremove"]')

  await sleepProm(3000)

  await args.browser.click('button[data-tsid="confirm-primary"]')

  await sleepProm(3000)
}

module.exports = { findNewMessagesText, findNewMessagesCount, isMessagesPageValid, deleteMessage }
