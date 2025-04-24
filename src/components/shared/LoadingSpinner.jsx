import { motion } from 'framer-motion'

/**
 * Компонент индикатора загрузки в стиле iOS с улучшенной анимацией
 * Оптимизирован для приоритетного отображения
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.message - Сообщение во время загрузки
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ message = 'Загрузка данных...' }) => {
  return (
    <div
      className="fixed inset-0 bg-white/90 dark:bg-black/90 flex flex-col justify-center items-center z-[9999]"
      style={{
        // Инлайн стили для гарантированной работы
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div className="relative w-12 h-12 mb-4">
        {/* Используем CSS анимацию вместо framer-motion для гарантированного отображения */}
        <div 
          className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-400 
                    border-b-blue-300 border-l-transparent rounded-full animate-spin"
          style={{ 
            animationDuration: '0.8s',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)'
          }}
        />
      </div>
      
      <p className="text-gray-700 dark:text-gray-100 font-medium text-center max-w-[260px] text-base">
        {message}
      </p>
    </div>
  )
}

export default LoadingSpinner
