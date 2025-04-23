/**
 * Форматирует время из timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Отформатированное время
 */
export function formatTime(timestamp) {
  try {
    return new Date(timestamp * 1000).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } catch (error) {
    console.warn('Ошибка форматирования времени:', error)
    return '--:--'
  }
}

/**
 * Определяет день недели из timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Название дня недели
 */
export function getDayOfWeek(timestamp) {
  try {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    return days[new Date(timestamp * 1000).getDay()]
  } catch (error) {
    console.warn('Ошибка определения дня недели:', error)
    return 'День'
  }
}

/**
 * Определяет короткое название дня недели из timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Короткое название дня недели
 */
export function getShortDayOfWeek(timestamp) {
  try {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    return days[new Date(timestamp * 1000).getDay()]
  } catch (error) {
    console.warn('Ошибка определения дня недели:', error)
    return 'Дн'
  }
}

/**
 * Определяет текущий сезон
 * @returns {string} Сезон (spring/summer/autumn/winter)
 */
export function getCurrentSeason() {
  try {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'autumn'
    return 'winter'
  } catch (error) {
    console.warn('Ошибка определения сезона:', error)
    return 'spring'
  }
}

/**
 * Форматирует дату в формате "DD.MM"
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Отформатированная дата (например, "01.05")
 */
export function formatDate(timestamp) {
  try {
    const date = new Date(timestamp * 1000)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${day}.${month}`
  } catch (error) {
    console.warn('Ошибка форматирования даты:', error)
    return '--.--.--'
  }
}

/**
 * Проверяет, является ли timestamp сегодняшним днем
 * @param {number} timestamp - Unix timestamp
 * @returns {boolean} true, если timestamp соответствует сегодняшнему дню
 */
export function isToday(timestamp) {
  try {
    const today = new Date()
    const date = new Date(timestamp * 1000)
    return today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
  } catch (error) {
    console.warn('Ошибка проверки на сегодняшний день:', error)
    return false
  }
}
