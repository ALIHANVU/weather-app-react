import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { generateFarmerTips } from '../../utils/weatherUtils'

/**
 * Иконка совета в SVG формате
 */
const TipIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5"
    className="w-4 h-4"
  >
    <path d="M12 2L7 7.5M12 2L17 7.5M12 2V6M7 7.5C3 8.5 3 12 3 13C3 14 3.5 18 8 19M7 7.5L8 6.5M17 7.5C21 8.5 21 12 21 13C21 14 20.5 18 16 19M17 7.5L16 6.5M8 19C10 19.5 14 19.5 16 19M8 19L7.5 20.5L12 22L16.5 20.5L16 19"/>
  </svg>
)

/**
 * Компонент советов для фермеров
 * 
 * @returns {JSX.Element}
 */
const FarmerTips = () => {
  // Получаем данные о погоде из контекста
  const { weatherData } = useWeather()
  // Состояние для советов
  const [tips, setTips] = useState([])
  
  // Получаем советы при изменении данных о погоде
  useEffect(() => {
    // Асинхронная функция для загрузки советов
    const loadTips = async () => {
      if (!weatherData || !weatherData.weather) return
      
      try {
        const generatedTips = await generateFarmerTips(weatherData.weather)
        setTips(generatedTips)
      } catch (error) {
        console.error('Ошибка при загрузке советов:', error)
        setTips([
          'Поливайте растения в соответствии с погодными условиями',
          'Следите за состоянием почвы',
          'Защищайте растения от экстремальных погодных условий'
        ])
      }
    }
    
    loadTips()
  }, [weatherData])
  
  // Если нет данных или советов, не рендерим компонент
  if (!weatherData || !weatherData.weather || tips.length === 0) return null
  
  return (
    <motion.div
      className="ios-card p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.3,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
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
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              className="ios-tip-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                delay: 0.4 + index * 0.05,
                ease: "easeOut"
              }}
            >
              <span className="text-ios-text-secondary flex-shrink-0 mr-2.5 mt-0.5">
                <TipIcon />
              </span>
              <span className="ios-text-subheadline flex-1 leading-tight">
                {tip}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default FarmerTips
