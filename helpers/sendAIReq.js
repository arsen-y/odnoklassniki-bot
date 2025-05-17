async function sendAIReq(context) {
  try {

    const response = await global.openaiAPI.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: context,
    })

    return response.choices[0].message.content
  } catch(e) {
    consoleLog(`chat gpt api error`)
    throw new Error(e.message)
  }
  
}

module.exports = { sendAIReq }
