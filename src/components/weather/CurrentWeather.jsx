import { motion } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { isExtremeTemperatureForPlants } from '../../utils/weatherUtils'

/**
 * Компонент текущей погоды
 * 
 * @returns {JSX.Element}
 */
const CurrentWeather = () => {
  // Получаем данные о погоде из контекста
  const { weatherData, currentCity } = useWeather()
  
  // Если нет данных, не рендерим компонент
  if (!weatherData || !weatherData.weather) return null
  
  const { main, weather, name } = weatherData.weather
  const isExtremeTemp = isExtremeTemperatureForPlants(main.temp)
  
  return (
    <motion.div
      className="ios-card text-center p-5 mb-4 relative"
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.5
      }}
    >
      <h1 className="ios-text-title1 mb-1">{currentCity || name}</h1>
      <div className="text-[76px] font-extralight leading-tight my-1">{Math.round(main.temp)}°</div>
      <div className="ios-text-headline mb-2 capitalize">
        {weather && weather[0] ? weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1) : 'Загрузка...'}
      </div>
      <div className="text-ios-text-secondary ios-text-subheadline">
        Макс.: <span>{Math.round(main.temp_max)}</span>° Мин.: <span>{Math.round(main.temp_min)}</span>°
      </div>
      
      {/* Индикатор экстремальной температуры */}
      {isExtremeTemp && (
        <motion.div 
          className="absolute top-4 right-4 text-ios-red"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.3,
            type: 'spring',
            stiffness: 300
          }}
        >
          <motion.svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="w-6 h-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </motion.svg>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CurrentWeather
