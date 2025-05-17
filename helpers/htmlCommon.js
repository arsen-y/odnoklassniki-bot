function scrollToElem(e, offset = 100) {
  if (e) {
    const elementPosition = e.getBoundingClientRect().top + window.scrollY - offset // Рассчитываем позицию элемента
    window.scrollTo({ top: elementPosition, behavior: 'smooth' }) // Прокручиваем к элементу
  }
}

function getSelector(element) {
  if (!(element instanceof Element)) {
    throw new Error('Provided argument is not a DOM element.')
  }

  const path = []
  let currentElement = element

  if (element.id) {
    return `#${element.id}`
  }

    while (currentElement) {
      let selector = currentElement.tagName.toLowerCase() // Получаем имя тега

      // Если у элемента есть ID, используем его
      if (currentElement.id) {
        selector += `#${currentElement.id}`
        path.unshift(selector) // Добавляем в начало массива
        break // Выходим, если нашли ID
      } else {
        // Если у элемента есть класс, добавляем его
        if (currentElement.className) {
          const classes = currentElement.className.trim().split(/\s+/).join('.')
          selector += `.${classes}`
        }

        // Если есть сиблинги с таким же тегом, добавляем индекс
        const siblings = Array.from(currentElement.parentNode.children)
        const index = siblings.indexOf(currentElement) + 1 // Индекс элемента среди сиблингов
        if (siblings.filter((sib) => sib.tagName === currentElement.tagName).length > 1) {
          selector += `:nth-child(${index})`
        }

        path.unshift(selector) // Добавляем селектор в начало массива
      }
      currentElement = currentElement.parentElement // Переходим к родительскому элементу
    }

  return path.join(' > ') // Объединяем части селектора
}

function getElemCoordinates(selector) {
  const getVisibleCoordinates = (element) => {
    if (!element) return null // Если элемент не существует

    const rect = element.getBoundingClientRect()
    // Проверяем, является ли элемент видимым
    if (rect.width > 0 && rect.height > 0 && element.offsetParent !== null) {
      return rect // Возвращаем координаты, если элемент видимый
    }

    // Рекурсивно проверяем родительские элементы
    return getVisibleCoordinates(element.parentElement)
  }

  const element = document.querySelector(selector)
  const coordinates = getVisibleCoordinates(element)

  if (coordinates) {
    return {
      x: coordinates.left,
      y: coordinates.top,
      width: coordinates.width,
      height: coordinates.height,
    }
  } else {
    // Если элемент не найден, возвращаем координаты правого верхнего угла страницы
    return {
      x: window.innerWidth, // Правый край страницы
      y: 0, // Верхний край страницы
      width: 0,
      height: 0,
    }
  }
}

module.exports = { scrollToElem, getSelector, getElemCoordinates }
