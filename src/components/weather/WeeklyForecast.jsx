import { useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { groupForecastByDays } from '../../utils/weatherUtils'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Оптимизированный компонент элемента прогноза на день
 */
const DayItem = memo(({ day, index, isAnimating, onClick }) => {
  // Мемоизируем вычисления температуры
  const avgTemp = useMemo(() => 
    Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length), 
    [day.temps]
  )
  
  // Мемоизируем определение наиболее частой иконки
  const mostFrequentIcon = useMemo(() => {
    if (!day.weather || day.weather.length === 0) return "01d"
    
    const iconCounts = day.weather.reduce((counts, icon) => {
      counts[icon] = (counts[icon] || 0) + 1
      return counts
    }, {})

    return Object.entries(iconCounts).reduce((a, b) => 
      b[1] > a[1] ? b : a
    )[0]
  }, [day.weather])

  return (
    <motion.div
      key={day.date}
      className="flex items-center justify-between py-3 border-b border-gray-100 
                dark:border-gray-700 last:border-0 cursor-pointer will-change-transform"
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
      // Оптимизация производительности
      style={{ 
        willChange: 'transform, opacity',
        contain: 'layout paint style'
      }}
      whileHover={{
        x: 2,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <div className="text-base font-medium">
        {index === 0 ? 'Сегодня' : day.day}
      </div>
      
      <div className="flex items-center">
        <div className="mr-4">
          <WeatherIcon 
            iconCode={mostFrequentIcon} 
            size={38} 
          />
        </div>
        <div className="text-base font-bold w-12 text-right">
          {avgTemp}°C
        </div>
      </div>
    </motion.div>
  )
}, (prevProps, nextProps) => {
  // Глубокое сравнение только важных пропсов
  return (
    prevProps.day.date === nextProps.day.date &&
    prevProps.isAnimating === nextProps.isAnimating
  )
})

DayItem.displayName = 'DayItem'

/**
 * Компонент прогноза на неделю с оптимизированной производительностью
 */
const WeeklyForecast = memo(() => {
  // Получаем данные о погоде и функцию открытия модального окна из контекста
  const { weatherData, openDayModal, isAnimating } = useWeather()
  
  // Группируем прогноз по дням с мемоизацией
  const dailyForecast = useMemo(() => {
    if (!weatherData || !weatherData.forecast) return []
    
    const groupedForecast = groupForecastByDays(weatherData.forecast)
    return Object.values(groupedForecast).slice(0, 7)
  }, [weatherData])
  
  // Если нет данных или прогноза, не рендерим компонент
  if (!weatherData || !weatherData.forecast || dailyForecast.length === 0) return null
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 will-change-transform"
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
      // Оптимизация производительности
      style={{ 
        willChange: 'transform, opacity',
        contain: 'layout paint style'
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Прогноз на 7 дней</h2>
      
      <div 
        className="flex flex-col"
        // Оптимизация списка
        style={{ 
          willChange: 'contents', 
          containIntrinsicSize: 'block',
          contain: 'layout style'
        }}
      >
        {dailyForecast.map((day, index) => (
          <DayItem 
            key={day.date}
            day={day}
            index={index}
            isAnimating={isAnimating}
            onClick={() => openDayModal(day)}
          />
        ))}
      </div>
    </motion.div>
  )
})

WeeklyForecast.displayName = 'WeeklyForecast'

export default WeeklyForecast
