function generatePassword() {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const passwordLength = Math.floor(Math.random() * (20 - 15 + 1)) + 15 // Случайная длина от 15 до 20

  let password = ''
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  return password
}

module.exports = { generatePassword }
