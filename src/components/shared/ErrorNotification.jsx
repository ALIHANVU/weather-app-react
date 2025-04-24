import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle } from 'lucide-react'

/**
 * Компонент уведомления об ошибке в нативном стиле iOS
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
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed top-[max(env(safe-area-inset-top),48px)] inset-x-0 px-4 z-[1001] flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ 
            y: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 } 
          }}
        >
          <motion.div 
            className="ios-card max-w-[90%] bg-black/75 dark:bg-white/20 backdrop-blur-ios-md
                     border-0 shadow-ios-lg py-3.5 px-5 min-w-60 flex items-center gap-3"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="text-ios-red">
              <XCircle size={22} strokeWidth={1.5} />
            </div>
            <div className="flex-1 text-white dark:text-white font-medium text-base">
              {message}
            </div>
            <button 
              onClick={onClose}
              className="text-ios-blue dark:text-ios-blue font-medium text-sm py-1 px-2 -mr-1.5"
            >
              ОК
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ErrorNotification
