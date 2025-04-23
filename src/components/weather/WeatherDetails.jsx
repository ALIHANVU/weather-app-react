import { motion } from 'framer-motion'
import { Wind, Droplets, Eye, Thermometer } from 'lucide-react'
import useWeather from '../../hooks/useWeather'

/**
 * Компонент деталей погоды
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
      title: 'ВЕТЕР',
      value: `${wind.speed.toFixed(1)} м/с`,
      icon: <Wind size={16} strokeWidth={1.5} />
    },
    {
      title: 'ВЛАЖНОСТЬ',
      value: `${main.humidity}%`,
      icon: <Droplets size={16} strokeWidth={1.5} />
    },
    {
      title: 'ВИДИМОСТЬ',
      value: `${(visibility / 1000).toFixed(1)} км`,
      icon: <Eye size={16} strokeWidth={1.5} />
    },
    {
      title: 'ОЩУЩАЕТСЯ',
      value: `${Math.round(main.feels_like)}°`,
      icon: <Thermometer size={16} strokeWidth={1.5} />
    }
  ]
  
  return (
    <motion.div
      className="ios-card p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.2,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {details.map((detail, index) => (
          <motion.div
            key={detail.title}
            className="ios-detail-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              delay: 0.3 + index * 0.05,
              ease: "easeOut"
            }}
          >
            <div className="flex items-center mb-1.5">
              <span className="text-ios-text-secondary mr-2">
                {detail.icon}
              </span>
              <span className="ios-text-caption2">{detail.title}</span>
            </div>
            <div className="ios-text-headline font-medium">{detail.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default WeatherDetails
