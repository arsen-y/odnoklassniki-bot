const { sendAIReq } = require('../helpers/sendAIReq')
const SendMessageLevels = require('../levels/messages/SendMessageLevels')
const SendVideoLevels = require('../levels/messages/SendVideoLevels')
const SendPostcardLevels = require('../levels/messages/SendPostcardLevels')
const SendStickerLevels = require('../levels/messages/SendStickerLevels')
const IsDialogOpenedLevels = require('../levels/messages/IsDialogOpenedLevels')
const HaveNewMessagesLevels = require('../levels/messages/HaveNewMessagesLevels')
const ScrollToFirstMessageLevels = require('../levels/messages/ScrollToFirstMessageLevels')
const DeleteFirstMessageLevels = require('../levels/messages/DeleteFirstMessageLevels')
const OpenUnreadDialogLevels = require('../levels/messages/OpenUnreadDialogLevels')
const GetMessageLevels = require('../levels/messages/GetMessagesLevels')
const DeleteMessagesLevels = require('../levels/messages/DeleteMessagesLevels')
const DeleteDialogLevels = require('../levels/messages/DeleteDialogLevels')
const ChainOfMiddlewares = require('../classes/ChainOfMiddlewares')
const { sleepProm } = require('../helpers/sleepProm')
const { getNextYouTubeLink } = require('../helpers/getNextYouTubeLink')

class MessagesPageController {
  async defaultAction(args) {
    consoleLog(`MessagesPageController default action`)
  }

  async sendMessageAction(args) {
    if (!args.param1) {
      throw new Error(`args.param1 not set`)
    }

    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 3000 }, // Level 1
      { maxRetries: 5, interval: 3000 }, // Level 2
      { maxRetries: 5, interval: 3000 }, // Level 3
    ]

    // Создание уровней с кастомными параметрами
    SendMessageLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

  async sendVideoAction(args) {

    args.param1 = await getNextYouTubeLink()
    args.param1 += ' '

    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 3000 }, // Level 1
      { maxRetries: 5, interval: 3000 }, // Level 2
      { maxRetries: 5, interval: 3000 }, // Level 3
      { maxRetries: 5, interval: 2000 }, // Level 4
      { maxRetries: 5, interval: 2000 }, // Level 5
      { maxRetries: 5, interval: 2000 }, // Level 6
    ]

    // Создание уровней с кастомными параметрами
    SendVideoLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

  async sendPostcardAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 3000 }, // Level 1
      { maxRetries: 5, interval: 3000 }, // Level 2
      { maxRetries: 5, interval: 3000 }, // Level 3
    ]

    // Создание уровней с кастомными параметрами
    SendPostcardLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    const res = await Chain.run(args)

    if (res && (await this.getTotalMsgCountInDialog(args)) > 0) {
      return true
    }

    return false
  }

  async sendStickerAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 3000 }, // Level 1
      { maxRetries: 5, interval: 3000 }, // Level 2
      { maxRetries: 5, interval: 3000 }, // Level 3
    ]

    // Создание уровней с кастомными параметрами
    SendStickerLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    const res = await Chain.run(args)

    if (res && (await this.getTotalMsgCountInDialog(args)) > 0) {
      return true
    }

    return false
  }

  async isDialogOpenedAction(args) {
    if (!args.param1) {
      throw new Error(`args.param1 not set`)
    }

    return await new IsDialogOpenedLevels[0](5, 1000).handle(args)
  }

  async haveNewMessagesAction(args) {
    if (!args.param1) {
      throw new Error(`args.param1 not set`)
    }

    return await new HaveNewMessagesLevels[0](5, 1000).handle(args)
  }

  async openUnreadDialogAction(args) {
    return await new OpenUnreadDialogLevels[0](3, 1000).handle(args)
  }

  async readDialogsAction(args) {
    let prevInterlocutorId = 0

    for (let i = 0; i < 20; i++) {
      let res = false

      try {
        res = await global.AppRouter.route('messages/openUnreadDialog', args)
      } catch (e) {
        consoleLog(e.message)
        break
      }

      if (!res) {
        consoleLog(`no unread dialogs found`)
        break
      }

      // args.interlocutorId содержит айди собеседника

      if (prevInterlocutorId == args.interlocutorId) {
        // мы "зависли" на одном чате.
        await sleepProm(3000)
        continue
      }

      prevInterlocutorId = args.interlocutorId

      let dialogRow = await global.db.getrow('SELECT id FROM dialogs WHERE id=? AND botId=?', [
        args.interlocutorId,
        global.botId,
      ])

      if (dialogRow !== undefined && 'id' in dialogRow) {
        consoleLog(`user is in dialogs table`)

        try {
          args.param1 = args.interlocutorId
          await global.AppRouter.route('messages/watchDialog', args)
        } catch (e) {
          consoleLog(e.message)
          break
        }

        continue
      }

      // пробуем отправить приветственный посткард
      let sendPostcardRes = false

      try {
        sendPostcardRes = await global.AppRouter.route('messages/sendPostcard', args)
      } catch (e) {
        consoleLog(e.message)
      }

      if (sendPostcardRes) {
        continue
      }

      // пробуем отправить видео, предварительно пробиваем по таблице

      let rowVideo = await global.db.getrow('SELECT id FROM video_sended WHERE profileId=? AND userId=?', [
        global.botVars.profileId,
        args.interlocutorId,
      ])

      if (rowVideo !== undefined && 'id' in rowVideo) {
        consoleLog(`video already sended`)
      } else {
        let sendVideoRes = false

        try {
          sendVideoRes = await global.AppRouter.route('messages/sendVideo', args)
        } catch (e) {
          consoleLog(e.message)
        }

        if (sendVideoRes) {
          await global.db.update('REPLACE INTO video_sended SET profileId=?, userId=?', [
            global.botVars.profileId,
            args.interlocutorId,
          ])
          continue
        } else {
          consoleLog('error sending video')
          continue
        }
      }

      // пробуем отправить стикер, предварительно пробиваем по таблице

      let row = await global.db.getrow(
        'SELECT id FROM stickers_sended WHERE profileId=? AND userId=? AND time > NOW() - INTERVAL 4 HOUR',
        [global.botVars.profileId, args.interlocutorId],
      )

      if (row !== undefined && 'id' in row) {
        consoleLog(`sticker already sended`)
        continue
      }

      let sendStickerRes = false

      try {
        sendStickerRes = await global.AppRouter.route('messages/sendSticker', args)
      } catch (e) {
        consoleLog(e.message)
      }

      if (sendStickerRes) {
        consoleLog(`sticker sended`)

        await global.db.update('REPLACE INTO stickers_sended SET profileId=?, userId=?', [
          global.botVars.profileId,
          args.interlocutorId,
        ])
      }
    }

    return true
  }

  async scrollToFirstMessageAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 2, interval: 3000 }, // Level 1
      { maxRetries: 10, interval: 3000 }, // Level 2
    ]

    // Создание уровней с кастомными параметрами
    ScrollToFirstMessageLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

  async deleteFirstMessageAction(args) {
    if (!args.param1) {
      consoleLog(`args.param1 not set`)
      return false
    }

    const userId = parseInt(args.param1)

    let delTest = await global.db.getrow(
      'SELECT * FROM actions_queue WHERE route="messages/deleteDialog" AND param1=?',
      [userId.toString()],
    )

    if (delTest !== undefined && 'id' in delTest) {
      consoleLog(`delete action found for this dialog`)
      return true
    }

    let row = await global.db.getrow('SELECT * FROM dialogs WHERE id=? AND botId=?', [userId, global.botId])

    if (row === undefined || !('id' in row)) {
      throw new Error(`record in dialogs not found for id=${userId} and botId=${global.botId}`)
    }

    try {
      await global.AppRouter.route('messages/scrollToFirstMessage', args)
    } catch (e) {
      consoleLog(e.message)
      return false
    }

    const res = await new DeleteFirstMessageLevels[0](5, 2000).handle(args)

    // если в диалоге не осталось сообщений ­— удаляем его полностью

    if ((await this.getTotalMsgCountInDialog(args)) == 0) {
      consoleLog('we have not messages in the dialog. so, deleting it completely...')
      await global.db.update('UPDATE dialogs SET time2=NULL WHERE id=?', [userId])

      let resDelDialog = false
      try {
        resDelDialog = await global.AppRouter.route('messages/deleteDialog', args)
      } catch (e) {
        consoleLog(e.message)
        return false
      }

      return resDelDialog
    }

    // если row.time2 установлен, были отправлены новые сообщения и удалять диалог из базы не нужно
    // тогда мы поставим time1=NULL

    if (res && row.time2 === null) {
      await global.db.query('DELETE from dialogs WHERE id=?', [userId])
      await global.db.update('REPLACE INTO people_worked SET id=?', [userId])
      consoleLog(`dialog with userId ${userId} deleted.`)
    } else if (res && row.time2 !== null) {
      await global.db.update('UPDATE dialogs SET time=NULL WHERE id=?', [userId])

      consoleLog(`first message with userId ${userId} deleted.`)
    }

    return res
  }

  async getTotalMsgCountInDialog(args) {
    const count = await args.browser.evaluate(() => {
      let elements = document.querySelectorAll('msg-message')

      if (!elements) {
        return 0
      }

      return elements.length
    })

    consoleLog(`count messages found in the dialog: ${count}`)

    return count
  }

  async getMessagesAction(args) {
    if (!args.param1) {
      throw new Error(`args.param1 not set`)
    }

    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 1000 }, // Level 1
      { maxRetries: 5, interval: 1000 }, // Level 2
    ]

    // Создание уровней с кастомными параметрами
    GetMessageLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

  async deleteDialogSql(args) {
    const userId = parseInt(args.param1)
    await global.db.query('DELETE from dialogs WHERE id=?', [userId])
    await global.db.update('REPLACE INTO people_worked SET id=?', [userId])
  }

  async deleteDialogAction(args) {
    
    if (!args.param1) {
      consoleLog(`args.param1 not set`)
      return false
    }

    const userId = parseInt(args.param1)

    await sleepProm(5000)

    const countMsg = await this.getTotalMsgCountInDialog(args)

    if(countMsg == 0) {
      consoleLog(`no msg found`)
      await this.deleteDialogSql(args)
      return true
    }

    try {
      await global.AppRouter.route('messages/scrollToFirstMessage', args)
    } catch (e) {
      consoleLog(e.message)
      return false
    }

    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 99, interval: 3000 }, // Level 1
    ]

    DeleteMessagesLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    const levelConfigs2 = [
      { maxRetries: 5, interval: 1000 }, // Level 1
      { maxRetries: 5, interval: 1000 }, // Level 2
      { maxRetries: 5, interval: 1000 }, // Level 3
    ]

    DeleteDialogLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs2[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    const res = await Chain.run(args)

    if (res) {
      await this.deleteDialogSql(args)
      consoleLog(`dialog with userId ${userId} deleted.`)
    }

    return res
  }

  async startDialogAction(args) {
    if (!args.param1) {
      consoleLog(`args.param1 not set`)
      return false
    }

    const userId = parseInt(args.param1)

    let row = await global.db.getrow('SELECT * FROM people_pre_send WHERE id=?', [userId])

    if (row === undefined || !('id' in row)) {
      throw new Error(`record in people_pre_send not found for id=${userId}`)
    }

    let row2 = await global.db.getrow('SELECT * FROM dialogs WHERE id=?', [userId])

    if (row2 !== undefined && 'id' in row2) {
      await global.db.query('DELETE from people_pre_send WHERE id=?', [userId])
      throw new Error(`dialog with id=${userId} found in dialogs table, deleted it from people_pre_send`)
    }

    await global.db.query('DELETE from people_pre_send WHERE id=?', [userId])

    const userName = row.name
    const userAge = row.age

    if ((await this.getTotalMsgCountInDialog(args)) > 0) {
      consoleLog(`dialog already started`)
      await global.db.update('REPLACE INTO people_worked SET id=?', [userId])
      return false
    }

    let sendPostcardRes = false

    try {
      sendPostcardRes = await global.AppRouter.route('messages/sendPostcard', args)
    } catch (e) {
      consoleLog(e.message)
    }

    if (!sendPostcardRes) {
      consoleLog(`error sending postcard`)
      await global.db.update('REPLACE INTO people_worked SET id=?', [userId])
      return false
    }

    consoleLog(`Postcard successfully sended`)

    await global.db.update('REPLACE INTO dialogs SET id=?, botId=?, name=?, age=?, context=""', [
      userId,
      global.botId,
      userName,
      userAge,
    ])
    return true
  }

  async watchDialogAction(args) {
    if (!args.param1) {
      consoleLog(`args.param1 not set`)
      return false
    }

    const userId = parseInt(args.param1)

    let delTest = await global.db.getrow(
      'SELECT * FROM actions_queue WHERE route="messages/deleteDialog" AND param1=?',
      [userId.toString()],
    )

    if (delTest !== undefined && 'id' in delTest) {
      consoleLog(`delete action found for this dialog`)
      return true
    }

    let row = await global.db.getrow('SELECT * FROM dialogs WHERE id=? AND botId=?', [userId, global.botId])

    if (row === undefined || !('id' in row)) {
      throw new Error(`record in dialogs not found for id=${userId} and botId=${global.botId}`)
    }

    const userName = row.name
    const userAge = row.age

    // если в диалоге не осталось сообщений ­— удаляем его полностью

    if ((await this.getTotalMsgCountInDialog(args)) == 0) {
      consoleLog('we have not messages in the dialog. so, deleting it completely...')
      let resDelDialog = false
      try {
        resDelDialog = await global.AppRouter.route('messages/deleteDialog', args)
      } catch (e) {
        consoleLog(e.message)
        return false
      }

      return resDelDialog
    }

    if (row.countMsgSended >= 10) {
      consoleLog(`countMsgSended >= 10 for id=${userId}`)
      return false
    }

    if (row.countMsgSended == 0 || !row.context.length) {
      // мы отправили только открытку. значит, ждём прочтения письма и отправляем текстовое сообщение

      let isDialogOpenedRes = false
      try {
        isDialogOpenedRes = await global.AppRouter.route('messages/isDialogOpened', args)
      } catch (e) {
        consoleLog(e.message)
      }

      if (!isDialogOpenedRes && row.time && !row.time2) {
        // Преобразуем time2 в объект Date
        const time2Date = new Date(row.time)

        // Получаем текущее время
        const currentTime = new Date()

        // Вычисляем время 4 часа назад
        const fourHoursAgo = new Date(currentTime.getTime() - 4 * 60 * 60 * 1000)

        // Сравниваем time2 с временем 5 часов назад
        if (time2Date < fourHoursAgo) {
          consoleLog('time older 4 hours and time2 not set. sending sticker...')

          let sendStickerRes = false

          try {
            sendStickerRes = await global.AppRouter.route('messages/sendSticker', args)
          } catch (e) {
            consoleLog(e.message)
          }

          if (sendStickerRes) {
            await global.db.update('UPDATE dialogs SET time2=NOW() WHERE id=?', [userId])
          }
        }
      }

      if (isDialogOpenedRes) {
        consoleLog(`dialog is opened, sending first text msg...`)

        const context = [
          {
            role: 'system',
            content: `Тебя зовут ${global.botVars.name}, тебе ${global.botVars.age} лет. Ты общаешься с пользователем "${userName}", которому ${userAge} лет. Вы общаетесь в соц. сети "одноклассники". С твоей стороны было приветвенное сообщение и было отправлено видеоклип. Твоя задача: очень вежливо и деликатно предложи [...]. Расскажи, как [...]. Всё это должно быть очень ненавязчиво, но без лишней воды. Твоя задача — заинтересовать человека, но ни в коем случае не выглядеть навязчиво. Далее просто поддерживай приятное общение на любые интересующие человека темы (можешь, например, загадать какую-то загадку). Пользователь не должен догадаться, что ты робот. Также, между прочим, предложи добавиться к тебе в друзья.`,
          },
        ]

        try {
          await global.AppRouter.route('messages/getMessages', args)
        } catch (e) {
          consoleLog(e.message)
        }

        if (args.foundMsgText) {
          context.push({
            role: 'user',
            content: args.foundMsgText,
          })
        }

        let chatResponse = await sendAIReq(context)

        consoleLog(`got answer from Chat GPT: ${chatResponse}`)

        try {
          args.param1 = chatResponse
          await global.AppRouter.route('messages/sendMessage', args)
        } catch (e) {
          consoleLog(e.message)
          consoleLog(`deleting the dialog...`)

          try {
            await global.AppRouter.route('messages/deleteDialog', args)
          } catch (e) {
            consoleLog(e.message)
          }

          return false
        }

        consoleLog(`Message successfully sended`)
        context.push({ role: 'assistant', content: chatResponse })

        if (!row.time2) {
          // сообщения отправились сразу после первого стикера
          await global.db.update(
            'UPDATE dialogs SET countMsgSended=countMsgSended+1, time2=NOW(), context=? WHERE id=?',
            [JSON.stringify(context), userId],
          )
        } else {
          // после первого стикера был отправлен еще один, поэтому не обновляем time2
          await global.db.update('UPDATE dialogs SET countMsgSended=countMsgSended+1, context=? WHERE id=?', [
            JSON.stringify(context),
            userId,
          ])
        }

        /////////////////////////////////////////////
        // отправляем видео

        let sendVideoRes = false

        await global.db.update('REPLACE INTO video_sended SET profileId=?, userId=?', [
          global.botVars.profileId,
          userId,
        ])

        try {
          sendVideoRes = await global.AppRouter.route('messages/sendVideo', args)
        } catch (e) {
          consoleLog(e.message)
        }

        if (!sendVideoRes) {
          consoleLog('error sending video')
        }
        /////////////////////////////////////////////

      } else {
        consoleLog(`waiting for receiver open the msg...`)
        // прибавим 30 минут к тайм вотчу
        await global.db.update('UPDATE dialogs SET timeWatched = DATE_ADD(NOW(), INTERVAL 90 MINUTE) WHERE id=?', [
          userId,
        ])
      }

      return true
    }

    let watchMsgRes = false

    try {
      watchMsgRes = await global.AppRouter.route('messages/getMessages', args)
    } catch (e) {
      consoleLog(e.message)
    }

    if (!watchMsgRes) {
      let noBreak = false

      if (row.time2 && row.countMsgSended == 1) {
        // Преобразуем time2 в объект Date
        const time2Date = new Date(row.time2)

        // Получаем текущее время
        const currentTime = new Date()

        // Вычисляем время 5 часов назад
        const fourHoursAgo = new Date(currentTime.getTime() - 4 * 60 * 60 * 1000)

        // Сравниваем time2 с временем 5 часов назад
        if (time2Date < fourHoursAgo) {
          consoleLog('time2 older 4 hours. sending another msg...')
          noBreak = true
          watchMsgRes = true
          args.foundMsgText = ' '
        }
      }

      if (!noBreak) {
        consoleLog(`error watching msg: no answer or another error`)
        return true
      }
    }

    const context = [
      ...JSON.parse(row.context),
      {
        role: 'user',
        content: args.foundMsgText,
      },
    ]

    console.log(`context:`)
    console.log(context)

    let chatResponse = await sendAIReq(context)

    consoleLog(`got answer from Chat GPT: ${chatResponse}`)

    let sendMsgRes = false

    try {
      args.param1 = chatResponse
      sendMsgRes = await global.AppRouter.route('messages/sendMessage', args)
    } catch (e) {
      consoleLog(e.message)
    }

    if (!sendMsgRes) {
      consoleLog(`error sending message, deleting the dialog...`)

      try {
        await global.AppRouter.route('messages/deleteDialog', args)
      } catch (e) {
        consoleLog(e.message)
      }

      return false
    }

    consoleLog(`Message successfully sended`)
    context.push({ role: 'assistant', content: chatResponse })

    await global.db.update('UPDATE dialogs SET countMsgSended=countMsgSended+1, context=? WHERE id=?', [
      JSON.stringify(context),
      userId,
    ])

    return true
  }
}

module.exports = MessagesPageController
