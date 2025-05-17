class ChainOfMiddlewares {
  constructor() {
    this.middlewares = []
  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  async run(args) {
    for (let i = 0; i < this.middlewares.length; i++) {
      if (!(await this.middlewares[i].handle(args))) {
        return false
      }
    }
    return true
  }
}

module.exports = ChainOfMiddlewares
