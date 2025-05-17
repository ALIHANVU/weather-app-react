// Таймауты и настройки
const TIMEOUTS = {
  API_REQUEST: 10000, // 10 секунд
  CACHE_DURATION: 30 * 60 * 1000 // 30 минут
}

// Кеширование данных о погоде
function cacheWeatherData(city, data) {
  try {
    localStorage.setItem(`weather_cache_${city}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Ошибка кеширования:', error);
  }
}

// Получение кешированных данных
function getCachedWeatherData(city) {
  try {
    const cachedData = localStorage.getItem(`weather_cache_${city}`);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      return (Date.now() - timestamp < TIMEOUTS.CACHE_DURATION) ? data : null;
    }
  } catch (error) {
    console.warn('Ошибка получения кеша:', error);
  }
  return null;
}

// Фоллбек данные
const FALLBACK_DATA = {
  weather: {
    name: 'Москва',
    main: { 
      temp: 15, 
      feels_like: 14, 
      temp_max: 17, 
      temp_min: 13, 
      humidity: 70 
    },
    weather: [{ description: 'данные недоступны', icon: '01d' }],
    wind: { speed: 2.5 },
    visibility: 10000
  },
  forecast: {
    list: Array(8).fill().map((_, index) => ({
      dt: Math.floor(Date.now() / 1000) + index * 3600,
      main: { 
        temp: 15 - index % 3, 
        humidity: 70, 
        feels_like: 14 
      },
      weather: [{ icon: '01d' }],
      wind: { speed: 2.5 },
      visibility: 10000
    }))
  }
};

/**
 * Получает данные о погоде через Vercel API Routes с расширенной обработкой
 * @param {string} city - Название города
 * @param {number} retries - Количество повторных попыток
 * @returns {Promise<Object>} Данные о погоде
 */
export async function fetchWeatherData(city, retries = 2) {
  const cachedData = getCachedWeatherData(city);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log('Запрашиваем погоду для города:', city);
    
    const apiUrl = `/api/weather?city=${encodeURIComponent(city)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.API_REQUEST);
    
    try {
      const response = await fetch(apiUrl, { 
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Валидация данных
      if (!data || (!data.weather && !data.error)) {
        throw new Error('Неверный формат данных');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Кешируем успешный ответ
      cacheWeatherData(city, data);
      
      return data;
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.warn('Превышено время ожидания');
        return FALLBACK_DATA;
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('Ошибка получения данных о погоде:', error.message);
    
    // Повторные попытки с задержкой
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWeatherData(city, retries - 1);
    }
    
    // Возвращаем данные по умолчанию
    return FALLBACK_DATA;
  }
}

// Загрузка советов для фермеров
export async function loadFarmerTips(retries = 2) {
  try {
    const timestamp = new Date().getTime();
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
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.warn('Превышено время ожидания советов');
        return getDefaultTips();
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.warn('Ошибка загрузки советов:', error.message);
    
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return loadFarmerTips(retries - 1);
    }
    
    return getDefaultTips();
  }
}

// Резервные советы
function getDefaultTips() {
  return {
    temperature: {
      hot: { tips: ["Поливайте растения рано утром или вечером"] },
      moderate: { tips: ["Хорошее время для ухода за растениями"] },
      cold: { tips: ["Защитите растения от холода"] }
    },
    humidity: {
      high: { tips: ["Следите за вентиляцией"] },
      normal: { tips: ["Поддерживайте регулярный полив"] },
      low: { tips: ["Увеличьте орошение"] }
    },
    seasons: {
      spring: { tips: ["Подготовьте почву"] },
      summer: { tips: ["Защитите растения от перегрева"] },
      autumn: { tips: ["Подготовьте сад к зиме"] },
      winter: { tips: ["Защитите растения от мороза"] }
    }
  };
}
