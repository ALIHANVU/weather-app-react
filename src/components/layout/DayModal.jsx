import { useEffect, useState } from 'react'
import { X, Clock, Wind, Droplets, Eye, Thermometer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { formatTime } from '../../utils/dateUtils'
import { weatherEmoji, generateFarmerTips, isExtremeTemperatureForPlants } from '../../utils/weatherUtils'

/**
 * Компонент модального окна с деталями дня в стиле iOS
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
  
  return (
    <motion.div
      className={`ios-modal ${modalVisible ? 'visible' : ''}`}
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ 
        opacity: modalVisible ? 1 : 0,
        backdropFilter: modalVisible ? 'blur(20px)' : 'blur(0px)'
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="ios-modal-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: modalVisible ? 1 : 0,
          y: modalVisible ? 0 : 10
        }}
        transition={{ 
          y: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.3 }
        }}
      >
        <button
          onClick={closeDayModal}
          className="ios-close-button"
        >
          <X size={18} strokeWidth={2} />
        </button>
        
        {/* Основная информация о погоде */}
        <div className="ios-card text-center p-5 mt-2.5 mb-4 relative">
          <h2 className="ios-text-title1">{selectedDayData.day}</h2>
          <div className="text-[76px] font-extralight leading-tight my-1">{avgTemp}°</div>
          <div className="ios-text-headline mb-2 capitalize">
            {mostFrequentWeather.charAt(0).toUpperCase() + mostFrequentWeather.slice(1)}
          </div>
          <div className="text-ios-text-secondary ios-text-subheadline">
            Макс.: <span>{maxTemp}</span>° Мин.: <span>{minTemp}</span>°
          </div>
          
          {/* Индикатор экстремальной температуры */}
          {isExtremeTemp && (
            <div className="absolute top-4 right-4 text-ios-red animate-pulse">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                className="w-6 h-6"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          )}
        </div>
        
        {/* Почасовой прогноз для выбранного дня */}
        <div className="ios-card p-4 mb-4">
          <div className="flex items-center mb-3">
            <span className="text-ios-text-secondary mr-2.5">
              <Clock size={20} strokeWidth={1.5} />
            </span>
            <span className="ios-text-title2">Прогноз на день</span>
          </div>
          
          <div className="flex overflow-x-auto py-2 scrollbar-hide">
            {selectedDayData.hourlyData.map((item, index) => (
              <div key={index} className="ios-forecast-hour mx-2 first:ml-1 last:mr-1">
                <div className="text-ios-text-secondary ios-text-caption1 mb-2">
                  {formatTime(item.dt)}
                </div>
                <div className="text-2xl mb-2">
                  {item.weather && item.weather[0] ? weatherEmoji[item.weather[0].icon] : "🌦️"}
                </div>
                <div className="ios-text-headline font-semibold">
                  {Math.round(item.main.temp)}°
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Детали погоды */}
        <div className="ios-card p-4 mb-4">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="ios-detail-item">
              <div className="flex items-center mb-1.5">
                <span className="text-ios-text-secondary mr-2">
                  <Wind size={16} strokeWidth={1.5} />
                </span>
                <span className="ios-text-caption2">ВЕТЕР</span>
              </div>
              <div className="ios-text-headline font-medium">{avgWindSpeed} м/с</div>
            </div>
            
            <div className="ios-detail-item">
              <div className="flex items-center mb-1.5">
                <span className="text-ios-text-secondary mr-2">
                  <Droplets size={16} strokeWidth={1.5} />
                </span>
                <span className="ios-text-caption2">ВЛАЖНОСТЬ</span>
              </div>
              <div className="ios-text-headline font-medium">{avgHumidity}%</div>
            </div>
            
            <div className="ios-detail-item">
              <div className="flex items-center mb-1.5">
                <span className="text-ios-text-secondary mr-2">
                  <Eye size={16} strokeWidth={1.5} />
                </span>
                <span className="ios-text-caption2">ВИДИМОСТЬ</span>
              </div>
              <div className="ios-text-headline font-medium">{avgVisibility} км</div>
            </div>
            
            <div className="ios-detail-item">
              <div className="flex items-center mb-1.5">
                <span className="text-ios-text-secondary mr-2">
                  <Thermometer size={16} strokeWidth={1.5} />
                </span>
                <span className="ios-text-caption2">ОЩУЩАЕТСЯ</span>
              </div>
              <div className="ios-text-headline font-medium">{avgFeelsLike}°</div>
            </div>
          </div>
        </div>
        
        {/* Советы для фермеров */}
        <div className="ios-card p-4">
          <div className="flex items-center mb-3">
            <span className="text-ios-text-secondary mr-2.5">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                className="w-5 h-5"
              >
                <path d="M12 2L7 7.5M12 2L17 7.5M12 2V6M7 7.5C3 8.5 3 12 3 13C3 14 3.5 18 8 19M7 7.5L8 6.5M17 7.5C21 8.5 21 12 21 13C21 14 20.5 18 16 19M17 7.5L16 6.5M8 19C10 19.5 14 19.5 16 19M8 19L7.5 20.5L12 22L16.5 20.5L16 19"/>
              </svg>
            </span>
            <span className="ios-text-title2">Советы для фермеров</span>
          </div>
          
          <div className="flex flex-col gap-2.5">
            <AnimatePresence>
              {tips.length > 0 ? (
                tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    className="ios-tip-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.3
                    }}
                  >
                    <span className="text-ios-text-secondary flex-shrink-0 mr-2.5 mt-0.5">
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5"
                        className="w-4 h-4"
                      >
                        <path d="M12 2L7 7.5M12 2L17 7.5M12 2V6M7 7.5C3 8.5 3 12 3 13C3 14 3.5 18 8 19M7 7.5L8 6.5M17 7.5C21 8.5 21 12 21 13C21 14 20.5 18 16 19M17 7.5L16 6.5M8 19C10 19.5 14 19.5 16 19M8 19L7.5 20.5L12 22L16.5 20.5L16 19"/>
                      </svg>
                    </span>
                    <span className="ios-text-subheadline flex-1 leading-tight">
                      {tip}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="ios-tip-item opacity-70">
                  <span className="text-ios-text-secondary flex-shrink-0 mr-2.5 mt-0.5">
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                      className="w-4 h-4"
                    >
                      <path d="M12 2L7 7.5M12 2L17 7.5M12 2V6M7 7.5C3 8.5 3 12 3 13C3 14 3.5 18 8 19M7 7.5L8 6.5M17 7.5C21 8.5 21 12 21 13C21 14 20.5 18 16 19M17 7.5L16 6.5M8 19C10 19.5 14 19.5 16 19M8 19L7.5 20.5L12 22L16.5 20.5L16 19"/>
                    </svg>
                  </span>
                  <span className="ios-text-subheadline flex-1 leading-tight">
                    Загрузка советов...
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DayModal
