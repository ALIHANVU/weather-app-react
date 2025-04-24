import { createContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { fetchWeatherData } from '../utils/api'
import { getCachedWeatherData, cacheWeatherData, getLastCity } from '../utils/localStorage'

// Константы
const DEFAULT_CITY = 'Москва'
const CACHE_EXPIRATION = 60 * 60 * 1000 // 1 час в миллисекундах
const DEBOUNCE_TIMEOUT = 10000 // 10 секунд между запросами одного города

// Создаем контекст
export const WeatherContext = createContext(null)

export function WeatherProvider({ children, setShowWeather, setError, setLoading }) {
  // Состояние для данных о погоде
  const [weatherData, setWeatherData] = useState(null)
  // Состояние для текущего города
  const [currentCity, setCurrentCity] = useState('')
  // Состояние для модального окна
  const [modalVisible, setModalVisible] = useState(false)
  // Состояние для данных выбранного дня
  const [selectedDayData, setSelectedDayData] = useState(null)
  // Референс для сохранения последней попытки загрузки
  const lastFetchAttempt = useRef(null)
  // Состояние для отслеживания начальной загрузки
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  // Состояние для отслеживания анимации
  const [isAnimating, setIsAnimating] = useState(false)
  // Референс для отслеживания был ли монтирован компонент
  const isMounted = useRef(false)
  
  // Мемоизированная функция для задержки обновления состояния с анимацией
  const animateStateChange = useCallback((newData, newCity) => {
    setIsAnimating(true)
    
    // Применение новых данных с задержкой для плавного перехода
    // Сначала исчезает текущий контент, затем появляется новый
    setTimeout(() => {
      setWeatherData(newData)
      setCurrentCity(newCity)
      
      // Даем время для первичного рендера новых компонентов 
      // перед запуском анимации входа
      setTimeout(() => {
        setIsAnimating(false)
      }, 50)
    }, 150)
  }, [])
  
  // Загрузка данных о погоде с защитой от частых вызовов
  const loadWeatherData = useCallback(async (city, force = false) => {
    // Проверяем, прошло ли достаточно времени с последней попытки для одного и того же города
    const now = Date.now()
    if (
      !force && 
      lastFetchAttempt.current && 
      lastFetchAttempt.current.city === city && 
      now - lastFetchAttempt.current.time < DEBOUNCE_TIMEOUT
    ) {
      console.log(`Слишком частый запрос для города ${city}. Пропускаем.`)
      return
    }
    
    console.log(`Загрузка данных о погоде для ${city}`)
    lastFetchAttempt.current = { city, time: now }
    setLoading(true)
    
    try {
      // Пробуем загрузить данные через API-функцию
      const data = await fetchWeatherData(city)
      
      if (!data || !data.weather || !data.forecast) {
        throw new Error('Получены неполные данные о погоде')
      }
      
      // Обновляем состояние успешными данными с анимацией
      if (weatherData) {
        // Если уже есть данные - используем плавный переход
        animateStateChange(data, city)
      } else {
        // При первой загрузке не анимируем
        setWeatherData(data)
        setCurrentCity(city)
      }
      
      setShowWeather(true)
      
      // Кешируем данные
      cacheWeatherData(city, data)
      
      // Убираем ошибку, если она была
      setError(null)
      
      console.log(`Данные о погоде для ${city} загружены успешно`)
    } catch (error) {
      console.error('Ошибка загрузки данных о погоде:', error.message)
      
      // Проверяем кеш при ошибке
      const cached = getCachedWeatherData()
      if (cached) {
        console.log('Загружаем данные из кеша')
        
        if (weatherData) {
          // Используем плавный переход для кешированных данных
          animateStateChange(cached.data, cached.city)
        } else {
          // При первой загрузке не анимируем
          setWeatherData(cached.data)
          setCurrentCity(cached.city)
        }
        
        setShowWeather(true)
        setError(`Не удалось обновить данные погоды. Отображены сохраненные данные.`)
      } else {
        // Если нет кеша, показываем заглушку
        const fallbackData = {
          weather: {
            name: city || 'Москва',
            main: { temp: 15, feels_like: 14, temp_max: 17, temp_min: 13, humidity: 70 },
            weather: [{ description: 'данные недоступны', icon: '01d' }],
            wind: { speed: 2.5 },
            visibility: 10000
          },
          forecast: {
            list: Array(8).fill().map((_, index) => ({
              dt: Math.floor(Date.now() / 1000) + index * 3600,
              main: { temp: 15 - index % 3, humidity: 70, feels_like: 14 },
              weather: [{ icon: '01d' }],
              wind: { speed: 2.5 },
              visibility: 10000
            }))
          }
        }
        
        // Устанавливаем заглушку с анимацией, если уже были данные
        if (weatherData) {
          animateStateChange(fallbackData, city || 'Москва')
        } else {
          setWeatherData(fallbackData)
          setCurrentCity(city || 'Москва')
        }
        
        setShowWeather(true)
        setError(`Не удалось загрузить данные о погоде для "${city}". Проверьте подключение к интернету.`)
      }
    } finally {
      // Завершаем начальную загрузку
      if (isInitialLoading) {
        setIsInitialLoading(false)
      }
      
      // Завершаем загрузку с небольшой задержкой для плавности
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }
  }, [
    weatherData, 
    setLoading, 
    setError, 
    setShowWeather, 
    animateStateChange, 
    isInitialLoading
  ])

  // Экспортируем контекст для отладки
  useEffect(() => {
    if (typeof document !== 'undefined' && document.getElementById('root')) {
      document.getElementById('root').__WEATHER_CONTEXT__ = {
        loadWeatherData,
        weatherData,
        currentCity,
        isAnimating
      }
    }
  }, [loadWeatherData, weatherData, currentCity, isAnimating])

  // Загрузка стартовых данных
  useEffect(() => {
    // Проверяем, что компонент монтируется впервые
    if (!isMounted.current) {
      isMounted.current = true
      
      const initApp = async () => {
        setLoading(true)
        
        try {
          // Проверяем кеш
          const cached = getCachedWeatherData()
          if (cached) {
            console.log('Найден кеш, отображаем сохраненные данные')
            setWeatherData(cached.data)
            setCurrentCity(cached.city)
            setShowWeather(true)
            
            // Асинхронно загружаем свежие данные с задержкой
            setTimeout(() => {
              loadFreshWeatherData()
            }, 1000)
            
            return
          }
          
          // Если нет кеша, загружаем данные для города по умолчанию
          console.log('Нет кешированных данных, загружаем данные для города по умолчанию')
          await loadWeatherData(DEFAULT_CITY)
        } catch (error) {
          console.warn('Ошибка инициализации приложения:', error.message)
          
          // Показываем заглушку, чтобы не отображать пустой экран
          setShowWeather(true)
          setWeatherData({
            weather: {
              name: DEFAULT_CITY,
              main: { temp: 15, feels_like: 14, temp_max: 17, temp_min: 13, humidity: 70 },
              weather: [{ description: 'данные недоступны', icon: '01d' }],
              wind: { speed: 2.5 },
              visibility: 10000
            },
            forecast: {
              list: Array(8).fill().map((_, index) => ({
                dt: Math.floor(Date.now() / 1000) + index * 3600,
                main: { temp: 15 - index % 3, humidity: 70, feels_like: 14 },
                weather: [{ icon: '01d' }],
                wind: { speed: 2.5 },
                visibility: 10000
              }))
            }
          })
          setError('Произошла ошибка при загрузке данных о погоде. Показаны примерные данные.')
        } finally {
          // Завершаем начальную загрузку
          setIsInitialLoading(false)
          
          // Убираем состояние загрузки плавно
          setTimeout(() => {
            setLoading(false)
          }, 300)
        }
      }
      
      initApp()
    }
  }, [loadWeatherData, setLoading, setShowWeather, setError, loadFreshWeatherData])

  // Загрузка свежих данных - мемоизируем эту функцию
  const loadFreshWeatherData = useCallback(async () => {
    try {
      // Проверяем сохраненный город
      const savedCity = getLastCity() || DEFAULT_CITY
      
      // Загружаем данные для сохраненного города
      await loadWeatherData(savedCity)
    } catch (error) {
      console.warn('Ошибка загрузки свежих данных:', error.message)
    }
  }, [loadWeatherData])

  // Обработчик поиска города
  const handleSearch = useCallback(async (city) => {
    if (!city) {
      setError('Пожалуйста, введите название города')
      return
    }
    
    // Минимальная проверка ввода
    if (city.length < 2) {
      setError('Название города должно содержать минимум 2 символа')
      return
    }
    
    // Загружаем данные для введенного города
    await loadWeatherData(city, true) // force=true для обхода защиты от частых вызовов
  }, [loadWeatherData, setError])

  // Открытие модального окна с деталями дня
  const openDayModal = useCallback((dayData) => {
    if (!dayData) return
    
    setSelectedDayData(dayData)
    
    // Добавляем небольшую задержку перед открытием модального окна
    // для более плавного переключения
    setTimeout(() => {
      setModalVisible(true)
    }, 50)
  }, [])

  // Закрытие модального окна
  const closeDayModal = useCallback(() => {
    setModalVisible(false)
    
    // Очищаем данные выбранного дня после закрытия модального окна
    // с дополнительной задержкой для плавной анимации
    setTimeout(() => {
      setSelectedDayData(null)
    }, 300) // Задержка для анимации закрытия
  }, [])

  // Мемоизируем контекстное значение для предотвращения ненужных перерисовок
  const contextValue = useMemo(() => ({
    weatherData,
    currentCity,
    modalVisible,
    selectedDayData,
    isAnimating,
    isInitialLoading,
    loadWeatherData,
    handleSearch,
    openDayModal,
    closeDayModal
  }), [
    weatherData,
    currentCity,
    modalVisible,
    selectedDayData,
    isAnimating,
    isInitialLoading,
    loadWeatherData,
    handleSearch,
    openDayModal,
    closeDayModal
  ])

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  )
}
