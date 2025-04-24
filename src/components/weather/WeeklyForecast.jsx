import { useMemo } from 'react'
import { motion } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { groupForecastByDays } from '../../utils/weatherUtils'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Компонент прогноза на неделю с новыми iOS-иконками
 * 
 * @returns {JSX.Element}
 */
const WeeklyForecast = () => {
  // Получаем данные о погоде и функцию открытия модального окна из контекста
  const { weatherData, openDayModal } = useWeather()
  
  // Группируем прогноз по дням
  const dailyForecast = useMemo(() => {
    if (!weatherData || !weatherData.forecast) return []
    
    const groupedForecast = groupForecastByDays(weatherData.forecast)
    return Object.values(groupedForecast).slice(0, 7)
  }, [weatherData])
  
  // Если нет данных или прогноза, не рендерим компонент
  if (!weatherData || !weatherData.forecast || dailyForecast.length === 0) return null
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.4,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Прогноз на 7 дней</h2>
      
      <div className="flex flex-col">
        {dailyForecast.map((day, index) => {
          // Рассчитываем среднюю температуру
          const avgTemp = Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length)
          
          // Определяем наиболее частую иконку погоды
          let mostFrequentIcon = "01d"
          if (day.weather && day.weather.length > 0) {
            const iconCounts = {}
            day.weather.forEach(icon => {
              if (!iconCounts[icon]) {
                iconCounts[icon] = 0
              }
              iconCounts[icon]++
            })
            
            let maxCount = 0
            Object.entries(iconCounts).forEach(([icon, count]) => {
              if (count > maxCount) {
                maxCount = count
                mostFrequentIcon = icon
              }
            })
          }
          
          return (
            <motion.div
              key={day.date}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5 + index * 0.04,
                ease: "easeOut"
              }}
              onClick={() => openDayModal(day)}
            >
              <div className="text-base font-medium">
                {index === 0 ? 'Сегодня' : day.day}
              </div>
              
              <div className="flex items-center">
                <div className="mr-4">
                  <WeatherIcon iconCode={mostFrequentIcon} size={38} />
                </div>
                <div className="text-base font-bold w-12 text-right">
                  {avgTemp}°C
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default WeeklyForecast
