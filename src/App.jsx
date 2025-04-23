import { useState, useEffect } from 'react'
import { WeatherProvider } from './contexts/WeatherContext'
import SearchSection from './components/layout/SearchSection'
import CurrentWeather from './components/weather/CurrentWeather'
import HourlyForecast from './components/weather/HourlyForecast'
import WeatherDetails from './components/weather/WeatherDetails'
import FarmerTips from './components/weather/FarmerTips'
import WeeklyForecast from './components/weather/WeeklyForecast'
import DayModal from './components/layout/DayModal'
import ErrorNotification from './components/shared/ErrorNotification'
import LoadingSpinner from './components/shared/LoadingSpinner'

function App() {
  // Состояние для темной темы
  const [darkMode, setDarkMode] = useState(false)
  // Состояние для отображения результатов погоды
  const [showWeather, setShowWeather] = useState(false)
  // Состояние для отображения ошибки
  const [error, setError] = useState(null)
  // Состояние для отображения загрузки
  const [loading, setLoading] = useState(false)

  // Эффект для определения предпочтений темной темы
  useEffect(() => {
    // Проверяем предпочтения системы по темной теме
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)

    // Подписываемся на изменения предпочтений
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => setDarkMode(e.matches)
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Применяем класс темной темы к body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <WeatherProvider setShowWeather={setShowWeather} setError={setError} setLoading={setLoading}>
      <div className="ios-safe-top ios-safe-bottom ios-safe-left ios-safe-right">
        <div className="ios-container">
          {/* Секция поиска */}
          <SearchSection />

          {/* Основной контент */}
          {showWeather && (
            <div 
              id="weatherResult"
              className="transition-all duration-400 transform opacity-0 translate-y-2"
              style={{ 
                opacity: showWeather ? 1 : 0,
                transform: showWeather ? 'translateY(0)' : 'translateY(10px)'
              }}
            >
              {/* Основная информация о погоде */}
              <CurrentWeather />
              
              {/* Почасовой прогноз */}
              <HourlyForecast />
              
              {/* Детали погоды */}
              <WeatherDetails />
              
              {/* Советы для фермеров */}
              <FarmerTips />
              
              {/* Прогноз на неделю */}
              <WeeklyForecast />
            </div>
          )}
        </div>

        {/* Модальное окно с деталями дня */}
        <DayModal />
        
        {/* Индикатор загрузки */}
        {loading && <LoadingSpinner />}
        
        {/* Уведомление об ошибке */}
        {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      </div>
    </WeatherProvider>
  )
}

export default App
