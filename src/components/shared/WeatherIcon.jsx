import React, { memo, useMemo } from 'react';

// Константы для маппинга иконок
const weatherIconMapping = {
  "01d": "day.svg", "01n": "night.svg",
  "02d": "cloudy-day-1.svg", "02n": "cloudy-night-1.svg",
  "03d": "cloudy-day-2.svg", "03n": "cloudy-night-2.svg",
  "04d": "cloudy-day-3.svg", "04n": "cloudy-night-3.svg",
  "09d": "rainy-1.svg", "09n": "rainy-2.svg",
  "10d": "rainy-3.svg", "10n": "rainy-4.svg",
  "11d": "rainy-5.svg", "11n": "rainy-6.svg",
  "13d": "snowy-1.svg", "13n": "snowy-2.svg",
  "50d": "weather.svg", "50n": "weather.svg"
};

/**
 * Компонент иконки погоды с оптимизацией производительности
 */
const WeatherIcon = memo(({ 
  iconCode = '01d', 
  size = 40,
  className = '' 
}) => {
  // Мемоизируем генерацию URL иконки
  const iconSrc = useMemo(() => {
    return `/weather-icons/${weatherIconMapping[iconCode] || 'weather.svg'}`;
  }, [iconCode]);

  return (
    <div 
      className={`ios-weather-icon ${className}`} 
      style={{ 
        lineHeight: 0,
        willChange: 'transform' // Подсказка браузеру для оптимизации
      }}
    >
      <img 
        src={iconSrc} 
        alt="Weather icon" 
        width={size} 
        height={size} 
        loading="lazy" // Ленивая загрузка
        decoding="async" // Асинхронное декодирование
        style={{
          display: 'inline-block', 
          transition: 'transform 0.2s ease',
          willChange: 'transform' // Подсказка браузеру
        }}
      />
    </div>
  );
});

WeatherIcon.displayName = 'WeatherIcon';

export default WeatherIcon;
