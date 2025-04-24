import React from 'react';

/**
 * Компонент иконки погоды в современном минималистичном стиле
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.iconCode - Код иконки от OpenWeatherMap (например, "01d")
 * @param {number} props.size - Размер иконки в пикселях
 * @returns {JSX.Element}
 */
const WeatherIcon = ({ iconCode = '01d', size = 40 }) => {
  // Современная цветовая палитра
  const colors = {
    sunny: {
      base: '#FFC107',
      rays: '#FF9800'
    },
    cloudy: {
      light: '#E0E0E0',
      dark: '#9E9E9E'
    },
    rainy: {
      base: '#2196F3',
      drops: '#03A9F4'
    },
    snowy: {
      base: '#FFFFFF',
      flakes: '#B0BEC5'
    },
    night: {
      base: '#607D8B',
      moon: '#90A4AE'
    },
    stormy: {
      base: '#9C27B0',
      lightning: '#673AB7'
    }
  };

  const renderIcon = () => {
    switch (iconCode) {
      // Ясно, день
      case '01d':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" fill={colors.sunny.base} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
              <line 
                key={index}
                x1="50" 
                y1="20" 
                x2="50" 
                y2="10" 
                transform={`rotate(${angle} 50 50)`}
                stroke={colors.sunny.rays} 
                strokeWidth="4" 
                strokeLinecap="round"
              />
            ))}
          </svg>
        );

      // Ясно, ночь
      case '01n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M60 40C60 60 45 75 25 75C25 75 35 85 55 85C75 85 85 65 80 45C75 25 60 25 60 40Z" 
              fill={colors.night.base}
            />
            <path 
              d="M55 35C55 45 45 55 32 55C32 55 35 65 47 65C59 65 65 50 61 40C57 30 55 25 55 35Z" 
              fill={colors.night.moon}
            />
          </svg>
        );

      // Малооблачно, день
      case '02d':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="40" r="25" fill={colors.sunny.base} />
            <path 
              d="M75 65C75 75 65 80 50 80C35 80 25 75 25 65C25 55 35 45 50 45C65 45 75 55 75 65Z" 
              fill={colors.cloudy.light} 
              stroke={colors.cloudy.dark} 
              strokeWidth="3"
            />
          </svg>
        );

      // Малооблачно, ночь
      case '02n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M45 35C45 45 35 55 22 55C22 55 25 65 37 65C49 65 55 50 51 40C47 30 45 25 45 35Z" 
              fill={colors.night.base}
            />
            <path 
              d="M75 65C75 75 65 80 50 80C35 80 25 75 25 65C25 55 35 45 50 45C65 45 75 55 75 65Z" 
              fill={colors.cloudy.light} 
              stroke={colors.cloudy.dark} 
              strokeWidth="3"
            />
          </svg>
        );

      // Дождь
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M75 50C75 60 65 65 50 65C35 65 25 60 25 50C25 40 35 30 50 30C65 30 75 40 75 50Z" 
              fill={colors.cloudy.light} 
              stroke={colors.cloudy.dark} 
              strokeWidth="3"
            />
            {[30, 50, 70].map((x, index) => (
              <React.Fragment key={index}>
                <line 
                  x1={x} 
                  y1="70" 
                  x2={x} 
                  y2="85" 
                  stroke={colors.rainy.base} 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <line 
                  x1={x-5} 
                  y1="75" 
                  x2={x-5} 
                  y2="90" 
                  stroke={colors.rainy.drops} 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </React.Fragment>
            ))}
          </svg>
        );

      // Гроза
      case '11d':
      case '11n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M75 50C75 60 65 65 50 65C35 65 25 60 25 50C25 40 35 30 50 30C65 30 75 40 75 50Z" 
              fill={colors.cloudy.dark} 
              stroke={colors.cloudy.light} 
              strokeWidth="3"
            />
            <path 
              d="M45 65L35 80H50L38 95" 
              stroke={colors.stormy.lightning} 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );

      // Снег
      case '13d':
      case '13n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M75 50C75 60 65 65 50 65C35 65 25 60 25 50C25 40 35 30 50 30C65 30 75 40 75 50Z" 
              fill={colors.cloudy.light} 
              stroke={colors.cloudy.dark} 
              strokeWidth="3"
            />
            {[30, 50, 70].map((x, index) => (
              <React.Fragment key={index}>
                <circle 
                  cx={x} 
                  cy="70" 
                  r="3" 
                  fill={colors.snowy.base} 
                  stroke={colors.snowy.flakes} 
                  strokeWidth="1"
                />
                <circle 
                  cx={x-10} 
                  cy="80" 
                  r="2" 
                  fill={colors.snowy.base} 
                  stroke={colors.snowy.flakes} 
                  strokeWidth="1"
                />
              </React.Fragment>
            ))}
          </svg>
        );

      // Туман
      case '50d':
      case '50n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[30, 50, 70].map((y, index) => (
              <line 
                key={index}
                x1="20" 
                y1={y} 
                x2="80" 
                y2={y} 
                stroke="#9E9E9E" 
                strokeWidth="3" 
                strokeLinecap="round"
                opacity="0.7"
              />
            ))}
          </svg>
        );

      // По умолчанию
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" fill={colors.sunny.base} />
          </svg>
        );
    }
  };

  return (
    <div className="ios-weather-icon" style={{ lineHeight: 0 }}>
      {renderIcon()}
    </div>
  );
};

export default WeatherIcon;
