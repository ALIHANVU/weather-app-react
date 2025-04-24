// Таймауты и настройки для запросов
const CONFIG = {
  API_REQUEST_TIMEOUT: 10000, // 10 секунд
  RETRY_DELAY: 1000, // 1 секунда между повторными попытками
  MAX_RETRIES: 2, // Максимальное количество повторных попыток
  CACHE_TIME: 60 * 60 * 1000 // 1 час кэширования
}

/**
 * Создает URL с параметрами, избегая проблем с кодированием
 * @param {string} baseUrl - Базовый URL
 * @param {Object} params - Параметры для запроса
 * @returns {string} Сформированный URL
 */
function createUrl(baseUrl, params = {}) {
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}

/**
 * Универсальный метод безопасного выполнения fetch-запроса
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции для fetch
 * @returns {Promise<Object>} Данные ответа
 */
async function safeFetch(url, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_REQUEST_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...options.headers
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError') {
      throw new Error('Превышено время ожидания запроса')
    }
    
    throw error
  }
}

/**
 * Получает данные о погоде через API с расширенной обработкой ошибок
 * @param {string} city - Название города
 * @param {Object} [fetchOptions={}] - Дополнительные опции для запроса
 * @returns {Promise<Object>} Данные о погоде
 */
export async function fetchWeatherData(city, fetchOptions = {}) {
  const options = {
    retries: CONFIG.MAX_RETRIES,
    ...fetchOptions
  }

  const url = createUrl('/api/weather', { city })

  // Последовательность попыток с экспоненциальной задержкой
  for (let attempt = 0; attempt <= options.retries; attempt++) {
    try {
      const data = await safeFetch(url, {
        signal: options.signal
      })

      // Расширенная валидация данных
      if (!data || (!data.weather && !data.forecast)) {
        throw new Error('Неверный формат данных от API')
      }

      return data
    } catch (error) {
      // Последняя попытка - выбрасываем ошибку
      if (attempt === options.retries) {
        console.error('Критическая ошибка получения погоды:', error)
        throw error
      }

      // Логирование и экспоненциальная задержка
      console.warn(`Попытка ${attempt + 1}: ${error.message}`)
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * (2 ** attempt)))
    }
  }
}

/**
 * Загружает советы для фермеров с расширенной обработкой
 * @returns {Promise<Object>} Советы
 */
export async function loadFarmerTips() {
  const timestamp = Date.now()

  try {
    const response = await safeFetch(`/farmer-tips.json?${timestamp}`)
    return response
  } catch (error) {
    console.warn('Ошибка загрузки советов:', error.message)

    // Резервные советы с расширенной структурой
    return {
      temperature: {
        hot: {
          tips: [
            "Полив в ранние утренние или поздние вечерние часы",
            "Защита растений от перегрева",
            "Мульчирование для сохранения влаги"
          ]
        },
        moderate: {
          tips: [
            "Оптимальный период для agricultural работ",
            "Плановый осмотр растений",
            "Профилактика болезней"
          ]
        },
        cold: {
          tips: [
            "Защита от заморозков",
            "Ограничение полива",
            "Укрытие чувствительных культур"
          ]
        }
      },
      humidity: {
        high: { tips: ["Контроль грибковых заболеваний"] },
        normal: { tips: ["Стандартный уход за растениями"] },
        low: { tips: ["Увеличение частоты полива"] }
      }
    }
  }
}

// Дополнительные утилиты для обработки данных
export const apiUtils = {
  /**
   * Безопасное извлечение данных с fallback
   * @param {Object} data - Исходные данные
   * @param {string} path - Путь к свойству
   * @param {*} defaultValue - Значение по умолчанию
   * @returns {*} Извлеченное значение
   */
  safeGet: (data, path, defaultValue = null) => {
    return path.split('.').reduce(
      (acc, part) => acc && acc[part] !== undefined ? acc[part] : defaultValue, 
      data
    )
  }
}
