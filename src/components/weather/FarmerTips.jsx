import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { generateFarmerTips } from '../../utils/weatherUtils'

/**
 * Компонент советов для фермеров в новом стиле iOS
 * 
 * @returns {JSX.Element}
 */
const FarmerTips = () => {
  // Получаем данные о погоде из контекста
  const { weatherData } = useWeather()
  // Состояние для советов
  const [tips, setTips] = useState([])
  // Состояние для раскрытых советов
  const [expandedTips, setExpandedTips] = useState({})
  
  // Получаем советы при изменении данных о погоде
  useEffect(() => {
    // Асинхронная функция для загрузки советов
    const loadTips = async () => {
      if (!weatherData || !weatherData.weather) return
      
      try {
        const generatedTips = await generateFarmerTips(weatherData.weather)
        setTips(generatedTips.slice(0, 4)) // Ограничиваем до 4 советов для лучшего отображения
      } catch (error) {
        console.error('Ошибка при загрузке советов:', error)
        setTips([
          'Поливайте растения в соответствии с погодными условиями',
          'Следите за состоянием почвы',
          'Защищайте растения от экстремальных погодных условий',
          'Проверяйте прогноз погоды перед планированием работ'
        ])
      }
    }
    
    loadTips()
  }, [weatherData])
  
  // Функция для переключения состояния совета
  const toggleTipExpansion = (index) => {
    setExpandedTips(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }
  
  // Если нет данных или советов, не рендерим компонент
  if (!weatherData || !weatherData.weather || tips.length === 0) return null
  
  // Иконки для советов
  const tipIcons = [
    '🚿', '🌱', '☂️', '🌡️', '🌿', '🌾', '🍃', '🌸'
  ]
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.3,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Советы для фермеров</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              className={`bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex cursor-pointer 
                          transition-all duration-300 ease-in-out
                          ${expandedTips[index] ? 'col-span-2' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3,
                delay: 0.4 + index * 0.05,
                ease: "easeOut"
              }}
              onClick={() => toggleTipExpansion(index)}
            >
              <div className="w-10 h-10 mr-3 flex-shrink-0 bg-green-100 dark:bg-green-800/30 flex items-center justify-center rounded-full">
                <span className="text-xl">{tipIcons[index % tipIcons.length]}</span>
              </div>
              <p className={`text-sm font-medium leading-tight 
                            ${expandedTips[index] ? 'line-clamp-none' : 'line-clamp-2'}`}>
                {tip}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default FarmerTips
