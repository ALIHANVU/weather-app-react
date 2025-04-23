// API ключ для OpenWeatherMap
const API_KEY = 'c708426913319b328c4ff4719583d1c6'
// Базовый URL для API
const BASE_URL = 'https://api.openweathermap.org'
// Таймауты для запросов
const TIMEOUTS = {
  API_REQUEST: 5000 // 5 секунд
}

/**
 * Получает данные о погоде через API с повторными попытками
 * @param {string} city - Название города
 * @param {number} retries - Количество повторных попыток
 * @returns {Promise<Object>} Данные о погоде
 */
export async function fetchWeatherData(city, retries = 2) {
  try {
    console.log('Запрашиваем погоду для города:', city)
    
    // Создаем URL для прямого геокодирования
    const geoUrl = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    
    console.log('Отправляем запрос к Geo API:', geoUrl)
    
    // Добавляем таймаут к запросу
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.API_REQUEST);
    
    try {
      // Прямой запрос к API геокодирования для получения координат города
      const geoResponse = await fetch(geoUrl, { 
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      clearTimeout(timeoutId);
      
      if (!geoResponse.ok) {
        throw new Error(`Ошибка геокодирования: ${geoResponse.status}`)
      }
      
      const geoData = await geoResponse.json()
      console.log('Ответ от Geo API:', geoData)
      
      // Если город не найден, пробуем искать через альтернативный API
      if (!geoData || geoData.length === 0) {
        console.log('Город не найден через основной API, пробуем прямой запрос погоды')
        
        // Пробуем прямой запрос текущей погоды по названию города
        const directWeatherUrl = `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=ru&appid=${API_KEY}`
        
        console.log('Отправляем прямой запрос текущей погоды:', directWeatherUrl)
        
        // Новый контроллер для нового запроса
        const weatherController = new AbortController();
        const weatherTimeoutId = setTimeout(() => weatherController.abort(), TIMEOUTS.API_REQUEST);
        
        const weatherResponse = await fetch(directWeatherUrl, { 
          signal: weatherController.signal,
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        clearTimeout(weatherTimeoutId);
        
        if (!weatherResponse.ok) {
          throw new Error(`Город не найден: ${weatherResponse.status}`)
        }
        
        const weather = await weatherResponse.json()
        
        // Получаем координаты из ответа по погоде
        const { lat, lon } = weather.coord
        
        // Теперь получаем прогноз по координатам
        const forecastUrl = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`
        console.log('Получаем прогноз по координатам:', forecastUrl)
        
        // Новый контроллер для запроса прогноза
        const forecastController = new AbortController();
        const forecastTimeoutId = setTimeout(() => forecastController.abort(), TIMEOUTS.API_REQUEST);
        
        const forecastResponse = await fetch(forecastUrl, { 
          signal: forecastController.signal,
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        clearTimeout(forecastTimeoutId);
        
        if (!forecastResponse.ok) {
          throw new Error(`Ошибка получения прогноза: ${forecastResponse.status}`)
        }
        
        const forecast = await forecastResponse.json()
        
        return { weather, forecast }
      }
      
      // Получаем координаты из результата геокодирования
      const { lat, lon, name } = geoData[0]
      
      console.log('Получены координаты:', lat, lon, 'для города:', name)
      
      // Теперь получаем текущую погоду и прогноз по координатам
      const weatherUrl = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`
      const forecastUrl = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`
      
      console.log('Запрашиваем текущую погоду и прогноз по координатам')
      
      // Выполняем параллельные запросы для текущей погоды и прогноза
      const weatherController = new AbortController();
      const forecastController = new AbortController();
      
      const weatherTimeoutId = setTimeout(() => weatherController.abort(), TIMEOUTS.API_REQUEST);
      const forecastTimeoutId = setTimeout(() => forecastController.abort(), TIMEOUTS.API_REQUEST);
      
      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(weatherUrl, { 
            signal: weatherController.signal,
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            }
          }),
          fetch(forecastUrl, { 
            signal: forecastController.signal,
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        ]);
        
        clearTimeout(weatherTimeoutId);
        clearTimeout(forecastTimeoutId);
        
        if (!weatherResponse.ok) {
          throw new Error(`Ошибка получения текущей погоды: ${weatherResponse.status}`)
        }
        
        if (!forecastResponse.ok) {
          throw new Error(`Ошибка получения прогноза: ${forecastResponse.status}`)
        }
        
        const weather = await weatherResponse.json()
        const forecast = await forecastResponse.json()
        
        // Сохраняем название города из запроса пользователя
        weather.name = name || city
        
        return { weather, forecast }
      } catch (parallelError) {
        clearTimeout(weatherTimeoutId);
        clearTimeout(forecastTimeoutId);
        throw parallelError;
      }
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
