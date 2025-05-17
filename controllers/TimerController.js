const { sleepProm } = require('../helpers/sleepProm')

class TimerController {
  constructor() {
    // массив экшенов с параметрами к каждому на дальнейшее выполнение
    this.actions = []
  }

  async initBot(id) {
    try {
      let cookies = null
      let proxy = null
      let localStorage = []

      let row = await global.db.getrow('SELECT * FROM bots_data WHERE id=?', [id])

      if (row !== undefined && 'cookies' in row && 'proxy' in row && 'localStorage' in row) {
        global.botId = row.id

        cookies = row.cookies
        proxy = row.proxy

        if (row.cookies.length > 1) {
          cookies = JSON.parse(row.cookies)
        }

        if (row.localStorage.length > 1) {
          localStorage = JSON.parse(row.localStorage)
        }

        if (row.vars.length > 1) {
          global.botVars.fromJson(row.vars)
        }

        let row2 = await global.db.getrow('SELECT * FROM global_vars WHERE id=1', [])

        if (row2 !== undefined && 'vars' in row2) {
          if (row2.vars.length > 1) {
            global.botVars.fromJsonGlobal(row2.vars)
          }
        } else {
          throw new Error(`global bot vars not found`)
        }

        //await global.botVars.setAsync('name', 'test12345')
        //console.log(global.botVars.name)

        //await global.botVars.setGlobalVarAsync('name', 'test12345')
        //console.log(global.botVars.getGlobalVar('name'))

        if (!global.botVars.has('name') || !global.botVars.has('age') || !global.botVars.has('profileId')) {
          throw new Error(`botVars name or age or profileId not set`)
        }

        return { cookies, proxy, localStorage }
      } else {
        throw new Error(`bot with id ${id} not found`)
      }
    } catch (e) {
      throw new Error(`initBot error: ${e.message}`)
    }
  }

  async run() {
    this.actions = []

    if (global.handLaunch) {
      // запуск бота в ручном режиме
      if (!global.botId) {
        console.log(`enter bot id (-i option)`)
        process.exit(1655642)
      }

      if (!global.startPage) {
        console.log(`specify startPage (-s option)`)
        process.exit(1654642)
      }

      if (!global.route) {
        console.log(`specify route (-r option)`)
        process.exit(1625642)
      }

      const { cookies, proxy, localStorage } = await this.initBot(global.botId)

      this.actions.push({
        path: global.route,
        cookies,
        proxy,
        localStorage,
        startPage: global.startPage,
        closeBrowser: true,
        param1: global.param1,
        updateCookies: global.updateCookies,
        timer: 60000,
        timerError: 60000,
      })
      return
    }

    let rows = []

    if (global.notActiveSel) {
      rows = await global.db.getall(
        `SELECT actions_queue.* from actions_queue 
        JOIN bots_data on bots_data.id=actions_queue.botId
        WHERE bots_data.active=0 ORDER BY RAND() LIMIT 0,1;`,
        [],
      )
    } else {
      
      if (!global.watcher) {
        rows = await global.db.getall(
          `SELECT * from actions_queue WHERE route='search/people' ORDER BY RAND() LIMIT 0,1;`,
          [],
        )
      }

      if (rows.length == 0) {
        rows = await global.db.getall(
          `SELECT *
FROM actions_queue
WHERE botId = (
    SELECT botId FROM actions_queue 
    JOIN bots_data on bots_data.id=actions_queue.botId
    WHERE (actions_queue.route='messages/deleteDialog' OR actions_queue.route='messages/deleteFirstMessage') AND bots_data.active=1 ORDER BY bots_data.id ASC limit 0,1
) AND (actions_queue.route='messages/deleteDialog' OR actions_queue.route='messages/deleteFirstMessage');`,
          [],
        )
      }

      if (rows.length == 0) {
        rows = await global.db.getall(
          `SELECT *
FROM actions_queue
WHERE botId = (
    SELECT botId FROM actions_queue 
    JOIN bots_data on bots_data.id=actions_queue.botId
    WHERE actions_queue.route='messages/readDialogs' AND bots_data.active=1 ORDER BY bots_data.id ASC limit 0,1
) AND actions_queue.route='messages/readDialogs';`,
          [],
        )
      }

      if (rows.length == 0) {
        rows = await global.db.getall(
          `SELECT actions_queue.* from actions_queue 
        JOIN bots_data on bots_data.id=actions_queue.botId
        WHERE bots_data.active=1 ORDER BY RAND() LIMIT 0,1;`,
          [],
        )
      }
    }

    if (rows.length > 0) {
      global.botId = rows[0].botId

      const { cookies, proxy, localStorage } = await this.initBot(global.botId)

      for (let i = 0; i < rows.length; i++) {
        let closeBrowser = false
        let lastInd = rows.length - 1

        if (i == lastInd) {
          closeBrowser = true
        }

        await global.db.query('DELETE from actions_queue WHERE id=?', [rows[i].id])

        await global.db.update('REPLACE INTO actions_history SET id=?, botId=?, route=?, startPage=?, param1=?', [
          rows[i].id,
          rows[i].botId,
          rows[i].route,
          rows[i].startPage,
          rows[i].param1,
        ])

        this.actions.push({
          actionId: rows[i].id,
          path: rows[i].route,
          cookies,
          proxy,
          localStorage,
          startPage: rows[i].startPage,
          updateCookies: true,
          param1: rows[i].param1,
          closeBrowser,
          timer: 10000,
          timerError: 10000,
        })
      }

      return
    }
  }

  getActions() {
    return this.actions
  }

  async logError(msg) {

    if (global.handLaunch) {
      return
    }
    
    try {
      msg = `${global.logStorage} \n\n ${msg}`

      if (msg.length >= 4096) {
        msg = msg.slice(-4096) // Оставляеv последние 4096 символов
      }

      await global.db.update('UPDATE actions_history SET success=0, msg=? WHERE id=?', [msg, global.actionId])
    } catch (e) {
      console.log(e.message)
    }
  }
}

module.exports = TimerController
