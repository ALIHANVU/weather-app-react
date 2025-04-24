// API роут для получения данных о погоде через сервер Vercel
// Обходит ограничения CORS и защищает API ключ

export default async function handler(req, res) {
  // Получаем город из параметров запроса
  const { city } = req.query;
  
  // API ключ для OpenWeatherMap
  const API_KEY = "c708426913319b328c4ff4719583d1c6";
  
  // Добавляем заголовки CORS для возможных запросов с разных доменов
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  
  // Обрабатываем OPTIONS запросы (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Проверяем наличие параметра города
  if (!city) {
    return res.status(400).json({ error: 'Параметр city обязателен' });
  }
  
  try {
    console.log('Запрашиваем данные для города:', city);
    
    // Создаем URL для запроса геокодирования
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
    
    console.log('Отправляем запрос к Geo API');
    
    // Запрашиваем геоданные
    const geoResponse = await fetch(geoUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!geoResponse.ok) {
      throw new Error(`Ошибка геокодирования: ${geoResponse.status}`);
    }
    
    const geoData = await geoResponse.json();
    
    // Если город не найден, пробуем прямой запрос погоды
    if (!geoData || geoData.length === 0) {
      console.log('Город не найден через Geo API, пробуем прямой запрос погоды');
      
      // Прямой запрос погоды по названию города
      const directWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=ru&appid=${API_KEY}`;
      
      const weatherResponse = await fetch(directWeatherUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!weatherResponse.ok) {
        throw new Error(`Город не найден: ${weatherResponse.status}`);
      }
      
      const weather = await weatherResponse.json();
      
      // Получаем координаты из ответа погоды
      const { lat, lon } = weather.coord;
      
      // Получаем прогноз по координатам
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`;
      
      const forecastResponse = await fetch(forecastUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!forecastResponse.ok) {
        throw new Error(`Ошибка получения прогноза: ${forecastResponse.status}`);
      }
      
      const forecast = await forecastResponse.json();
      
      // Возвращаем данные клиенту
      return res.status(200).json({ weather, forecast });
    }
    
    // Получаем координаты из результата геокодирования
    const { lat, lon, name } = geoData[0];
    
    console.log('Получены координаты:', lat, lon, 'для города:', name);
    
    // Запрашиваем текущую погоду и прогноз параллельно
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`;
    
    console.log('Запрашиваем текущую погоду и прогноз');
    
    // Выполняем параллельные запросы
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }),
      fetch(forecastUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
    ]);
    
    if (!weatherResponse.ok) {
      throw new Error(`Ошибка получения текущей погоды: ${weatherResponse.status}`);
    }
    
    if (!forecastResponse.ok) {
      throw new Error(`Ошибка получения прогноза: ${forecastResponse.status}`);
    }
    
    const weather = await weatherResponse.json();
    const forecast = await forecastResponse.json();
    
    // Сохраняем название города из геокодирования
    weather.name = name || city;
    
    // Возвращаем данные клиенту
    return res.status(200).json({ weather, forecast });
    
  } catch (error) {
    console.error('API error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
