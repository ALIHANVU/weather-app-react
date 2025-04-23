import { getCurrentSeason } from './dateUtils'
import { loadFarmerTips } from './api'

// Иконки погоды в emoji формате
export const weatherEmoji = {
  "01d": "☀️", "01n": "🌙",
  "02d": "⛅", "02n": "☁️",
  "03d": "☁️", "03n": "☁️",
  "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️",
  "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️",
  "13d": "🌨️", "13n": "🌨️",
  "50d": "🌫️", "50n": "🌫️"
}

// Константы для пороговых значений температуры
export const TEMPERATURE_THRESHOLDS = {
  TOO_COLD: 0,  // Слишком холодно для большинства растений (заморозки)
  TOO_HOT: 30   // Слишком жарко для большинства растений (тепловой стресс)
}

/**
 * Проверяет, является ли температура экстремальной для растений
 * @param {number} temperature - Температура в градусах Цельсия
 * @returns {boolean} true, если температура экстремальная
 */
export function isExtremeTemperatureForPlants(temperature) {
  return temperature <= TEMPERATURE_THRESHOLDS.TOO_COLD || 
         temperature >= TEMPERATURE_THRESHOLDS.TOO_HOT
}

/**
 * Генерирует советы для фермеров на основе погодных данных
 * @param {Object} weatherData - Данные о погоде
 * @returns {Promise<Array<string>>} Массив советов
 */
export async function generateFarmerTips(weatherData) {
  try {
    const tips = await loadFarmerTips()
    if (!tips) {
      return getDefaultTips()
    }

    const result = []
    const temp = weatherData.main.temp
    const humidity = weatherData.main.humidity

    // Температурные советы
    if (temp >= 25) result.push(...tips.temperature.hot.tips)
    else if (temp >= 15) result.push(...tips.temperature.moderate.tips)
    else result.push(...tips.temperature.cold.tips)

    // Советы по влажности
    if (humidity >= 70) result.push(...tips.humidity.high.tips)
    else if (humidity >= 40) result.push(...tips.humidity.normal.tips)
    else result.push(...tips.humidity.low.tips)

    // Сезонные советы
    result.push(...tips.seasons[getCurrentSeason()].tips)

    // Удаляем дубликаты и ограничиваем количество
    return [...new Set(result)].slice(0, 5)
  } catch (error) {
    console.warn('Ошибка генерации советов:', error.message)
    return getDefaultTips()
  }
}

/**
 * Возвращает набор стандартных советов
 * @returns {Array<string>} Массив советов
 */
export function getDefaultTips() {
  return [
    "Поливайте растения в соответствии с погодными условиями", 
    "Следите за состоянием почвы", 
    "Защищайте растения от экстремальных погодных условий"
  ]
}

/**
 * Группирует данные прогноза по дням
 * @param {Object} forecast - Данные прогноза
 * @returns {Object} Прогноз, сгруппированный по дням
 */
export function groupForecastByDays(forecast) {
  try {
    const dailyForecasts = {}
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000)
      const day = date.toISOString().split('T')[0]
      
      // Создаем объект для нового дня, если его еще нет
      if (!dailyForecasts[day]) {
        dailyForecasts[day] = {
          date: day,
          temps: [],
          humidity: [],
          windSpeed: [],
          visibility: [],
          feelsLike: [],
          weather: [],
          weatherData: [],
          day: date.toLocaleDateString('ru-RU', { weekday: 'long' }),
          shortDay: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
          hourlyData: []
        }
      }
      
      // Добавляем данные для текущего временного интервала
      dailyForecasts[day].temps.push(item.main.temp)
      dailyForecasts[day].humidity.push(item.main.humidity)
      dailyForecasts[day].windSpeed.push(item.wind.speed)
      dailyForecasts[day].visibility.push(item.visibility)
      dailyForecasts[day].feelsLike.push(item.main.feels_like)
      
      if (item.weather && item.weather[0]) {
        dailyForecasts[day].weather.push(item.weather[0].icon)
        dailyForecasts[day].weatherData.push(item.weather[0])
      }
      
      // Сохраняем полные данные для почасового прогноза
      dailyForecasts[day].hourlyData.push(item)
    })
    
    return dailyForecasts
  } catch (error) {
    console.warn('Ошибка группировки прогноза по дням:', error.message)
    return {}
  }
}

/**
 * Получает наиболее частую иконку погоды из массива
 * @param {Array} icons - Массив иконок погоды
 * @returns {string} Наиболее частая иконка
 */
export function getMostFrequentIcon(icons) {
  if (!icons || icons.length === 0) return "01d" // Иконка по умолчанию
  
  const iconCounts = {}
  icons.forEach(icon => {
    if (!iconCounts[icon]) {
      iconCounts[icon] = 0
    }
    iconCounts[icon]++
  })
  
  let maxIcon = "01d"
  let maxCount = 0
  
  Object.entries(iconCounts).forEach(([icon, count]) => {
    if (count > maxCount) {
      maxCount = count
      maxIcon = icon
    }
  })
  
  return maxIcon
}

/**
 * Получает наиболее частое описание погоды из массива
 * @param {Array} weatherData - Массив данных о погоде
 * @returns {string} Наиболее частое описание
 */
export function getMostFrequentDescription(weatherData) {
  if (!weatherData || weatherData.length === 0) return "ясно" // Описание по умолчанию
  
  const descriptionCounts = {}
  weatherData.forEach(data => {
    const description = data.description
    if (!descriptionCounts[description]) {
      descriptionCounts[description] = 0
    }
    descriptionCounts[description]++
  })
  
  let maxDescription = "ясно"
  let maxCount = 0
  
  Object.entries(descriptionCounts).forEach(([description, count]) => {
    if (count > maxCount) {
      maxCount = count
      maxDescription = description
    }
  })
  
  return maxDescription
}
