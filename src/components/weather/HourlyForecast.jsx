import { memo } from 'react'
import { motion } from 'framer-motion'
import { formatTime } from '../../utils/dateUtils'
import useWeather from '../../hooks/useWeather'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Оптимизированный элемент почасового прогноза с улучшенным визуальным стилем
 */
const HourlyItem = memo(({ item, index, isFirst, isAnimating }) => {
  // Определяем, находимся ли мы в темном режиме
  const isDarkMode = document.documentElement.classList.contains('dark')
  
  return (
    <motion.div
      key={item.dt}
      className={`flex flex-col items-center min-w-16 mx-1 ${
        isDarkMode 
          ? 'hover:bg-gray-700/20' 
          : 'hover:bg-blue-50'
      } px-2 py-2 rounded-xl transition-colors will-change-transform`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 15 : 0 
      }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.03,
        ease: "easeOut"
      }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      <div className={`text-sm mb-2 font-medium ${
        isDarkMode 
          ? 'text-gray-400' 
          : 'text-gray-500'
      }`}>
        {isFirst ? 'Сейчас' : formatTime(item.dt)}
      </div>
      <div className="mb-2">
        <WeatherIcon 
          iconCode={item.weather && item.weather[0] ? item.weather[0].icon : '01d'} 
          size={38} 
        />
      </div>
      <div className={`font-bold text-lg ${
        isDarkMode 
          ? '' 
          : 'text-blue-600'
      }`}>
        {Math.round(item.main.temp)}°
      </div>
    </motion.div>
  )
})

HourlyItem.displayName = 'HourlyItem'

/**
 * Компонент почасового прогноза с улучшенным визуальным стилем
 */
const HourlyForecast = memo(() => {
  // Получаем данные о погоде из контекста
  const { weatherData, isAnimating } = useWeather()
  
  // Если нет данных, не рендерим компонент
  if (!weatherData || !weatherData.forecast) return null
  
  // Определяем, находимся ли мы в темном режиме
  const isDarkMode = document.documentElement.classList.contains('dark')
  
  // Ограничиваем количество отображаемых часов
  const hourlyData = weatherData.forecast.list.slice(0, 24)
  
  return (
    <motion.div
      className={`${
        isDarkMode 
          ? 'bg-gray-800' 
          : 'bg-white'
      } rounded-2xl shadow-sm p-4 mb-4 will-change-transform`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 20 : 0 
      }}
      transition={{ 
        duration: 0.4,
        delay: 0.1,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
      layoutId="hourly-forecast-card"
    >
      <h2 className="text-xl font-semibold mb-4 px-2">Почасовой прогноз</h2>
      
      <div className="flex overflow-x-auto pb-3 pt-1 px-2 mx-0 scrollbar-hide overscroll-x-contain 
                      scroll-smooth snap-x snap-mandatory"> 
        {hourlyData.map((item, index) => (
          <HourlyItem 
            key={item.dt}
            item={item} 
            index={index} 
            isFirst={index === 0}
            isAnimating={isAnimating}
          />
        ))}
      </div>
    </motion.div>
  )
})

HourlyForecast.displayName = 'HourlyForecast'

export default HourlyForecast
