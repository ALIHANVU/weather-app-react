import { useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import useWeather from '../../hooks/useWeather'
import { groupForecastByDays, isExtremeTemperatureForPlants } from '../../utils/weatherUtils'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Оптимизированный компонент элемента прогноза на день
 */
const DayItem = memo(({ day, index, isAnimating, onClick, hasExtremeTempWarning }) => {
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
  
  // Определяем, находимся ли мы в темном режиме
  const isDarkMode = document.documentElement.classList.contains('dark')
  
  return (
    <motion.div
      key={day.date}
      className={`flex items-center justify-between py-3 border-b 
                ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-100 hover:bg-blue-50/50'} 
                last:border-0 cursor-pointer px-2 rounded-lg transition-colors will-change-transform`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 10 : 0 
      }}
      transition={{
        duration: 0.3,
        delay: 0.5 + index * 0.04,
        ease: "easeOut"
      }}
      onClick={onClick}
      whileHover={{
        x: 2,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <div className="flex items-center">
        <div className={`text-base font-medium ${isDarkMode ? '' : 'text-gray-700'}`}>
          {index === 0 ? 'Сегодня' : day.day}
        </div>
        {hasExtremeTempWarning && (
          <div 
            className={`ml-2 ${
              isDarkMode 
                ? 'text-yellow-400' 
                : 'text-yellow-600'
            } flex items-center`}
            title="Экстремальная температура для растений"
          >
            <AlertTriangle size={16} strokeWidth={2} />
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <div className="mr-4">
          <WeatherIcon iconCode={mostFrequentIcon} size={38} />
        </div>
        <div className={`text-base font-bold w-12 text-right ${isDarkMode ? '' : 'text-blue-600'}`}>
          {avgTemp}°C
        </div>
      </div>
    </motion.div>
  )
})

DayItem.displayName = 'DayItem'

/**
 * Компонент прогноза на неделю с оптимизированной производительностью
 * и улучшенными стилями для светлого режима
 */
const WeeklyForecast = memo(() => {
  // Получаем данные о погоде и функцию открытия модального окна из контекста
  const { weatherData, openDayModal, isAnimating } = useWeather()
  
  // Группируем прогноз по дням и используем useMemo для оптимизации
  const dailyForecast = useMemo(() => {
    if (!weatherData || !weatherData.forecast) return []
    
    const groupedForecast = groupForecastByDays(weatherData.forecast)
    return Object.values(groupedForecast).slice(0, 7)
  }, [weatherData])
  
  // Проверяем наличие экстремальных температур
  const daysWithExtremeTempWarnings = useMemo(() => {
    return dailyForecast.map(day => {
      const avgTemp = day.temps.reduce((a, b) => a + b, 0) / day.temps.length
      return isExtremeTemperatureForPlants(avgTemp)
    })
  }, [dailyForecast])
  
  // Если нет данных или прогноза, не рендерим компонент
  if (!weatherData || !weatherData.forecast || dailyForecast.length === 0) return null
  
  // Определяем, находимся ли мы в темном режиме
  const isDarkMode = document.documentElement.classList.contains('dark')
  
  return (
    <motion.div
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-4 will-change-transform`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 20 : 0 
      }}
      transition={{
        duration: 0.4,
        delay: 0.4,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
      layoutId="weekly-forecast-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${isDarkMode ? '' : 'text-gray-800'}`}>
          Прогноз на 7 дней
        </h2>
        {daysWithExtremeTempWarnings.some(Boolean) && (
          <div 
            className={`flex items-center text-sm ${
              isDarkMode 
                ? 'text-yellow-400' 
                : 'text-yellow-600'
            }`}
            title="Обратите внимание: некоторые дни имеют экстремальную температуру для растений"
          >
            <AlertTriangle size={16} strokeWidth={2} className="mr-1" />
            Экстремальная погода
          </div>
        )}
      </div>
      
      <div className="flex flex-col">
        {dailyForecast.map((day, index) => (
          <DayItem 
            key={day.date}
            day={day}
            index={index}
            isAnimating={isAnimating}
            onClick={() => openDayModal(day)}
            hasExtremeTempWarning={daysWithExtremeTempWarnings[index]}
          />
        ))}
      </div>
    </motion.div>
  )
})

WeeklyForecast.displayName = 'WeeklyForecast'

export default WeeklyForecast
