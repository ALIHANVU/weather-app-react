import { motion } from 'framer-motion'
import { Wind, Droplets, Eye, Thermometer } from 'lucide-react'
import useWeather from '../../hooks/useWeather'

/**
 * Компонент деталей погоды в новом стиле iOS
 * 
 * @returns {JSX.Element}
 */
const WeatherDetails = () => {
  // Получаем данные о погоде из контекста
  const { weatherData } = useWeather()
  
  // Если нет данных, не рендерим компонент
  if (!weatherData || !weatherData.weather) return null
  
  const { main, visibility, wind } = weatherData.weather
  
  // Детали погоды
  const details = [
    {
      title: 'Ветер',
      value: `${wind.speed.toFixed(1)} м/с`,
      icon: <Wind size={22} strokeWidth={1.5} className="text-blue-500" />
    },
    {
      title: 'Влажность',
      value: `${main.humidity}%`,
      icon: <Droplets size={22} strokeWidth={1.5} className="text-blue-400" />
    },
    {
      title: 'Видимость',
      value: `${(visibility / 1000).toFixed(1)} км`,
      icon: <Eye size={22} strokeWidth={1.5} className="text-indigo-400" />
    },
    {
      title: 'Ощущается',
      value: `${Math.round(main.feels_like)}°`,
      icon: <Thermometer size={22} strokeWidth={1.5} className="text-orange-500" />
    }
  ]
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.2,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Детали</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {details.map((detail, index) => (
          <motion.div
            key={detail.title}
            className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3 flex items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              delay: 0.3 + index * 0.05,
              ease: "easeOut"
            }}
          >
            <div className="w-10 h-10 mr-3 rounded-full bg-white dark:bg-gray-800 
                          flex items-center justify-center flex-shrink-0">
              {detail.icon}
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {detail.title.toUpperCase()}
              </div>
              <div className="text-base font-bold">
                {detail.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default WeatherDetails
