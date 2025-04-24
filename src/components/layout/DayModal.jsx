import { useEffect, useState } from 'react'
import { X, Clock, Wind, Droplets, Eye, Thermometer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { formatTime } from '../../utils/dateUtils'
import { generateFarmerTips, isExtremeTemperatureForPlants } from '../../utils/weatherUtils'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Компонент модального окна с деталями дня и новыми иконками
 * 
 * @returns {JSX.Element}
 */
const DayModal = () => {
  // Получаем данные модального окна из контекста погоды
  const { modalVisible, selectedDayData, closeDayModal } = useWeather()
  // Состояние для советов фермерам
  const [tips, setTips] = useState([])
  
  // Генерируем советы при изменении выбранного дня
  useEffect(() => {
    // Асинхронная функция для загрузки советов
    const loadTips = async () => {
      if (!selectedDayData) return
      
      // Вычисляем средние значения для советов
      const avgTemp = Math.round(selectedDayData.temps.reduce((a, b) => a + b, 0) / selectedDayData.temps.length)
      const avgHumidity = Math.round(selectedDayData.humidity.reduce((a, b) => a + b, 0) / selectedDayData.humidity.length)
      const avgWindSpeed = (selectedDayData.windSpeed.reduce((a, b) => a + b, 0) / selectedDayData.windSpeed.length).toFixed(1)
      const avgVisibility = (selectedDayData.visibility.reduce((a, b) => a + b, 0) / selectedDayData.visibility.length / 1000).toFixed(1)
      const avgFeelsLike = Math.round(selectedDayData.feelsLike.reduce((a, b) => a + b, 0) / selectedDayData.feelsLike.length)
      
      // Создаем объект с данными о погоде для генерации советов
      const weatherData = {
        main: { 
          temp: avgTemp, 
          humidity: avgHumidity, 
          feels_like: avgFeelsLike 
        },
        wind: { 
          speed: avgWindSpeed 
        },
        visibility: avgVisibility * 1000
      }
      
      // Получаем советы
      const generatedTips = await generateFarmerTips(weatherData)
      setTips(generatedTips)
    }
    
    if (modalVisible && selectedDayData) {
      loadTips()
    }
  }, [modalVisible, selectedDayData])
  
  // Если нет данных, или модальное окно скрыто, не рендерим ничего
  if (!modalVisible || !selectedDayData) return null
  
  // Рассчитываем средние значения погоды
  const avgTemp = Math.round(selectedDayData.temps.reduce((a, b) => a + b, 0) / selectedDayData.temps.length)
  const maxTemp = Math.round(Math.max(...selectedDayData.temps))
  const minTemp = Math.round(Math.min(...selectedDayData.temps))
  const avgHumidity = Math.round(selectedDayData.humidity.reduce((a, b) => a + b, 0) / selectedDayData.humidity.length)
  const avgWindSpeed = (selectedDayData.windSpeed.reduce((a, b) => a + b, 0) / selectedDayData.windSpeed.length).toFixed(1)
  const avgVisibility = (selectedDayData.visibility.reduce((a, b) => a + b, 0) / selectedDayData.visibility.length / 1000).toFixed(1)
  const avgFeelsLike = Math.round(selectedDayData.feelsLike.reduce((a, b) => a + b, 0) / selectedDayData.feelsLike.length)
  
  // Определяем наиболее частый тип погоды и иконку
  let mostFrequentWeather = "ясно"
  let mostFrequentIcon = "01d"
  
  if (selectedDayData.weatherData && selectedDayData.weatherData.length > 0) {
    const weatherCounts = {}
    selectedDayData.weatherData.forEach(item => {
      if (!weatherCounts[item.description]) {
        weatherCounts[item.description] = 0
      }
      weatherCounts[item.description]++
    })
    
    let maxCount = 0
    Object.entries(weatherCounts).forEach(([description, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostFrequentWeather = description
      }
    })
  }
  
  if (selectedDayData.weather && selectedDayData.weather.length > 0) {
    const iconCounts = {}
    selectedDayData.weather.forEach(icon => {
      if (!iconCounts[icon]) {
        iconCounts[icon] = 0
      }
      iconCounts[icon]++
    })
    
    let maxIconCount = 0
    Object.entries(iconCounts).forEach(([icon, count]) => {
      if (count > maxIconCount) {
        maxIconCount = count
        mostFrequentIcon = icon
      }
    })
  }
  
  // Проверка на экстремальную температуру
  const isExtremeTemp = isExtremeTemperatureForPlants(avgTemp)
  
  // Детали погоды для модального окна
  const details = [
    {
      title: 'ВЕТЕР',
      value: `${avgWindSpeed} м/с`,
      icon: <Wind size={18} strokeWidth={1.5} className="text-blue-500" />
    },
    {
      title: 'ВЛАЖНОСТЬ',
      value: `${avgHumidity}%`,
      icon: <Droplets size={18} strokeWidth={1.5} className="text-blue-400" />
    },
    {
      title: 'ВИДИМОСТЬ',
      value: `${avgVisibility} км`,
      icon: <Eye size={18} strokeWidth={1.5} className="text-indigo-400" />
    },
    {
      title: 'ОЩУЩАЕТСЯ',
      value: `${avgFeelsLike}°`,
      icon: <Thermometer size={18} strokeWidth={1.5} className="text-orange-500" />
    }
  ]
  
  return (
    <AnimatePresence>
      {modalVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full max-h-[90vh] overflow-auto shadow-lg"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
          >
            <div className="relative">
              {/* Градиентный фон для заголовка */}
              <div className={`rounded-t-3xl p-6 ${isExtremeTemp ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}>
                <button
                  onClick={closeDayModal}
                  className="absolute right-4 top-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white"
                >
                  <X size={18} strokeWidth={2} />
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-3">{selectedDayData.day}</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-5xl font-light text-white">{avgTemp}°</div>
                    <div className="text-white/90 mt-1 capitalize">
                      {mostFrequentWeather.charAt(0).toUpperCase() + mostFrequentWeather.slice(1)}
                    </div>
                  </div>
                  <div className="scale-125 origin-center">
                    <WeatherIcon iconCode={mostFrequentIcon} size={60} />
                  </div>
                </div>
                <div className="text-white/80 text-sm mt-2">
                  Макс.: <span className="font-medium">{maxTemp}°</span> • Мин.: <span className="font-medium">{minTemp}°</span>
                </div>
              </div>
              
              {/* Содержимое модального окна */}
              <div className="p-5">
                {/* Детали погоды */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Детали</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {details.map((detail, index) => (
                      <div 
                        key={detail.title}
                        className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3 flex items-center"
                      >
                        <div className="w-8 h-8 mr-3 rounded-full bg-white dark:bg-gray-800 
                                      flex items-center justify-center flex-shrink-0">
                          {detail.icon}
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {detail.title}
                          </div>
                          <div className="text-base font-bold">
                            {detail.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Почасовой прогноз для выбранного дня */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Прогноз по часам</h3>
                  <div className="flex overflow-x-auto pb-3 pt-1 -mx-2 px-2 scrollbar-hide">
                    {selectedDayData.hourlyData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center min-w-16 mx-2">
                        <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                          {formatTime(item.dt)}
                        </div>
                        <div className="mb-2">
                          <WeatherIcon 
                            iconCode={item.weather && item.weather[0] ? item.weather[0].icon : '01d'} 
                            size={34} 
                          />
                        </div>
                        <div className="font-bold text-lg">
                          {Math.round(item.main.temp)}°
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Советы для фермеров */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Советы для фермеров</h3>
                  
                  <div className="space-y-2.5">
                    <AnimatePresence>
                      {tips.length > 0 ? (
                        tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              delay: index * 0.1,
                              duration: 0.3
                            }}
                          >
                            <div className="w-9 h-9 mr-3 flex-shrink-0 bg-green-100 dark:bg-green-800/30 flex items-center justify-center rounded-full">
                              <span className="text-lg">
                                {['🚿', '🌱', '☂️', '🌡️', '🌿', '🌾', '🍃', '🌸'][index % 8]}
                              </span>
                            </div>
                            <p className="text-sm font-medium">
                              {tip}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          Загрузка советов...
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DayModal
