import { useState, useEffect, lazy, Suspense } from 'react'
import { WeatherProvider } from './contexts/WeatherContext'
import SearchSection from './components/layout/SearchSection'
import LoadingSpinner from './components/shared/LoadingSpinner'
import ErrorNotification from './components/shared/ErrorNotification'
import DarkModeEnforcer from './components/shared/DarkModeEnforcer'
import WeatherIcon from './components/shared/WeatherIcon'

// Ленивая загрузка компонентов
const CurrentWeather = lazy(() => import('./components/weather/CurrentWeather'));
const HourlyForecast = lazy(() => import('./components/weather/HourlyForecast'));
const WeatherDetails = lazy(() => import('./components/weather/WeatherDetails'));
const FarmerTips = lazy(() => import('./components/weather/FarmerTips'));
const WeeklyForecast = lazy(() => import('./components/weather/WeeklyForecast'));
const DayModal = lazy(() => import('./components/layout/DayModal'));

// Компонент для отображения заглушки
const PlaceholderContent = ({ onLoadMoscow }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center mt-8 shadow-sm">
    <div className="flex justify-center mb-4">
      <WeatherIcon iconCode="01d" size={80} />
    </div>
    <h2 className="text-xl font-semibold mb-4">Погода не загружена</h2>
    <p className="mb-4">Введите название города в поле поиска или нажмите кнопку ниже для загрузки погоды для Москвы.</p>
    <button 
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full font-medium transition-colors 
                active:scale-[0.97] transform-gpu"
      onClick={onLoadMoscow}
    >
      Загрузить для Москвы
    </button>
  </div>
);

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

  // Функция для загрузки погоды Москвы
  const loadMoscowWeather = () => {
    const weatherContext = document.getElementById('root')?.__WEATHER_CONTEXT__;
    if (weatherContext && weatherContext.loadWeatherData) {
      weatherContext.loadWeatherData('Москва');
    }
  };

  // Эффект для определения предпочтений темной темы
  useEffect(() => {
    // Проверяем предпочтения системы по темной теме
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)

    // Подписываемся на изменения предпочтений
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => setDarkMode(e.matches)
    
    // Используем правильный API в зависимости от поддержки браузера
    try {
      // Современный метод
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } catch (e) {
      // Fallback для старых браузеров
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
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
        <div className="ios-container py-2">
          {/* Секция поиска */}
          <SearchSection />

          {/* Основной контент */}
          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl mt-4"></div>}>
            {showWeather ? (
              <div 
                id="weatherResult"
                className="transition-all duration-400 transform will-change-transform"
                style={{ 
                  opacity: showWeather ? 1 : 0,
                  transform: showWeather ? 'translateY(0)' : 'translateY(10px)'
                }}
              >
                {/* Основные компоненты для погоды */}
                <CurrentWeather />
                <HourlyForecast />
                <FarmerTips />
                <WeatherDetails />
                <WeeklyForecast />
              </div>
            ) : !loading ? (
              <PlaceholderContent onLoadMoscow={loadMoscowWeather} />
            ) : null}
          </Suspense>
        </div>

        {/* Модальное окно с деталями дня */}
        <Suspense fallback={null}>
          <DayModal />
        </Suspense>
        
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
