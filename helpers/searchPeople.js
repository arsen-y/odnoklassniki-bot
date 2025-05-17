function getProfilesData(getSelector, spliceId = 'empty') {
  const profilesData = [] // Массив для хранения ссылок на профили
  const usersContainer = document.querySelector('#tabpanel-users') // Находим блок с пользователями

  spliceId = spliceId.toString()

  // Находим все ссылки, начинающиеся с '/profile/'
  const userLinks = usersContainer.querySelectorAll('a[href^="/profile/"]')

  userLinks.forEach((el) => {
    const href = el.getAttribute('href') // Получаем href ссылки
    const userName = el.innerText.trim() // Получаем текст ссылки (имя и фамилия)

    // Проверяем, что текст не пустой, соответствует формату и длина имени >= 10
    const userIdMatch = href.match(/\/profile\/(\d+)$/) // Регулярное выражение для проверки формата

    if (userName && userIdMatch) {
      let userId = userIdMatch[1] // Извлекаем ID пользователя из ссылки

      // Ищем следующий элемент с классом, начинающимся на card-info
      const cardInfoDiv = el.closest('div').nextElementSibling // Получаем следующий div

      if (cardInfoDiv && cardInfoDiv.className.startsWith('card-info')) {
        // Ищем блок с возрастом
        const ageBlock = cardInfoDiv.querySelector('div[data-tsid]')
        if (ageBlock) {
          const ageText = ageBlock.innerText // Получаем текст блока с возрастом
          const ageMatch = ageText.match(/(\d+)/) // Извлекаем числовое значение возраста

          if (ageMatch) {
            userId = userId.toString()

            const age = parseInt(ageMatch[1], 10) // Преобразуем в число
            // Добавляем информацию в массив
            profilesData.push({
              id: userId,
              href,
              userName,
              age,
              selector: getSelector(el),
            })

            if (userId == spliceId) {
              profilesData.splice(0, profilesData.length)
            }
          }
        }
      }
    }
  })

  return profilesData // Возвращаем массив объектов профилей
}

function getWriteToLink() {
  const element = document.querySelector('div.entity-shortcut-menu_footer a[href^="/messages/"]')

  // Проверяем, что нашли элемент, и он соответствует требованиям
  if (element && element.innerText.trim() === 'Написать') {
    // Извлекаем число из href с помощью регулярного выражения
    const href = element.getAttribute('href')
    const match = href.match(/\/messages\/(\d+)/)

    if (match) {
      const id = match[1] // Получаем число из href
      return id
    }
  }

  return false
}

module.exports = { getProfilesData, getWriteToLink }
