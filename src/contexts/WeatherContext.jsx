import { 
  createContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef 
} from 'react'
import { fetchWeatherData } from '../utils/api'
import { 
  getCachedWeatherData, 
  cacheWeatherData, 
  getLastCity 
} from '../utils/localStorage'

// Константы
const DEFAULT_CITY = 'Москва'
const DEBOUNCE_TIMEOUT = 10000 // 10 секунд между запросами

// Создаем контекст с производительной оптимизацией
export const WeatherContext = createContext(null)

export function WeatherProvider({ 
  children, 
  setShowWeather, 
  setError, 
  setLoading 
}) {
  // Минимизируем количество состояний
  const [state, setState] = useState({
    weatherData: null,
    currentCity: '',
    modalVisible: false,
    selectedDayData: null,
    isAnimating: false,
    isInitialLoading: true
  });

  // Лучшее использование ref для некешируемых значений
  const lastFetchAttempt = useRef(null)
  const isMounted = useRef(false)

  // Мемоизированная функция обновления состояния
  const updateState = useCallback((newState) => {
    setState(prevState => ({...prevState, ...newState}));
  }, []);

  // Оптимизированная функция анимации состояния
  const animateStateChange = useCallback((newData, newCity) => {
    updateState({ isAnimating: true });
    
    setTimeout(() => {
      updateState({
        weatherData: newData,
        currentCity: newCity,
        isAnimating: false
      });
    }, 150);
  }, [updateState]);

  // Загрузка данных о погоде с расширенной защитой
  const loadWeatherData = useCallback(async (city, force = false) => {
    const now = Date.now();
    
    // Защита от частых запросов
    if (!force && 
        lastFetchAttempt.current && 
        lastFetchAttempt.current.city === city && 
        now - lastFetchAttempt.current.time < DEBOUNCE_TIMEOUT) {
      console.log(`Слишком частый запрос для города ${city}`);
      return;
    }

    lastFetchAttempt.current = { city, time: now };
    setLoading(true);

    try {
      const data = await fetchWeatherData(city);
      
      // Обработка данных с анимацией
      if (state.weatherData) {
        animateStateChange(data, city);
      } else {
        updateState({
          weatherData: data,
          currentCity: city
        });
      }

      setShowWeather(true);
      cacheWeatherData(city, data);
      setError(null);

    } catch (error) {
      console.error('Ошибка загрузки:', error);
      const cached = getCachedWeatherData();

      if (cached) {
        animateStateChange(cached.data, cached.city);
        setShowWeather(true);
        setError('Данные из кеша');
      } else {
        updateState({
          weatherData: null,
          currentCity: DEFAULT_CITY
        });
        setError('Не удалось загрузить данные');
      }
    } finally {
      updateState({ isInitialLoading: false });
      setTimeout(() => setLoading(false), 300);
    }
  }, [
    state.weatherData, 
    setLoading, 
    setError, 
    setShowWeather, 
    animateStateChange,
    updateState
  ]);

  // Начальная загрузка данных
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      
      const initApp = async () => {
        const savedCity = getLastCity() || DEFAULT_CITY;
        await loadWeatherData(savedCity);
      };

      initApp();
    }
  }, [loadWeatherData]);

  // Мемоизация контекста
  const contextValue = useMemo(() => ({
    ...state,
    loadWeatherData,
    handleSearch: (city) => loadWeatherData(city, true),
    openDayModal: (dayData) => {
      updateState({ 
        modalVisible: true, 
        selectedDayData: dayData 
      });
    },
    closeDayModal: () => {
      updateState({ 
        modalVisible: false, 
        selectedDayData: null 
      });
    }
  }), [state, loadWeatherData, updateState]);

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
}
