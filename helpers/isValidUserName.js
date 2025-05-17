function isValidUserName(n) {

  if (n.length < 10) return false

  // Проверка на наличие кириллицы
  const hasCyrillic = /[а-яА-ЯЁё]/u.test(n)

  // Проверка на наличие латинских символов
  const hasLatin = /[a-zA-Z]/.test(n)

  // Проверка на наличие запрещенных символов
  const isValidFormat = /^[a-zA-Zа-яА-ЯЁё0-9\s\(\)]*$/iu.test(n)

  // Проверка на наличие подстрок (регистронезависимо)
  const forbiddenSubstrings = /магаз|прода|массаж|вместе|любим|цветы|подарк|культур|поселк|театр|город|народн|одежда|vip|заказ/iu

  // Логика проверки
  if (!isValidFormat || (!hasCyrillic && !hasLatin)) {
    return false // Строка не соответствует условиям
  }

  if (forbiddenSubstrings.test(n)) {
    return false // Строка содержит запрещенные подстроки
  }

  return true // Строка валидна
}

module.exports = { isValidUserName }
