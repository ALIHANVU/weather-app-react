// Ключи для хранилища
const CACHE_KEY = 'weatherData'
const LAST_CITY_KEY = 'lastLoadedCity'
const CACHE_EXPIRATION = 60 * 60 * 1000 // 1 час в миллисекундах

/**
 * Сохраняет данные о погоде в кеш
 * @param {string} city - Название города
 * @param {Object} data - Данные о погоде
 */
export function cacheWeatherData(city, data) {
  try {
    if (!city || !data) return
    
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      city,
      data,
      timestamp: Date.now()
    }))

    // Сохраняем последний город
    localStorage.setItem(LAST_CITY_KEY, city)
  } catch (error) {
    console.warn('Не удалось сохранить данные в кеш:', error)
  }
}

/**
 * Получает данные о погоде из кеша
 * @returns {Object|null} Кешированные данные или null
 */
export function getCachedWeatherData() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const parsedData = JSON.parse(cached)
    
    // Проверяем актуальность данных
    if (Date.now() - parsedData.timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    
    return parsedData
  } catch (error) {
    console.warn('Ошибка при получении данных из кеша:', error)
    return null
  }
}

/**
 * Получает последний использованный город
 * @returns {string|null} Название города или null
 */
export function getLastCity() {
  try {
    const lastCity = localStorage.getItem(LAST_CITY_KEY)
    return lastCity || null
  } catch (error) {
    console.warn('Ошибка при получении последнего города:', error)
    return null
  }
}

/**
 * Очищает устаревшие данные из хранилища
 */
export function cleanupStorage() {
  try {
    // Проверяем валидность кеша
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const parsedData = JSON.parse(cached)
        if (Date.now() - parsedData.timestamp > CACHE_EXPIRATION) {
          localStorage.removeItem(CACHE_KEY)
        }
      } catch (e) {
        localStorage.removeItem(CACHE_KEY)
      }
    }
  } catch (error) {
    console.warn('Ошибка при очистке хранилища:', error)
  }
}
