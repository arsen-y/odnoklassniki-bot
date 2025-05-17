const readline = require('readline')

function waitForEnter() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question('Press Enter to continue...', () => {
      rl.close() // Закрываем интерфейс после нажатия Enter
      resolve() // Разрешаем промис
    })
  })
}

module.exports = { waitForEnter }
