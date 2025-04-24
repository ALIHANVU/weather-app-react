import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import useWeather from '../../hooks/useWeather'

/**
 * Компонент секции поиска в новом стиле iOS
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
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          autoComplete="off"
        />
        
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2
                   bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full
                   text-sm font-medium transition-colors"
          onClick={(e) => {
            e.currentTarget.style.transform = 'scale(0.95) translateY(-50%)';
            setTimeout(() => {
              e.currentTarget.style.transform = 'translateY(-50%)';
            }, 150);
          }}
        >
          Найти
        </button>
      </form>
    </motion.div>
  )
}

export default SearchSection
