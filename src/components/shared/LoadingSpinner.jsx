import { motion } from 'framer-motion'

/**
 * Компонент индикатора загрузки в стиле iOS
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.message - Сообщение во время загрузки
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ message = 'Загрузка данных...' }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-ios-bg/70 dark:bg-black/70 backdrop-blur-ios-sm
        flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="ios-spinner"></div>
        <p className="text-ios-text-primary dark:text-white font-medium text-base text-center max-w-[260px]">
          {message}
        </p>
      </div>
    </motion.div>
  )
}

export default LoadingSpinner
