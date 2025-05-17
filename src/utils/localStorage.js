
// Константы для хранилища
const STORAGE_KEYS = {
  WEATHER_CACHE: 'weatherDataCache',
  LAST_CITY: 'lastLoadedCity'
}

// Время кеширования - 30 минут
const CACHE_DURATION = 30 * 60 * 1000

/**
 * Безопасное сохранение данных в localStorage
 * @param {string} key - Ключ хранения
 * @param {*} data - Данные для сохранения
 */
function safeSetItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Ошибка localStorage:', error);
  }
}

/**
 * Безопасное получение данных из localStorage
 * @param {string} key - Ключ хранения
 * @returns {Object|null} Сохраненные данные
 */
function safeGetItem(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, timestamp } = JSON.parse(item);
    
    // Проверка давности кеша
    return (Date.now() - timestamp < CACHE_DURATION) ? data : null;
  } catch (error) {
    console.warn('Ошибка чтения localStorage:', error);
    return null;
  }
}

/**
 * Сохраняет данные о погоде в кеш
 * @param {string} city - Название города
 * @param {Object} data - Данные о погоде
 */
export function cacheWeatherData(city, data) {
  if (!city || !data) return;
  
  safeSetItem(STORAGE_KEYS.WEATHER_CACHE, { city, data });
  safeSetItem(STORAGE_KEYS.LAST_CITY, city);
}

/**
 * Получает кешированные данные о погоде
 * @returns {Object|null} Кешированные данные
 */
export function getCachedWeatherData() {
  return safeGetItem(STORAGE_KEYS.WEATHER_CACHE);
}

/**
 * Получает последний использованный город
 * @returns {string|null} Название города
 */
export function getLastCity() {
  return safeGetItem(STORAGE_KEYS.LAST_CITY) || 'Москва';
}

/**
 * Очищает устаревшие данные из хранилища
 */
export function cleanupStorage() {
  try {
    const keys = [
      STORAGE_KEYS.WEATHER_CACHE,
      STORAGE_KEYS.LAST_CITY
    ];

    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        const { timestamp } = JSON.parse(item);
        if (Date.now() - timestamp > CACHE_DURATION) {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn('Ошибка очистки хранилища:', error);
  }
}

// Периодическая очистка при загрузке
cleanupStorage();
