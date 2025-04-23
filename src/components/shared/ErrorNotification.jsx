import { useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Компонент уведомления об ошибке в стиле iOS
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.message - Сообщение об ошибке
 * @param {Function} props.onClose - Функция закрытия уведомления
 * @returns {JSX.Element}
 */
const ErrorNotification = ({ message, onClose }) => {
  // Автоматически закрываем уведомление через 4.5 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4500)
    
    return () => clearTimeout(timer)
  }, [onClose])
  
  return (
    <motion.div
      className="fixed top-[max(env(safe-area-inset-top),40px)] left-1/2 
        bg-ios-red text-white py-3 px-5 rounded-ios-md font-medium text-sm
        z-[1001] shadow-ios-md max-w-[85%] text-center"
      initial={{ y: -40, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      exit={{ y: -25, x: '-50%', opacity: 0 }}
      transition={{ 
        y: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 } 
      }}
    >
      {message}
    </motion.div>
  )
}

export default ErrorNotification
