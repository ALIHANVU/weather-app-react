import React from 'react';

/**
 * Компонент иконки погоды в стиле iOS
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.iconCode - Код иконки от OpenWeatherMap (например, "01d")
 * @param {number} props.size - Размер иконки в пикселях
 * @returns {JSX.Element}
 */
const WeatherIcon = ({ iconCode = '01d', size = 40 }) => {
  // Определяем цвета для иконок в зависимости от темы
  const colors = {
    sunny: '#FFD60A', // Солнце
    moon: '#E0E0E0',  // Луна
    cloud: '#FFFFFF',  // Облака
    darkCloud: '#CCCCCC', // Тёмные облака
    rain: '#91C0F8',   // Дождь
    snow: '#FFFFFF',  // Снег
    thunder: '#FFD60A', // Гроза (молния)
    mist: '#CCCCCC',   // Туман
    cloudFill: 'rgba(158, 168, 201, 0.8)', // Заливка облаков
    rainFill: 'rgba(145, 192, 248, 0.7)', // Заливка дождя
    snowFill: 'rgba(255, 255, 255, 0.8)', // Заливка снега
    background: 'transparent'
  };

  // Определяем, какую иконку показывать на основе кода
  const renderIcon = () => {
    switch (iconCode) {
      // Ясно, день
      case '01d':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="25" fill={colors.sunny} />
            <g filter="url(#sunny-glow)">
              <circle cx="50" cy="50" r="20" fill={colors.sunny} />
            </g>
            <line x1="50" y1="15" x2="50" y2="5" stroke={colors.sunny} strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="95" x2="50" y2="85" stroke={colors.sunny} strokeWidth="3" strokeLinecap="round" />
            <line x1="15" y1="50" x2="5" y2="50" stroke={colors.sunny} strokeWidth="3" strokeLinecap="round" />
            <line x1="95" y1="50" x2="85" y2="50" stroke={colors.sunny} strokeWidth="3" strokeLinecap="round" />
            <line x1="26" y1="26" x2="19" y2="19" stroke={colors.sunny} strokeWidth="3" strokeLinecap="round" />
            <line x1="81" y1="81" x2="74" y2="74" stroke={colors.sunny} strokeWidth="3" strokeLinecap="round" />
            <line x1="26" y1="74" x2="19" y2="81" stroke={colors.sunny} strokeWidth="3" strokeLinecap="round" />
            <line x1="81" y1="19" x2="74" y2="26" stroke={colors.sunny} strokeWidth="3" strokeLinecap="round" />
            <defs>
              <filter id="sunny-glow" x="20" y="20" width="60" height="60" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0 0 0 0 1 0" />
              </filter>
            </defs>
          </svg>
        );

      // Ясно, ночь
      case '01n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 35C60 50 50 65 30 65C30 65 35 80 55 80C75 80 85 60 80 40C75 20 60 20 60 35Z" 
                  fill={colors.moon} filter="url(#moon-glow)" />
            <defs>
              <filter id="moon-glow" x="20" y="20" width="70" height="70" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
              </filter>
            </defs>
          </svg>
        );

      // Малооблачно, день
      case '02d':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="38" r="18" fill={colors.sunny} filter="url(#partly-cloudy-sun)" />
            <path d="M75 65C75 75 65 80 50 80C35 80 25 75 25 65C25 55 35 45 50 45C65 45 75 55 75 65Z" 
                  fill={colors.cloudFill} stroke={colors.cloud} strokeWidth="2" filter="url(#partly-cloudy-cloud)" />
            <defs>
              <filter id="partly-cloudy-sun" x="5" y="10" width="55" height="55" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0 0 0 0 0.7 0" />
              </filter>
              <filter id="partly-cloudy-cloud" x="15" y="35" width="70" height="55" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
              </filter>
            </defs>
          </svg>
        );

      // Малооблачно, ночь
      case '02n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48 35C48 45 38 55 25 55C25 55 28 65 40 65C52 65 60 50 56 40C52 30 48 25 48 35Z" 
                  fill={colors.moon} filter="url(#partly-cloudy-moon)" />
            <path d="M75 65C75 75 65 80 50 80C35 80 25 75 25 65C25 55 35 45 50 45C65 45 75 55 75 65Z" 
                  fill={colors.cloudFill} stroke={colors.cloud} strokeWidth="2" filter="url(#partly-cloudy-n-cloud)" />
            <defs>
              <filter id="partly-cloudy-moon" x="15" y="25" width="45" height="45" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
              </filter>
              <filter id="partly-cloudy-n-cloud" x="15" y="35" width="70" height="55" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
              </filter>
            </defs>
          </svg>
        );

      // Облачно
      case '03d':
      case '03n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 55C75 65 65 70 50 70C35 70 25 65 25 55C25 45 35 35 50 35C65 35 75 45 75 55Z" 
                  fill={colors.cloudFill} stroke={colors.cloud} strokeWidth="2" filter="url(#cloudy-cloud)" />
            <defs>
              <filter id="cloudy-cloud" x="15" y="25" width="70" height="55" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
              </filter>
            </defs>
          </svg>
        );

      // Пасмурно
      case '04d':
      case '04n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M82 60C82 70 70 77 55 77C40 77 28 70 28 60C28 50 40 40 55 40C70 40 82 50 82 60Z" 
                  fill={colors.cloudFill} stroke={colors.cloud} strokeWidth="2" />
            <path d="M67 37C67 45 60 50 50 50C40 50 33 45 33 37C33 29 40 22 50 22C60 22 67 29 67 37Z" 
                  fill={colors.cloudFill} stroke={colors.cloud} strokeWidth="2" filter="url(#overcast-cloud)" />
            <defs>
              <filter id="overcast-cloud" x="23" y="12" width="54" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
              </filter>
            </defs>
          </svg>
        );

      // Дождь
      case '09d':
      case '09n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 45C75 55 65 60 50 60C35 60 25 55 25 45C25 35 35 25 50 25C65 25 75 35 75 45Z" 
                  fill={colors.cloudFill} stroke={colors.cloud} strokeWidth="2" />
            <line x1="40" y1="65" x2="35" y2="75" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="65" x2="45" y2="80" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="65" x2="55" y2="75" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="35" y1="70" x2="30" y2="80" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="45" y1="70" x2="40" y2="85" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="70" x2="50" y2="80" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="65" y1="70" x2="60" y2="85" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      // Дождь с просветами
      case '10d':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="15" fill={colors.sunny} filter="url(#rain-sun)" />
            <path d="M75 50C75 60 65 65 50 65C35 65 25 60 25 50C25 40 35 30 50 30C65 30 75 40 75 50Z" 
                  fill={colors.cloudFill} stroke={colors.cloud} strokeWidth="2" />
            <line x1="40" y1="70" x2="35" y2="80" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="70" x2="45" y2="85" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="70" x2="55" y2="80" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="45" y1="75" x2="40" y2="90" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="75" x2="50" y2="85" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <defs>
              <filter id="rain-sun" x="5" y="5" width="50" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0 0 0 0 0.7 0" />
              </filter>
            </defs>
          </svg>
        );

      // Дождь с просветами ночью
      case '10n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M45 25C45 35 35 45 22 45C22 45 25 55 37 55C49 55 55 40 51 30C47 20 45 15 45 25Z" 
                  fill={colors.moon} filter="url(#rain-moon)" />
            <path d="M75 50C75 60 65 65 50 65C35 65 25 60 25 50C25 40 35 30 50 30C65 30 75 40 75 50Z" 
                  fill={colors.cloudFill} stroke={colors.cloud} strokeWidth="2" />
            <line x1="40" y1="70" x2="35" y2="80" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="70" x2="45" y2="85" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="70" x2="55" y2="80" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="45" y1="75" x2="40" y2="90" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="75" x2="50" y2="85" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <defs>
              <filter id="rain-moon" x="12" y="15" width="43" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
              </filter>
            </defs>
          </svg>
        );

      // Гроза
      case '11d':
      case '11n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 40C75 50 65 55 50 55C35 55 25 50 25 40C25 30 35 20 50 20C65 20 75 30 75 40Z" 
                  fill={colors.darkCloud} stroke={colors.cloud} strokeWidth="2" />
            <path d="M45 55L35 70H50L38 90" stroke={colors.thunder} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="60" y1="60" x2="55" y2="70" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
            <line x1="65" y1="65" x2="60" y2="80" stroke={colors.rain} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      // Снег
      case '13d':
      case '13n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 40C75 50 65 55 50 55C35 55 25 50 25 40C25 30 35 20 50 20C65 20 75 30 75 40Z" 
                  fill={colors.cloudFill} stroke={colors.cloud} strokeWidth="2" />
            <circle cx="35" cy="65" r="2" fill={colors.snow} />
            <circle cx="45" cy="70" r="2" fill={colors.snow} />
            <circle cx="55" cy="65" r="2" fill={colors.snow} />
            <circle cx="65" cy="70" r="2" fill={colors.snow} />
            <circle cx="40" cy="80" r="2" fill={colors.snow} />
            <circle cx="50" cy="75" r="2" fill={colors.snow} />
            <circle cx="60" cy="80" r="2" fill={colors.snow} />
            
            <line x1="35" y1="65" x2="35" y2="65" stroke={colors.snow} strokeWidth="4" strokeLinecap="round" filter="url(#snow-glow)" />
            <line x1="45" y1="70" x2="45" y2="70" stroke={colors.snow} strokeWidth="4" strokeLinecap="round" filter="url(#snow-glow)" />
            <line x1="55" y1="65" x2="55" y2="65" stroke={colors.snow} strokeWidth="4" strokeLinecap="round" filter="url(#snow-glow)" />
            <line x1="65" y1="70" x2="65" y2="70" stroke={colors.snow} strokeWidth="4" strokeLinecap="round" filter="url(#snow-glow)" />
            <line x1="40" y1="80" x2="40" y2="80" stroke={colors.snow} strokeWidth="4" strokeLinecap="round" filter="url(#snow-glow)" />
            <line x1="50" y1="75" x2="50" y2="75" stroke={colors.snow} strokeWidth="4" strokeLinecap="round" filter="url(#snow-glow)" />
            <line x1="60" y1="80" x2="60" y2="80" stroke={colors.snow} strokeWidth="4" strokeLinecap="round" filter="url(#snow-glow)" />
            <defs>
              <filter id="snow-glow" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0" />
              </filter>
            </defs>
          </svg>
        );

      // Туман
      case '50d':
      case '50n':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="25" y1="40" x2="75" y2="40" stroke={colors.mist} strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="50" x2="80" y2="50" stroke={colors.mist} strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="60" x2="70" y2="60" stroke={colors.mist} strokeWidth="3" strokeLinecap="round" />
            <line x1="25" y1="70" x2="75" y2="70" stroke={colors.mist} strokeWidth="3" strokeLinecap="round" />
            <line x1="35" y1="80" x2="65" y2="80" stroke={colors.mist} strokeWidth="3" strokeLinecap="round" />
            <rect x="0" y="30" width="100" height="60" rx="10" fill="url(#mist-gradient)" />
            <defs>
              <linearGradient id="mist-gradient" x1="50" y1="30" x2="50" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" stopOpacity="0.2" />
                <stop offset="0.5" stopColor="white" stopOpacity="0.1" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        );

      // По умолчанию показываем солнце
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="25" fill={colors.sunny} />
            <g filter="url(#default-glow)">
              <circle cx="50" cy="50" r="20" fill={colors.sunny} />
            </g>
            <defs>
              <filter id="default-glow" x="20" y="20" width="60" height="60" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0 0 0 0 1 0" />
              </filter>
            </defs>
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
