const { waitForEnter } = require('../helpers/waitForEnter')

class BlankController {
  // действие по умолчанию
  async defaultAction(...args) {

    await waitForEnter()

    return true
  }
}

module.exports = BlankController
