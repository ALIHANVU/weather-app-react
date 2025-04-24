// Обновленная версия FarmerTips.jsx с тематическими иконками и многоточием для обрезанного текста

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { generateFarmerTips } from '../../utils/weatherUtils'

/**
 * Возвращает тематическую иконку для совета на основе ключевых слов
 * @param {string} tip - Текст совета
 * @returns {string} Иконка эмодзи
 */
const getTipIcon = (tip) => {
  // Преобразуем текст в нижний регистр для поиска ключевых слов
  const lowerTip = tip.toLowerCase();
  
  // Словарь ключевых слов и соответствующих им иконок
  const keywordIconMap = {
    // Полив и вода
    'полив': '💧',
    'поливай': '🚿',
    'влаг': '💦',
    'воды': '🌊',
    'полейте': '🚿',
    'орошен': '💦',
    
    // Солнце и тепло
    'солнц': '☀️',
    'жар': '🔆',
    'тепл': '🌡️',
    'температур': '🌡️',
    
    // Защита растений
    'защит': '🛡️',
    'укрой': '🏕️',
    'укрыва': '🏕️',
    'экран': '⛱️',
    
    // Мульчирование
    'мульч': '🍂',
    'мульчир': '🍂',
    
    // Растения и посадка
    'раст': '🌱',
    'посад': '🌱',
    'посев': '🌾',
    'семен': '🌰',
    'всход': '🌿',
    'саженц': '🌱',
    
    // Удобрения и подкормка
    'удобр': '🧪',
    'подкорм': '💊',
    'питат': '🥗',
    
    // Сорняки и вредители
    'сорняк': '🧹',
    'вредител': '🐛',
    'болезн': '🦠',
    'грибк': '🍄',
    
    // Урожай
    'урожай': '🍎',
    'собирай': '🧺',
    'плод': '🍅',
    
    // Сезонные работы
    'подготов': '📆',
    'планир': '📋',
    'осен': '🍂',
    'зим': '❄️',
    'весен': '🌷',
    'лет': '☀️',
    
    // Инструменты
    'обрез': '✂️',
    'инструмент': '🧰',
    'осмотр': '🔍',
    
    // Почва
    'почв': '🌰',
    'грунт': '🏞️',
    'земл': '🌋',
    
    // Погода
    'дожд': '🌧️',
    'прогноз': '📊',
    'мороз': '❄️',
    'снег': '❄️',
    'замороз': '🧊',
    'туман': '🌫️',
    'облач': '☁️',
    'ветер': '💨',
    
    // Прочее
    'обеспеч': '✅',
    'проверк': '⚠️',
    'следите': '👀',
    'контрол': '👁️',
    'вентиляц': '💨',
    'провет': '🌬️'
  };
  
  // Ищем первое совпадение с ключевым словом
  for (const [keyword, icon] of Object.entries(keywordIconMap)) {
    if (lowerTip.includes(keyword)) {
      return icon;
    }
  }
  
  // Иконки по умолчанию, если совпадений не найдено
  const defaultIcons = ['🌿', '🌱', '🌾', '🧠', '🌻', '🌼', '🌞', '📝'];
  return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
};

/**
 * Компонент советов для фермеров в новом стиле iOS с тематическими иконками
 * 
 * @returns {JSX.Element}
 */
const FarmerTips = () => {
  // Получаем данные о погоде из контекста
  const { weatherData } = useWeather()
  // Состояние для советов
  const [tips, setTips] = useState([])
  // Состояние для выбранного совета
  const [selectedTip, setSelectedTip] = useState(null)
  
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
  
  // Если нет данных или советов, не рендерим компонент
  if (!weatherData || !weatherData.weather || tips.length === 0) return null
  
  return (
    <>
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
            {tips.map((tip, index) => {
              // Получаем подходящую иконку для совета
              const icon = getTipIcon(tip);
              
              return (
                <motion.div
                  key={index}
                  className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3,
                    delay: 0.4 + index * 0.05,
                    ease: "easeOut"
                  }}
                  onClick={() => setSelectedTip({ text: tip, icon: icon })}
                >
                  <div className="w-10 h-10 mr-3 flex-shrink-0 bg-green-100 dark:bg-green-800/30 flex items-center justify-center rounded-full">
                    <span className="text-xl">{icon}</span>
                  </div>
                  <p className="text-sm font-medium leading-tight line-clamp-2 overflow-hidden text-ellipsis">
                    {tip}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Модальное окно для детального совета */}
      <AnimatePresence>
        {selectedTip && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedTip(null)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full shadow-lg"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ 
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.3
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-16 h-16 mb-4 mx-auto bg-green-100 dark:bg-green-800/30 flex items-center justify-center rounded-full">
                  <span className="text-3xl">{selectedTip.icon}</span>
                </div>
                <p className="text-base font-medium text-center">
                  {selectedTip.text}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setSelectedTip(null)}
                  className="w-full py-3 text-ios-blue font-medium text-center"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FarmerTips
