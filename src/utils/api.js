// Таймауты для запросов
const TIMEOUTS = {
  API_REQUEST: 5000 // 5 секунд
}

/**
 * Получает данные о погоде через Vercel API Routes с повторными попытками
 * @param {string} city - Название города
 * @param {number} retries - Количество повторных попыток
 * @returns {Promise<Object>} Данные о погоде
 */
export async function fetchWeatherData(city, retries = 2) {
  try {
    console.log('Запрашиваем погоду для города:', city)
    
    // Создаем URL для API маршрута
    // Для локальной разработки используем относительный путь
    // URL сам определит, обращаться к /api/weather локально или на продакшене
    const apiUrl = `/api/weather?city=${encodeURIComponent(city)}`
    
    console.log('Отправляем запрос к API:', apiUrl)
    
    // Добавляем таймаут к запросу
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.API_REQUEST);
    
    try {
      // Запрос к нашему API маршруту
      const response = await fetch(apiUrl, { 
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`)
      }
      
      return await response.json()
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Ошибка получения данных о погоде:', error.message)
    
    // Повторные попытки с задержкой
    if (retries > 0) {
      console.log(`Повторная попытка (осталось ${retries}). Ожидание 1 секунду...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWeatherData(city, retries - 1);
    }
    
    throw error
  }
}

/**
 * Загружает советы для фермеров с механизмом повторных попыток
 * @returns {Promise<Object>} Советы
 */
export async function loadFarmerTips(retries = 2) {
  try {
    // Добавляем параметр с временем для предотвращения кеширования
    const timestamp = new Date().getTime()
    
    // Устанавливаем таймаут
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.API_REQUEST);
    
    try {
      const response = await fetch(`/farmer-tips.json?${timestamp}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.warn('Ошибка загрузки советов:', error.message)
    
    // Повторные попытки с задержкой
    if (retries > 0) {
      console.log(`Повторная попытка загрузки советов (осталось ${retries}). Ожидание 1 секунду...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return loadFarmerTips(retries - 1);
    }
    
    // Резервные советы, если сервер недоступен
    return {
      "temperature": {
        "hot": {
          "tips": ["Поливайте растения рано утром или вечером", "Используйте мульчу для удержания влаги"]
        },
        "moderate": {
          "tips": ["Идеальное время для обрезки растений", "Проверьте наличие вредителей на растениях"]
        },
        "cold": {
          "tips": ["Защитите растения от заморозков", "Ограничьте полив в холодную погоду"]
        }
      },
      "humidity": {
        "high": {
          "tips": ["Следите за появлением грибковых заболеваний", "Обеспечьте хорошую вентиляцию растений"]
        },
        "normal": {
          "tips": ["Поддерживайте регулярный полив", "Проверьте влажность почвы перед поливом"]
        },
        "low": {
          "tips": ["Увеличьте частоту полива", "Используйте системы капельного орошения"]
        }
      },
      "seasons": {
        "spring": {
          "tips": ["Подготовьте грядки к посадке", "Начните высаживать холодостойкие культуры"]
        },
        "summer": {
          "tips": ["Защитите растения от перегрева", "Собирайте урожай регулярно"]
        },
        "autumn": {
          "tips": ["Подготовьте сад к зиме", "Время для посадки озимых культур"]
        },
        "winter": {
          "tips": ["Защитите многолетние растения от мороза", "Планируйте посадки на следующий сезон"]
        }
      }
    }
  }
}
