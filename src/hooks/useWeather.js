import { useContext } from 'react'
import { WeatherContext } from '../contexts/WeatherContext'

/**
 * Хук для доступа к контексту погоды
 * @returns {Object} Контекст погоды
 */
export function useWeather() {
  const context = useContext(WeatherContext)
  
  if (context === undefined) {
    throw new Error('useWeather должен использоваться внутри WeatherProvider')
  }
  
  return context
}

export default useWeather
