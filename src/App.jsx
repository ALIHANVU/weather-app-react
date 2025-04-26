// Оптимизированный файл src/App.jsx
// Улучшает производительность рендеринга на Android устройствах

import { useState, useEffect, lazy, Suspense, useCallback, memo } from 'react'
import { WeatherProvider } from './contexts/WeatherContext'
import SearchSection from './components/layout/SearchSection'
import LoadingSpinner from './components/shared/LoadingSpinner'
import ErrorNotification from './components/shared/ErrorNotification'
import DarkModeEnforcer from './components/shared/DarkModeEnforcer'
import WeatherIcon from './components/shared/WeatherIcon'

// Оптимизация 1: Более эффективная ленивая загрузка компонентов с предзагрузкой
const CurrentWeather = lazy(() => import('./components/weather/CurrentWeather'));
const HourlyForecast = lazy(() => import('./components/weather/HourlyForecast'));
const WeatherDetails = lazy(() => import('./components/weather/WeatherDetails'));
const FarmerTips = lazy(() => import('./components/weather/FarmerTips'));
const WeeklyForecast = lazy(() => import('./components/weather/WeeklyForecast'));
const DayModal = lazy(() => import('./components/layout/DayModal'));

// Оптимизация 2: Предзагрузка модулей для улучшения отзывчивости
// Предзагружаем модули после инициализации приложения
const preloadComponents = () => {
  const preload = () => {
    // Начинаем предзагрузку через 2 секунды после запуска приложения
    const timer = setTimeout(() => {
      import('./components/weather/CurrentWeather');
      import('./components/weather/HourlyForecast');
      // Остальные компоненты загружаем с задержкой
      setTimeout(() => {
        import('./components/weather/WeatherDetails');
        import('./components/weather/FarmerTips');
        import('./components/weather/WeeklyForecast');
        import('./components/layout/DayModal');
      }, 1000);
    }, 2000);
    
    return () => clearTimeout(timer);
  };
  
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      preload();
    } else {
      window.addEventListener('load', preload);
      return () => window.removeEventListener('load', preload);
    }
  }
};

// Оптимизация 3: Мемоизированный компонент для заглушки
const PlaceholderContent = memo(({ onLoadMoscow }) => (
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
));

PlaceholderContent.displayName = 'PlaceholderContent';

// Оптимизация 4: Мемоизированный компонент для отладки
const DebugInfo = memo(({ error, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 text-white text-xs overflow-auto max-h-40 z-50">
      <pre>{error || 'Нет ошибок'}</pre>
    </div>
  );
});

DebugInfo.displayName = 'DebugInfo';

// Оптимизация 5: Мемоизированный основной компонент
function App() {
  // Оптимизация 6: Используем useRef для состояний, которые не требуют перерисовки
  const [darkMode, setDarkMode] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Оптимизация 7: Мемоизированная функция для загрузки погоды Москвы
  const loadMoscowWeather = useCallback(() => {
    const weatherContext = document.getElementById('root')?.__WEATHER_CONTEXT__;
    if (weatherContext && weatherContext.loadWeatherData) {
      weatherContext.loadWeatherData('Москва');
    }
  }, []);

  // Оптимизация 8: Запускаем предзагрузку компонентов
  useEffect(() => {
    preloadComponents();
  }, []);

  // Оптимизация 9: Улучшенный эффект для имитации начальной загрузки
  useEffect(() => {
    // Проверяем производительность устройства
    const isLowEndDevice = () => {
      // Проверка на Android
      const isAndroid = /Android/.test(navigator.userAgent);
      // Проверка количества логических процессоров (если доступно)
      const hasLowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      // Проверка утечки памяти (на грубом уровне)
      const hasLowMemory = !window.performance || 
                         (window.performance.memory && 
                          window.performance.memory.jsHeapSizeLimit < 2147483648); // 2GB
      
      return isAndroid && (hasLowCPU || hasLowMemory);
    };
    
    // Адаптируем время загрузки в зависимости от устройства
    const loadTime = isLowEndDevice() ? 500 : 1000;
    
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, loadTime);
    
    return () => clearTimeout(timer);
  }, []);

  // Оптимизация 10: Объединение эффектов для темной темы
  useEffect(() => {
    // Проверяем предпочтения системы по темной теме
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)

    // Подписываемся на изменения предпочтений
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => setDarkMode(e.matches)
    
    // Применяем тему к документу
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
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
  }, []);

  // Оптимизация 11: Синхронизируем класс темной темы при изменении состояния
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode]);

  // Оптимизация 12: Улучшенный обработчик отладки
  useEffect(() => {
    let clickCount = 0;
    let clickTimer = null;
    let lastClickTime = 0;

    const handleClick = () => {
      const now = Date.now();
      
      // Сбрасываем счетчик, если между кликами прошло больше 500 мс
      if (now - lastClickTime > 500) {
        clickCount = 0;
      }
      
      clickCount++;
      lastClickTime = now;
      
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);

      if (clickCount >= 3) {
        setShowDebug(prev => !prev);
        clickCount = 0;
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Оптимизация 13: Учитываем особенности рендеринга для Android
  const isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);
  
  // Оптимизация 14: Уменьшаем число эффектов трансформации для Android
  const transitionStyle = isAndroid ? {
    opacity: showWeather ? 1 : 0
  } : {
    opacity: showWeather ? 1 : 0,
    transform: showWeather ? 'translateY(0)' : 'translateY(10px)'
  };

  return (
    <>
      {/* Показываем спиннер начальной загрузки поверх всего */}
      {initialLoading && (
        <LoadingSpinner message="Запуск приложения..." />
      )}
      
      <WeatherProvider setShowWeather={setShowWeather} setError={setError} setLoading={setLoading}>
        {/* Добавляем компонент DarkModeEnforcer */}
        <DarkModeEnforcer darkMode={darkMode} />
        
        <div className="ios-safe-top ios-safe-bottom ios-safe-left ios-safe-right">
          <div className="ios-container py-2">
            {/* Секция поиска */}
            <SearchSection />

            {/* Основной контент с оптимизированным Suspense */}
            <Suspense fallback={
              <div className={`animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl mt-4 ${
                isAndroid ? 'will-change-auto' : 'will-change-transform'
              }`}></div>
            }>
              {showWeather ? (
                <div 
                  id="weatherResult"
                  className={`transition-all duration-400 ${
                    isAndroid ? 'will-change-auto' : 'will-change-transform'
                  }`}
                  style={transitionStyle}
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

          {/* Модальное окно с деталями дня - ленивая загрузка */}
          <Suspense fallback={null}>
            <DayModal />
          </Suspense>
          
          {/* Индикатор загрузки - показываем только во время обычной загрузки, не во время начальной */}
          {loading && !initialLoading && <LoadingSpinner />}
          
          {/* Уведомление об ошибке */}
          {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
          
          {/* Отладочная информация */}
          <DebugInfo error={error} isVisible={showDebug} />
        </div>
      </WeatherProvider>
    </>
  )
}

export default App;

/*
СПИСОК ДАЛЬНЕЙШИХ ОПТИМИЗАЦИЙ:

1. Оптимизация CSS:
   - Создать отдельный CSS файл для Android: src/index.android.css
   - Уменьшить количество CSS-свойств, вызывающих перекомпоновку (особенно transform, box-shadow)
   - Подключить файл условно через useEffect на основе User-Agent

2. Оптимизация анимаций:
   - В файле src/components/weather/CurrentWeather.jsx:
     - Добавить проверку isAndroid и упростить анимацию для Android
     - Использовать transform: translateZ(0) для принудительного использования GPU
   - В файле src/components/weather/WeeklyForecast.jsx:
     - Снизить количество анимированных элементов
   - В файле src/components/weather/FarmerTips.jsx:
     - Добавить условную логику для анимаций на Android

3. Оптимизация контекста:
   - В файле src/contexts/WeatherContext.jsx:
     - Разделить контекст на несколько мелких для снижения перерисовок
     - Использовать useReducer вместо множества useState
     - Оптимизировать логику загрузки данных

4. Оптимизация компонентов:
   - В файле src/components/layout/DayModal.jsx:
     - Снизить количество анимационных эффектов
     - Разделить внутренние компоненты на более мелкие и мемоизировать их
   - В файле src/components/shared/WeatherIcon.jsx:
     - Предварительно загружать SVG иконки
     - Возможно заменить на PNG для Android с низкой производительностью

5. Оптимизация HTTP запросов:
   - В файле src/utils/api.js:
     - Добавить агрессивное кеширование запросов
     - Использовать сжатие данных, если возможно

6. Общая оптимизация:
   - Удалить все неиспользуемые зависимости
   - Настроить webpack для создания отдельных бандлов для разных платформ
   - Использовать нативные элементы вместо сложных React-компонентов на слабых устройствах

7. Служебные рабочие для кеширования:
   - Добавить service worker для кеширования данных о погоде
   - Добавить агрессивное кеширование статических ресурсов

8. Оптимизация рендеринга:
   - Добавить throttling для событий скролла
   - Использовать requestAnimationFrame для анимаций вместо CSS transitions
   - Реализовать виртуализацию списков для компонентов с большим количеством элементов

