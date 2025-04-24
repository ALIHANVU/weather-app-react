// Оптимизированный CurrentWeather.jsx
import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { isExtremeTemperatureForPlants } from '../../utils/weatherUtils'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Компонент текущей погоды с производительными анимациями
 * Используем memo для предотвращения ненужных перерисовок
 */
const CurrentWeather = memo(() => {
  // Получаем данные о погоде из контекста
  const { weatherData, currentCity, isAnimating } = useWeather()
  
  // Если нет данных, не рендерим компонент
  if (!weatherData || !weatherData.weather) return null
  
  const { main, weather, name } = weatherData.weather
  const isExtremeTemp = isExtremeTemperatureForPlants(main.temp)
  
  // Определяем градиент фона в зависимости от погоды
  let bgGradient = 'bg-gradient-to-b from-sky-400 to-sky-600'
  
  if (weather && weather[0]) {
    const weatherId = weather[0].id
    const isDaytime = weather[0].icon.includes('d')
    
    if (weatherId >= 200 && weatherId < 300) { // Гроза
      bgGradient = 'bg-gradient-to-b from-gray-600 to-gray-800'
    } else if (weatherId >= 300 && weatherId < 400) { // Морось
      bgGradient = 'bg-gradient-to-b from-sky-300 to-sky-500'
    } else if (weatherId >= 500 && weatherId < 600) { // Дождь
      bgGradient = 'bg-gradient-to-b from-blue-400 to-blue-600'
    } else if (weatherId >= 600 && weatherId < 700) { // Снег
      bgGradient = 'bg-gradient-to-b from-blue-100 to-blue-300'
    } else if (weatherId >= 700 && weatherId < 800) { // Атмосферные явления
      bgGradient = 'bg-gradient-to-b from-gray-300 to-gray-500'
    } else if (weatherId === 800) { // Ясно
      bgGradient = isDaytime 
        ? 'bg-gradient-to-b from-sky-400 to-sky-600' 
        : 'bg-gradient-to-b from-slate-700 to-slate-900'
    } else if (weatherId > 800) { // Облачность
      bgGradient = isDaytime 
        ? 'bg-gradient-to-b from-sky-300 to-sky-500' 
        : 'bg-gradient-to-b from-slate-600 to-slate-800'
    }
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`rounded-2xl overflow-hidden shadow-md mb-4 ${bgGradient} will-change-transform`}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ 
          opacity: isAnimating ? 0 : 1, 
          scale: isAnimating ? 0.96 : 1, 
          y: isAnimating ? 20 : 0 
        }}
        transition={{ 
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 0.5
        }}
        layoutId="current-weather-card"
      >
        <div className="p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold">{currentCity || name}</h1>
            <div className="scale-125 origin-center transform-gpu">
              <WeatherIcon iconCode={weather && weather[0] ? weather[0].icon : '01d'} size={130} />
            </div>
          </div>
          
          <div className="flex items-end">
            <div className="text-8xl font-light leading-none will-change-contents">{Math.round(main.temp)}°</div>
            <div className="ml-4 mb-3">
              <div className="text-2xl font-medium capitalize mb-1">
                {weather && weather[0] ? weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1) : 'Загрузка...'}
              </div>
              <div className="text-lg opacity-90">
                {Math.round(main.temp_max)}° / {Math.round(main.temp_min)}°
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

CurrentWeather.displayName = 'CurrentWeather'

// Оптимизированный HourlyForecast.jsx
import { memo } from 'react'
import { motion } from 'framer-motion'
import { formatTime } from '../../utils/dateUtils'
import useWeather from '../../hooks/useWeather'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Оптимизированный элемент почасового прогноза
 */
const HourlyItem = memo(({ item, index, isFirst, isAnimating }) => {
  return (
    <motion.div
      key={item.dt}
      className="flex flex-col items-center min-w-16 mx-1 will-change-transform"
      initial={{ opacity: 0, y: 15 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 15 : 0 
      }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.03,
        ease: "easeOut"
      }}
    >
      <div className="text-gray-500 dark:text-gray-400 text-sm mb-2 font-medium">
        {isFirst ? 'Сейчас' : formatTime(item.dt)}
      </div>
      <div className="mb-2">
        <WeatherIcon 
          iconCode={item.weather && item.weather[0] ? item.weather[0].icon : '01d'} 
          size={38} 
        />
      </div>
      <div className="font-bold text-lg">
        {Math.round(item.main.temp)}°
      </div>
    </motion.div>
  )
})

WeeklyForecast.displayName = 'WeeklyForecast'

// Оптимизированный FarmerTips.jsx
import { useState, useEffect, memo } from 'react'
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
 * Оптимизированный элемент совета
 */
const TipItem = memo(({ tip, index, onClick, isAnimating }) => {
  // Получаем подходящую иконку для совета
  const icon = getTipIcon(tip);
  
  return (
    <motion.div
      key={index}
      className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex cursor-pointer will-change-transform"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        scale: isAnimating ? 0.9 : 1 
      }}
      transition={{ 
        duration: 0.3,
        delay: 0.4 + index * 0.05,
        ease: "easeOut"
      }}
      onClick={onClick}
      whileHover={{
        y: -2,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.97,
        transition: { duration: 0.1 }
      }}
    >
      <div className="w-10 h-10 mr-3 flex-shrink-0 bg-green-100 dark:bg-green-800/30 flex items-center justify-center rounded-full">
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-sm font-medium leading-tight line-clamp-2 overflow-hidden text-ellipsis">
        {tip}
      </p>
    </motion.div>
  )
})

TipItem.displayName = 'TipItem'

/**
 * Компонент советов для фермеров с оптимизированной производительностью
 */
const FarmerTips = memo(() => {
  // Получаем данные о погоде из контекста
  const { weatherData, isAnimating } = useWeather()
  // Состояние для советов
  const [tips, setTips] = useState([])
  // Состояние для выбранного совета
  const [selectedTip, setSelectedTip] = useState(null)
  
  // Получаем советы при изменении данных о погоде
  useEffect(() => {
    let isMounted = true;
    
    // Асинхронная функция для загрузки советов
    const loadTips = async () => {
      if (!weatherData || !weatherData.weather) return
      
      try {
        const generatedTips = await generateFarmerTips(weatherData.weather)
        
        // Проверяем, что компонент все еще смонтирован
        if (isMounted) {
          setTips(generatedTips.slice(0, 4)) // Ограничиваем до 4 советов
        }
      } catch (error) {
        console.error('Ошибка при загрузке советов:', error)
        
        // Добавляем резервные советы при ошибке
        if (isMounted) {
          setTips([
            'Поливайте растения в соответствии с погодными условиями',
            'Следите за состоянием почвы',
            'Защищайте растения от экстремальных погодных условий',
            'Проверяйте прогноз погоды перед планированием работ'
          ])
        }
      }
    }
    
    loadTips();
    
    // Очистка при размонтировании
    return () => {
      isMounted = false;
    };
  }, [weatherData])
  
  // Если нет данных или советов, не рендерим компонент
  if (!weatherData || !weatherData.weather || tips.length === 0) return null
  
  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 will-change-transform"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isAnimating ? 0 : 1, 
          y: isAnimating ? 20 : 0 
        }}
        transition={{ 
          duration: 0.4,
          delay: 0.3,
          ease: [0.175, 0.885, 0.32, 1.275]
        }}
        layoutId="farmer-tips-card"
      >
        <h2 className="text-xl font-semibold mb-4">Советы для фермеров</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {tips.map((tip, index) => (
              <TipItem
                key={index}
                tip={tip}
                index={index}
                onClick={() => setSelectedTip({ text: tip, icon: getTipIcon(tip) })}
                isAnimating={isAnimating}
              />
            ))}
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
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full shadow-lg will-change-transform"
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
})

FarmerTips.displayName = 'FarmerTips'

export {
  CurrentWeather,
  HourlyForecast,
  WeatherDetails,
  WeeklyForecast,
  FarmerTips
}
})

HourlyItem.displayName = 'HourlyItem'

/**
 * Компонент почасового прогноза с оптимизацией производительности
 */
const HourlyForecast = memo(() => {
  // Получаем данные о погоде из контекста
  const { weatherData, isAnimating } = useWeather()
  
  // Если нет данных, не рендерим компонент
  if (!weatherData || !weatherData.forecast) return null
  
  // Ограничиваем количество отображаемых часов
  const hourlyData = weatherData.forecast.list.slice(0, 24)
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 will-change-transform"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 20 : 0 
      }}
      transition={{ 
        duration: 0.4,
        delay: 0.1,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
      layoutId="hourly-forecast-card"
    >
      <h2 className="text-xl font-semibold mb-4 px-2">Почасовой прогноз</h2>
      
      <div className="flex overflow-x-auto pb-3 pt-1 px-2 mx-0 scrollbar-hide overscroll-x-contain 
                      scroll-smooth snap-x snap-mandatory"> 
        {hourlyData.map((item, index) => (
          <HourlyItem 
            key={item.dt}
            item={item} 
            index={index} 
            isFirst={index === 0}
            isAnimating={isAnimating}
          />
        ))}
      </div>
    </motion.div>
  )
})

HourlyForecast.displayName = 'HourlyForecast'

// Оптимизированный WeatherDetails.jsx
import { memo } from 'react'
import { motion } from 'framer-motion'
import { Wind, Droplets, Eye, Thermometer } from 'lucide-react'
import useWeather from '../../hooks/useWeather'

/**
 * Оптимизированный компонент элемента деталей
 */
const DetailItem = memo(({ detail, index, isAnimating }) => {
  return (
    <motion.div
      key={detail.title}
      className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3 flex items-center will-change-transform"
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 10 : 0 
      }}
      transition={{ 
        duration: 0.3,
        delay: 0.3 + index * 0.05,
        ease: "easeOut"
      }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <div className="w-10 h-10 mr-3 rounded-full bg-white dark:bg-gray-800 
                    flex items-center justify-center flex-shrink-0">
        {detail.icon}
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {detail.title.toUpperCase()}
        </div>
        <div className="text-base font-bold">
          {detail.value}
        </div>
      </div>
    </motion.div>
  )
})

DetailItem.displayName = 'DetailItem'

/**
 * Компонент деталей погоды с оптимизированной производительностью
 */
const WeatherDetails = memo(() => {
  // Получаем данные о погоде из контекста
  const { weatherData, isAnimating } = useWeather()
  
  // Если нет данных, не рендерим компонент
  if (!weatherData || !weatherData.weather) return null
  
  const { main, visibility, wind } = weatherData.weather
  
  // Детали погоды
  const details = [
    {
      title: 'Ветер',
      value: `${wind.speed.toFixed(1)} м/с`,
      icon: <Wind size={22} strokeWidth={1.5} className="text-blue-500" />
    },
    {
      title: 'Влажность',
      value: `${main.humidity}%`,
      icon: <Droplets size={22} strokeWidth={1.5} className="text-blue-400" />
    },
    {
      title: 'Видимость',
      value: `${(visibility / 1000).toFixed(1)} км`,
      icon: <Eye size={22} strokeWidth={1.5} className="text-indigo-400" />
    },
    {
      title: 'Ощущается',
      value: `${Math.round(main.feels_like)}°`,
      icon: <Thermometer size={22} strokeWidth={1.5} className="text-orange-500" />
    }
  ]
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 will-change-transform"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 20 : 0 
      }}
      transition={{ 
        duration: 0.4,
        delay: 0.2,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
      layoutId="weather-details-card"
    >
      <h2 className="text-xl font-semibold mb-4">Детали</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {details.map((detail, index) => (
          <DetailItem
            key={detail.title}
            detail={detail}
            index={index}
            isAnimating={isAnimating}
          />
        ))}
      </div>
    </motion.div>
  )
})

WeatherDetails.displayName = 'WeatherDetails'

// Оптимизированный WeeklyForecast.jsx
import { useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import useWeather from '../../hooks/useWeather'
import { groupForecastByDays } from '../../utils/weatherUtils'
import WeatherIcon from '../shared/WeatherIcon'

/**
 * Оптимизированный компонент элемента прогноза на день
 */
const DayItem = memo(({ day, index, isAnimating, onClick }) => {
  // Рассчитываем среднюю температуру
  const avgTemp = Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length)
  
  // Определяем наиболее частую иконку погоды
  let mostFrequentIcon = "01d"
  if (day.weather && day.weather.length > 0) {
    const iconCounts = {}
    day.weather.forEach(icon => {
      if (!iconCounts[icon]) {
        iconCounts[icon] = 0
      }
      iconCounts[icon]++
    })
    
    let maxCount = 0
    Object.entries(iconCounts).forEach(([icon, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostFrequentIcon = icon
      }
    })
  }
  
  return (
    <motion.div
      key={day.date}
      className="flex items-center justify-between py-3 border-b border-gray-100 
                dark:border-gray-700 last:border-0 cursor-pointer will-change-transform"
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 10 : 0 
      }}
      transition={{
        duration: 0.3,
        delay: 0.5 + index * 0.04,
        ease: "easeOut"
      }}
      onClick={onClick}
      whileHover={{
        x: 2,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <div className="text-base font-medium">
        {index === 0 ? 'Сегодня' : day.day}
      </div>
      
      <div className="flex items-center">
        <div className="mr-4">
          <WeatherIcon iconCode={mostFrequentIcon} size={38} />
        </div>
        <div className="text-base font-bold w-12 text-right">
          {avgTemp}°C
        </div>
      </div>
    </motion.div>
  )
})

DayItem.displayName = 'DayItem'

/**
 * Компонент прогноза на неделю с оптимизированной производительностью
 */
const WeeklyForecast = memo(() => {
  // Получаем данные о погоде и функцию открытия модального окна из контекста
  const { weatherData, openDayModal, isAnimating } = useWeather()
  
  // Группируем прогноз по дням и используем useMemo для оптимизации
  const dailyForecast = useMemo(() => {
    if (!weatherData || !weatherData.forecast) return []
    
    const groupedForecast = groupForecastByDays(weatherData.forecast)
    return Object.values(groupedForecast).slice(0, 7)
  }, [weatherData])
  
  // Если нет данных или прогноза, не рендерим компонент
  if (!weatherData || !weatherData.forecast || dailyForecast.length === 0) return null
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 will-change-transform"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        y: isAnimating ? 20 : 0 
      }}
      transition={{
        duration: 0.4,
        delay: 0.4,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
      layoutId="weekly-forecast-card"
    >
      <h2 className="text-xl font-semibold mb-4">Прогноз на 7 дней</h2>
      
      <div className="flex flex-col">
        {dailyForecast.map((day, index) => (
          <DayItem 
            key={day.date}
            day={day}
            index={index}
            isAnimating={isAnimating}
            onClick={() => openDayModal(day)}
          />
        ))}
      </div>
    </motion.div>
  )
