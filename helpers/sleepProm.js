const sleepProm = (ms) => new Promise((r) => setTimeout(r, ms))

module.exports = { sleepProm }
