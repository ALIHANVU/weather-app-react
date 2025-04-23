import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import useWeather from '../../hooks/useWeather'

/**
 * Компонент секции поиска в стиле iOS
 * 
 * @returns {JSX.Element}
 */
const SearchSection = () => {
  // Состояние для ввода города
  const [cityInput, setCityInput] = useState('')
  // Получаем функцию поиска из контекста погоды
  const { handleSearch } = useWeather()
  
  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(cityInput)
  }

  return (
    <motion.div
      className="sticky top-0 z-10 ios-safe-top pb-2 backdrop-blur-ios-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="ios-search-container">
        <div className="flex items-center justify-center text-ios-text-secondary pl-2.5">
          <Search size={16} strokeWidth={2.5} />
        </div>
        
        <input
          type="text"
          id="citySearch"
          placeholder="Поиск"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          className="ios-search-input"
          autoComplete="off"
        />
        
        <button
          type="submit"
          className="ios-button h-9 px-3"
          onClick={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)'
            setTimeout(() => {
              e.currentTarget.style.transform = ''
            }, 150)
          }}
        >
          Найти
        </button>
      </form>
    </motion.div>
  )
}

export default SearchSection
