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
import DarkModeEnforcer from './components/shared/DarkModeEnforcer' // Импортируем новый компонент

// Компонент для отладки
const DebugInfo = ({ error, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 text-white text-xs overflow-auto max-h-40 z-50">
      <pre>{error || 'Нет ошибок'}</pre>
    </div>
  );
};

function App() {
  // Состояние для темной темы
  const [darkMode, setDarkMode] = useState(false)
  // Состояние для отображения результатов погоды
  const [showWeather, setShowWeather] = useState(false)
  // Состояние для отображения ошибки
  const [error, setError] = useState(null)
  // Состояние для отображения загрузки
  const [loading, setLoading] = useState(false)
  // Состояние для отображения отладочной информации
  const [showDebug, setShowDebug] = useState(false)

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

  // Включаем режим отладки при 3-х быстрых нажатиях на заголовок
  useEffect(() => {
    let clickCount = 0;
    let clickTimer = null;

    const handleClick = () => {
      clickCount++;
      
      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 500);
      }

      if (clickCount >= 3) {
        clearTimeout(clickTimer);
        clickCount = 0;
        setShowDebug(prev => !prev);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <WeatherProvider setShowWeather={setShowWeather} setError={setError} setLoading={setLoading}>
      {/* Добавляем компонент DarkModeEnforcer */}
      <DarkModeEnforcer darkMode={darkMode} />
      
      <div className="ios-safe-top ios-safe-bottom ios-safe-left ios-safe-right">
        <div className="ios-container">
          {/* Секция поиска */}
          <SearchSection />

          {/* Основной контент */}
          {showWeather ? (
            <div 
              id="weatherResult"
              className="transition-all duration-400 transform"
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
          ) : !loading ? (
            <div className="ios-card p-8 text-center mt-8">
              <h2 className="ios-text-title2 mb-4">Погода не загружена</h2>
              <p className="mb-4">Введите название города в поле поиска или нажмите кнопку ниже для загрузки погоды для Москвы.</p>
              <button 
                className="ios-button bg-ios-blue text-white py-2 px-4 rounded-ios-pill" 
                onClick={() => {
                  const weatherContext = document.getElementById('root')?.__WEATHER_CONTEXT__;
                  if (weatherContext && weatherContext.loadWeatherData) {
                    weatherContext.loadWeatherData('Москва');
                  }
                }}
              >
                Загрузить для Москвы
              </button>
            </div>
          ) : null}
        </div>

        {/* Модальное окно с деталями дня */}
        <DayModal />
        
        {/* Индикатор загрузки */}
        {loading && <LoadingSpinner />}
        
        {/* Уведомление об ошибке */}
        {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
        
        {/* Отладочная информация */}
        <DebugInfo error={error} isVisible={showDebug} />
      </div>
    </WeatherProvider>
  )
}

export default App
