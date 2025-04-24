import { motion } from 'framer-motion'

/**
 * Компонент индикатора загрузки в стиле iOS с улучшенной анимацией
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.message - Сообщение во время загрузки
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ message = 'Загрузка данных...' }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-ios-md
                flex flex-col justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-white/90 dark:bg-gray-800/90 rounded-2xl px-6 py-5 flex flex-col items-center
                  shadow-ios-md backdrop-blur-sm border border-white/20 dark:border-white/5"
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          type: "spring",
          damping: 25,
          stiffness: 200,
          delay: 0.1
        }}
      >
        <div className="relative w-10 h-10 mb-4">
          {/* Внешнее кольцо */}
          <motion.div 
            className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-400 
                      border-b-blue-300 border-l-blue-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1, 
              ease: "linear" 
            }}
          />
          {/* Внутреннее кольцо */}
          <motion.div 
            className="absolute inset-1 border-4 border-t-transparent border-r-transparent 
                      border-b-blue-400 border-l-blue-300 rounded-full"
            animate={{ rotate: -180 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
          />
        </div>
        
        <motion.p 
          className="text-gray-700 dark:text-gray-100 font-medium text-center max-w-[260px] text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default LoadingSpinner
