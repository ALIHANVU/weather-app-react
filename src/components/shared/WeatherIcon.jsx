import React from 'react';

// Маппинг иконок погоды с учетом интенсивности
const weatherIconMapping = {
  // Ясно
  '01d': 'day.svg',
  '01n': 'night.svg',
  
  // Облачность: от легкой до плотной
  '02d': 'cloudy-day-1.svg',  // Легкая облачность
  '02n': 'cloudy-night-1.svg',
  '03d': 'cloudy-day-2.svg',  // Умеренная облачность
  '03n': 'cloudy-night-2.svg',
  '04d': 'cloudy-day-3.svg',  // Сплошная облачность
  '04n': 'cloudy-night-3.svg',
  
  // Дождь: от легкого до сильного
  '09d': 'rainy-1.svg',  // Легкий дождь
  '09n': 'rainy-2.svg',
  '10d': 'rainy-3.svg',  // Умеренный дождь
  '10n': 'rainy-4.svg',
  '11d': 'rainy-5.svg',  // Сильный дождь/гроза
  '11n': 'rainy-6.svg',
  
  // Снег: от легкого до сильного
  '13d': 'snowy-1.svg',  // Легкий снег
  '13n': 'snowy-2.svg',
  // Для особо сильных осадков можно использовать дополнительные файлы
  
  // Туман
  '50d': 'weather.svg',
  '50n': 'weather.svg'
};

/**
 * Компонент иконки погоды с использованием анимированных SVG
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.iconCode - Код иконки от OpenWeatherMap (например, "01d")
 * @param {number} props.size - Размер иконки в пикселях
 * @returns {JSX.Element}
 */
const WeatherIcon = ({ iconCode = '01d', size = 40 }) => {
  // Получаем имя файла, используя маппинг или файл по умолчанию
  const iconFileName = weatherIconMapping[iconCode] || 'weather.svg';

  return (
    <div className="ios-weather-icon" style={{ lineHeight: 0 }}>
      <img 
        src={`/weather-icons/${iconFileName}`} 
        alt="Weather icon" 
        width={size} 
        height={size} 
        style={{ 
          display: 'inline-block', 
          transition: 'transform 0.2s ease',
        }}
      />
    </div>
  );
};

export default WeatherIcon;
