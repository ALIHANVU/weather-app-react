import { motion } from 'framer-motion'
import { formatTime } from '../../utils/dateUtils'
import useWeather from '../../hooks/useWeather'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Компонент почасового прогноза с новыми iOS-иконками
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
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.1,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
      <h2 className="text-xl font-semibold mb-4 px-2">Почасовой прогноз</h2>
      
      <div className="flex overflow-x-auto pb-3 pt-1 scrollbar-hide">
        {hourlyData.map((item, index) => {
          // Определяем, является ли этот час текущим
          const isFirst = index === 0
          
          return (
            <motion.div
              key={item.dt}
              className="flex flex-col items-center min-w-16 mx-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.03,
                ease: "easeOut"
              }}
            >
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                {isFirst ? 'Сейчас' : formatTime(item.dt)}
              </div>
              <div className="mb-2">
                <WeatherIcon 
                  iconCode={item.weather && item.weather[0] ? item.weather[0].icon : '01d'} 
                  size={38} 
                />
              </div>
              <div className="font-bold text-lg">
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
