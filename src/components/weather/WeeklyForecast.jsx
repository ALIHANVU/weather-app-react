import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import useWeather from '../../hooks/useWeather'
import { groupForecastByDays, weatherEmoji, isExtremeTemperatureForPlants } from '../../utils/weatherUtils'

/**
 * Компонент прогноза на неделю
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
      className="ios-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.4,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
      <div className="flex items-center mb-3">
        <span className="text-ios-text-secondary mr-2.5">
          <Calendar size={20} strokeWidth={1.5} />
        </span>
        <span className="ios-text-title2">Прогноз на неделю</span>
      </div>
      
      <div className="flex flex-col gap-2">
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
          
          // Проверка на экстремальную температуру
          const isExtremeTemp = isExtremeTemperatureForPlants(avgTemp)
          
          return (
            <motion.div
              key={day.date}
              className="ios-weekly-day"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5 + index * 0.04,
                ease: "easeOut"
              }}
              onClick={() => openDayModal(day)}
            >
              <div className="ios-text-headline font-medium">{day.day}</div>
              <div className="text-xl text-center">
                {weatherEmoji[mostFrequentIcon] || "🌦️"}
              </div>
              <div className="ios-text-headline font-semibold text-right relative">
                {avgTemp}°
                
                {/* Индикатор экстремальной температуры */}
                {isExtremeTemp && (
                  <motion.div
                    className="absolute -top-1.5 -right-2.5 text-ios-red"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.04, duration: 0.2 }}
                  >
                    <motion.svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                      className="w-4 h-4"
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
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default WeeklyForecast
