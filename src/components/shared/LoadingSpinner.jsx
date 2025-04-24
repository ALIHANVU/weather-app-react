import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Компонент индикатора загрузки в стиле iOS с немедленным отображением
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.message - Сообщение во время загрузки
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ message = 'Загрузка данных...' }) => {
  // Состояние для немедленного отображения
  const [mounted, setMounted] = useState(true)
  
  // Эффект для принудительного рендеринга спиннера перед всем контентом
  useEffect(() => {
    // Устанавливаем высокий z-index для перекрытия всего контента
    document.body.classList.add('overflow-hidden')
    
    return () => {
      // Восстанавливаем прокрутку при размонтировании
      document.body.classList.remove('overflow-hidden')
    }
  }, [])
  
  if (!mounted) return null

  return (
    <div 
      className="fixed inset-0 bg-white dark:bg-black z-[9999] flex flex-col justify-center items-center"
      style={{
        // Высокий приоритет стилей для гарантии отображения поверх всего
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999
      }}
    >
      <div className="relative w-12 h-12 mb-4">
        {/* Спиннер загрузки с CSS анимацией для моментального отображения */}
        <div 
          className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-400
                    border-b-blue-300 border-l-blue-200 rounded-full animate-spin"
          style={{ animationDuration: '0.8s' }}
        />
      </div>
        
      <p className="text-gray-700 dark:text-gray-100 font-medium text-center max-w-[260px] text-base">
        {message}
      </p>
    </div>
  )
}

export default LoadingSpinner
