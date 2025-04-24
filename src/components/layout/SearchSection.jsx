import { useState, useRef, memo } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import useWeather from '../../hooks/useWeather'

/**
 * Компонент секции поиска с оптимизированной производительностью
 * 
 * @returns {JSX.Element}
 */
const SearchSection = memo(() => {
  // Состояние для ввода города
  const [cityInput, setCityInput] = useState('')
  // Получаем функцию поиска из контекста погоды
  const { handleSearch, isAnimating } = useWeather()
  // Ссылка на кнопку для анимации
  const buttonRef = useRef(null)
  
  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Применяем визуальный эффект нажатия на кнопку
    if (buttonRef.current) {
      buttonRef.current.classList.add('scale-95')
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.classList.remove('scale-95')
        }
      }, 150)
    }
    
    // Продолжаем поиск только если не выполняется анимация
    if (!isAnimating) {
      handleSearch(cityInput)
    }
  }

  // Анимация нажатия на кнопку для сенсорных устройств 
  const handleTouchStart = () => {
    if (buttonRef.current) {
      buttonRef.current.classList.add('scale-95')
    }
  }
  
  const handleTouchEnd = () => {
    if (buttonRef.current) {
      buttonRef.current.classList.remove('scale-95')
    }
  }

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} strokeWidth={2.5} />
        </div>
        
        <input
          type="text"
          id="citySearch"
          placeholder="Поиск города"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-700 py-3 pl-11 pr-4 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                   will-change-transform placeholder:text-gray-400"
          autoComplete="off"
          disabled={isAnimating}
          enterKeyHint="search"
        />
        
        <button
          ref={buttonRef}
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2
                   bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full
                   text-sm font-medium transition-transform duration-150 will-change-transform"
          disabled={isAnimating}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          Найти
        </button>
      </form>
    </motion.div>
  )
})

SearchSection.displayName = 'SearchSection'

export default SearchSection
