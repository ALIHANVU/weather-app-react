// Простой сервер для локальной разработки и тестирования API
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

// Включаем CORS
app.use(cors());

// Обработка API-маршрута /api/weather
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  const API_KEY = "c708426913319b328c4ff4719583d1c6";
  
  if (!city) {
    return res.status(400).json({ error: 'Параметр city обязателен' });
  }
  
  try {
    console.log('Запрашиваем данные для города:', city);
    
    // Создаем URL для запроса геокодирования
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
    
    // Запрашиваем геоданные
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {
      throw new Error(`Ошибка геокодирования: ${geoResponse.status}`);
    }
    
    const geoData = await geoResponse.json();
    
    // Если город не найден, пробуем прямой запрос погоды
    if (!geoData || geoData.length === 0) {
      // Прямой запрос погоды по названию города
      const directWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=ru&appid=${API_KEY}`;
      
      const weatherResponse = await fetch(directWeatherUrl);
      
      if (!weatherResponse.ok) {
        throw new Error(`Город не найден: ${weatherResponse.status}`);
      }
      
      const weather = await weatherResponse.json();
      
      // Получаем координаты из ответа погоды
      const { lat, lon } = weather.coord;
      
      // Получаем прогноз по координатам
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`;
      
      const forecastResponse = await fetch(forecastUrl);
      
      if (!forecastResponse.ok) {
        throw new Error(`Ошибка получения прогноза: ${forecastResponse.status}`);
      }
      
      const forecast = await forecastResponse.json();
      
      // Возвращаем данные клиенту
      return res.status(200).json({ weather, forecast });
    }
    
    // Получаем координаты из результата геокодирования
    const { lat, lon, name } = geoData[0];
    
    // Запрашиваем текущую погоду и прогноз параллельно
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`;
    
    // Выполняем параллельные запросы
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
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
});

// Статические файлы из папки public
app.use(express.static('dist'));

// Обработка всех остальных маршрутов - отдаем index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
