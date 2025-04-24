import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { isExtremeTemperatureForPlants } from '../../utils/weatherUtils'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Компонент текущей погоды с производительными анимациями
 * Используем memo для предотвращения ненужных перерисовок
 */
const CurrentWeather = memo(() => {
  // Получаем данные о погоде из контекста
  const { weatherData, currentCity, isAnimating } = useWeather()
  
  // Если нет данных, не рендерим компонент
  if (!weatherData || !weatherData.weather) return null
  
  const { main, weather, name } = weatherData.weather
  const isExtremeTemp = isExtremeTemperatureForPlants(main.temp)
  
  // Определяем градиент фона в зависимости от погоды
  let bgGradient = 'bg-gradient-to-b from-sky-400 to-sky-600'
  
  if (weather && weather[0]) {
    const weatherId = weather[0].id
    const isDaytime = weather[0].icon.includes('d')
    
    if (weatherId >= 200 && weatherId < 300) { // Гроза
      bgGradient = 'bg-gradient-to-b from-gray-600 to-gray-800'
    } else if (weatherId >= 300 && weatherId < 400) { // Морось
      bgGradient = 'bg-gradient-to-b from-sky-300 to-sky-500'
    } else if (weatherId >= 500 && weatherId < 600) { // Дождь
      bgGradient = 'bg-gradient-to-b from-blue-400 to-blue-600'
    } else if (weatherId >= 600 && weatherId < 700) { // Снег
      bgGradient = 'bg-gradient-to-b from-blue-100 to-blue-300'
    } else if (weatherId >= 700 && weatherId < 800) { // Атмосферные явления
      bgGradient = 'bg-gradient-to-b from-gray-300 to-gray-500'
    } else if (weatherId === 800) { // Ясно
      bgGradient = isDaytime 
        ? 'bg-gradient-to-b from-sky-400 to-sky-600' 
        : 'bg-gradient-to-b from-slate-700 to-slate-900'
    } else if (weatherId > 800) { // Облачность
      bgGradient = isDaytime 
        ? 'bg-gradient-to-b from-sky-300 to-sky-500' 
        : 'bg-gradient-to-b from-slate-600 to-slate-800'
    }
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`rounded-2xl overflow-hidden shadow-md mb-4 ${bgGradient} will-change-transform`}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ 
          opacity: isAnimating ? 0 : 1, 
          scale: isAnimating ? 0.96 : 1, 
          y: isAnimating ? 20 : 0 
        }}
        transition={{ 
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 0.5
        }}
        layoutId="current-weather-card"
      >
        <div className="p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold">{currentCity || name}</h1>
            <div className="scale-125 origin-center transform-gpu">
              <WeatherIcon iconCode={weather && weather[0] ? weather[0].icon : '01d'} size={130} />
            </div>
          </div>
          
          <div className="flex items-end">
            <div className="text-8xl font-light leading-none will-change-contents">{Math.round(main.temp)}°</div>
            <div className="ml-4 mb-3">
              <div className="text-2xl font-medium capitalize mb-1">
                {weather && weather[0] ? weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1) : 'Загрузка...'}
              </div>
              <div className="text-lg opacity-90">
                {Math.round(main.temp_max)}° / {Math.round(main.temp_min)}°
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

CurrentWeather.displayName = 'CurrentWeather'

export default CurrentWeather
