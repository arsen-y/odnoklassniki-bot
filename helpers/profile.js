function getRandomSchool(container) {
  const options = container.querySelectorAll('div[class^="option__"] > div');

  if (options.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].textContent.trim();
}

function calculateSchoolYears(age) {
  const currentYear = new Date().getFullYear()
  const birthYear = currentYear - age

  // Предположим, ребёнок пошёл в школу в 7 лет
  const startYear = birthYear + 7
  let endYear = startYear + 10
  const graduateYear = endYear

  if (currentYear <= endYear) {
    endYear = null
  }

  return { startYear, endYear, graduateYear }
}

module.exports = { getRandomSchool, calculateSchoolYears }
