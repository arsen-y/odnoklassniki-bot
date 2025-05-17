async function getNextYouTubeLink() {
  const baseUrl = 'https://www.youtube.com/watch?v='

  try {
    // Получаем текущий индекс из global_vars
    const currentIndexResult = await global.db.query('SELECT vars FROM global_vars WHERE id = 3')
    //console.debug('currentIndexResult:', currentIndexResult)

    if (currentIndexResult.length === 0) {
      throw new Error('Record with id = 3 in global_vars not found.')
    }

    let currentIndex = parseInt(currentIndexResult[0].vars, 10)
    //console.debug('Parsed currentIndex:', currentIndex)

    if (isNaN(currentIndex) || currentIndex < 0) {
      throw new Error('Invalid currentIndex value')
    }

    // Получаем общее количество видео в youtube_data
    const countResult = await global.db.query('SELECT COUNT(*) as count FROM youtube_data')
    const totalVideos = parseInt(countResult[0].count, 10)
    //console.debug('Total videos:', totalVideos)

    if (isNaN(totalVideos) || totalVideos <= 0) {
      throw new Error('No videos available in youtube_data')
    }

    // Если индекс превышает или равен количество видео, обнуляем
    if (currentIndex >= totalVideos) {
      //console.debug(`currentIndex (${currentIndex}) >= totalVideos (${totalVideos}), resetting to 0`)
      currentIndex = 0
    }

    // Собираем запрос вручную, чтобы избежать проблем с параметризацией LIMIT
    const query = `SELECT video_id FROM youtube_data ORDER BY id ASC LIMIT ${currentIndex},1`
    //console.debug('Executing query:', query)
    const videoResult = await global.db.query(query)
    //console.debug('videoResult:', videoResult)

    if (videoResult.length === 0) {
      throw new Error('No records found in youtube_data.')
    }

    const videoId = videoResult[0].video_id
    const selectedLink = baseUrl + videoId
    //console.debug('Selected link:', selectedLink)

    // Обновляем индекс
    const newIndex = currentIndex + 1
    //console.debug('Updating index to:', newIndex)
    await global.db.query('UPDATE global_vars SET vars = ? WHERE id = 3', [newIndex])
    //console.debug('Updated global_vars.vars to', newIndex)

    return selectedLink
  } catch (error) {
    console.error('Error getting YouTube link:', error)
    throw error
  }
}

module.exports = { getNextYouTubeLink }
