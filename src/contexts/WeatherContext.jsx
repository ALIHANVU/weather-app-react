import { createContext, useState, useEffect, useCallback } from 'react'
import { fetchWeatherData } from '../utils/api'
import { getCachedWeatherData, cacheWeatherData, getLastCity } from '../utils/localStorage'

// Константы
const DEFAULT_CITY = 'Москва'
const CACHE_EXPIRATION = 60 * 60 * 1000 // 1 час в миллисекундах

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

  // Загрузка данных о погоде
  const loadWeatherData = useCallback(async (city) => {
    console.log(`Загрузка данных о погоде для ${city}`)
    setLoading(true)
    
    try {
      // Запрашиваем данные о погоде для города
      const data = await fetchWeatherData(city)
      
      if (!data || !data.weather || !data.forecast) {
        throw new Error('Получены неполные данные о погоде')
      }
      
      // Сохраняем данные в состоянии
      setWeatherData(data)
      setCurrentCity(city)
      
      // Показываем блок с результатами
      setShowWeather(true)
      
      // Кешируем данные
      cacheWeatherData(city, data)
      
      // Убираем ошибку, если она была
      setError(null)
      
      console.log(`Данные о погоде для ${city} загружены успешно`)
    } catch (error) {
      console.error('Ошибка загрузки данных о погоде:', error.message)
      setError(`Не удалось найти город "${city}". Пожалуйста, проверьте название и попробуйте снова.`)
      
      // Если это первая загрузка и нет данных, загружаем погоду для города по умолчанию
      if (!weatherData) {
        loadWeatherData(DEFAULT_CITY)
      }
    } finally {
      // Скрываем индикатор загрузки
      setLoading(false)
    }
  }, [setLoading, setError, setShowWeather, weatherData])

  // Загрузка стартовых данных
  useEffect(() => {
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
          
          // Асинхронно загружаем свежие данные
          setTimeout(() => {
            loadFreshWeatherData()
          }, 500)
          
          return
        }
        
        // Если нет кеша, загружаем данные для города по умолчанию
        console.log('Нет кешированных данных, загружаем данные для города по умолчанию')
        await loadWeatherData(DEFAULT_CITY)
      } catch (error) {
        console.warn('Ошибка инициализации приложения:', error.message)
        setError('Произошла ошибка при загрузке данных о погоде. Пожалуйста, повторите попытку.')
      } finally {
        setLoading(false)
      }
    }
    
    initApp()
  }, [loadWeatherData, setLoading, setShowWeather, setError])

  // Загрузка свежих данных
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
    await loadWeatherData(city)
  }, [loadWeatherData, setError])

  // Открытие модального окна с деталями дня
  const openDayModal = useCallback((dayData) => {
    if (!dayData) return
    
    setSelectedDayData(dayData)
    setModalVisible(true)
  }, [])

  // Закрытие модального окна
  const closeDayModal = useCallback(() => {
    setModalVisible(false)
    // Очищаем данные выбранного дня после закрытия модального окна
    setTimeout(() => {
      setSelectedDayData(null)
    }, 300) // Задержка для анимации закрытия
  }, [])

  // Значение, которое будет доступно в контексте
  const contextValue = {
    weatherData,
    currentCity,
    modalVisible,
    selectedDayData,
    loadWeatherData,
    handleSearch,
    openDayModal,
    closeDayModal
  }

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  )
}
