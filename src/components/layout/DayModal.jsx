import { useEffect, useState } from 'react'
import { X, Clock, Wind, Droplets, Eye, Thermometer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { formatTime } from '../../utils/dateUtils'
import { generateFarmerTips, isExtremeTemperatureForPlants } from '../../utils/weatherUtils'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Компонент модального окна с деталями дня и улучшенными анимациями
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
  
  // Варианты анимации для модального окна
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 1, 1]
      }
    }
  }
  
  const modalVariants = {
    hidden: { 
      scale: 0.9, 
      y: 20, 
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: { 
      scale: 0.95, 
      y: 10, 
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0.0, 1, 1]
      }
    }
  }
  
  // Варианты анимации для деталей погоды
  const detailsVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.05,
        duration: 0.3,
        ease: [0, 0, 0.2, 1]
      }
    }),
    hover: {
      y: -3,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2
      }
    }
  }
  
  // Варианты анимации для советов
  const tipVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.08,
        duration: 0.4,
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    })
  }
  
  // Варианты анимации для часовых элементов
  const hourlyVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2 + i * 0.04,
        duration: 0.3,
        ease: [0, 0, 0.2, 1]
      }
    })
  }
  
  return (
    <AnimatePresence>
      {modalVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={closeDayModal}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full max-h-[90vh] overflow-auto shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Градиентный фон для заголовка */}
              <motion.div 
                className={`rounded-t-3xl p-6 ${isExtremeTemp ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeDayModal}
                  className="absolute right-4 top-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  <X size={18} strokeWidth={2} />
                </motion.button>
                
                <motion.h2 
                  className="text-2xl font-bold text-white mb-3"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedDayData.day}
                </motion.h2>
                
                <div className="flex items-center justify-between">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <motion.div 
                      className="text-5xl font-light text-white"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 15, 
                        delay: 0.2 
                      }}
                    >
                      {avgTemp}°
                    </motion.div>
                    <motion.div 
                      className="text-white/90 mt-1 capitalize"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      {mostFrequentWeather.charAt(0).toUpperCase() + mostFrequentWeather.slice(1)}
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="scale-125 origin-center"
                    initial={{ rotate: -5, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 10, 
                      delay: 0.2 
                    }}
                  >
                    <WeatherIcon iconCode={mostFrequentIcon} size={60} />
                  </motion.div>
                </div>
                
                <motion.div 
                  className="text-white/80 text-sm mt-2"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  Макс.: <span className="font-medium">{maxTemp}°</span> • Мин.: <span className="font-medium">{minTemp}°</span>
                </motion.div>
              </motion.div>
              
              {/* Содержимое модального окна */}
              <div className="p-5">
                {/* Детали погоды */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-3">Детали</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {details.map((detail, index) => (
                      <motion.div 
                        key={detail.title}
                        className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3 flex items-center"
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        variants={detailsVariants}
                      >
                        <motion.div 
                          className="w-8 h-8 mr-3 rounded-full bg-white dark:bg-gray-800 
                                    flex items-center justify-center flex-shrink-0"
                          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                        >
                          {detail.icon}
                        </motion.div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {detail.title}
                          </div>
                          <div className="text-base font-bold">
                            {detail.value}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Почасовой прогноз для выбранного дня */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-3">Прогноз по часам</h3>
                  <div className="flex overflow-x-auto pb-3 pt-1 -mx-2 px-2 scrollbar-hide">
                    {selectedDayData.hourlyData.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="flex flex-col items-center min-w-16 mx-2"
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={hourlyVariants}
                        whileHover={{ 
                          y: -3, 
                          transition: { duration: 0.2 } 
                        }}
                      >
                        <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                          {formatTime(item.dt)}
                        </div>
                        <motion.div 
                          className="mb-2"
                          whileHover={{ 
                            scale: 1.1, 
                            transition: { duration: 0.2 } 
                          }}
                        >
                          <WeatherIcon 
                            iconCode={item.weather && item.weather[0] ? item.weather[0].icon : '01d'} 
                            size={34} 
                          />
                        </motion.div>
                        <div className="font-bold text-lg">
                          {Math.round(item.main.temp)}°
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Советы для фермеров */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold mb-3">Советы для фермеров</h3>
                  
                  <div className="space-y-2.5">
                    <AnimatePresence>
                      {tips.length > 0 ? (
                        tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex"
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={tipVariants}
                            whileHover={{ 
                              x: 3, 
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                              transition: { duration: 0.2 } 
                            }}
                          >
                            <motion.div 
                              className="w-9 h-9 mr-3 flex-shrink-0 bg-green-100 dark:bg-green-800/30 flex items-center justify-center rounded-full"
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              <span className="text-lg">
                                {['🚿', '🌱', '☂️', '🌡️', '🌿', '🌾', '🍃', '🌸'][index % 8]}
                              </span>
                            </motion.div>
                            <p className="text-sm font-medium overflow-hidden text-ellipsis line-clamp-3">
                              {tip}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div 
                          className="p-4 text-center text-gray-500 dark:text-gray-400"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: [0, 0.5, 1, 0.5, 0], 
                            transition: { 
                              repeat: Infinity, 
                              duration: 2 
                            } 
                          }}
                        >
                          Загрузка советов...
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DayModal
