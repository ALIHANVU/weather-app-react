import { motion } from 'framer-motion'
import { isToday } from '../../utils/dateUtils'
import { formatTime } from '../../utils/dateUtils'
import { weatherEmoji } from '../../utils/weatherUtils'
import useWeather from '../../hooks/useWeather'

/**
 * Компонент почасового прогноза
 * 
 * @returns {JSX.Element}
 */
const HourlyForecast = () => {
  // Получаем данные о погоде из контекста
  const { weatherData } = useWeather()
  
  // Если нет данных, не рендерим компонент
  if (!weatherData || !weatherData.forecast) return null
  
  // Ограничиваем количество отображаемых часов
  const hourlyData = weatherData.forecast.list.slice(0, 24)
  
  return (
    <motion.div
      className="ios-card p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.1,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
      <div className="flex overflow-x-auto py-2 scrollbar-hide">
        {hourlyData.map((item, index) => {
          // Определяем, является ли этот час текущим
          const isFirst = index === 0
          
          return (
            <motion.div
              key={item.dt}
              className="ios-forecast-hour mx-2 first:ml-1 last:mr-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.03,
                ease: "easeOut"
              }}
            >
              <div className="text-ios-text-secondary ios-text-caption1 mb-2">
                {isFirst ? 'Сейчас' : formatTime(item.dt)}
              </div>
              <div className="text-2xl mb-2">
                {item.weather && item.weather[0] ? weatherEmoji[item.weather[0].icon] : "🌦️"}
              </div>
              <div className="ios-text-headline font-semibold">
                {Math.round(item.main.temp)}°
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default HourlyForecast
