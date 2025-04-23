import { useEffect } from 'react';

/**
 * Современный компонент для обеспечения корректного отображения темной темы
 * с использованием CSS переменных и системной предпочтительной темы
 * 
 * @param {Object} props Свойства компонента
 * @param {boolean} props.darkMode Флаг включения темной темы
 * @returns {null} Компонент не имеет визуального представления
 */
const DarkModeEnforcer = ({ darkMode }) => {
  // Применение темной темы к HTML-элементу
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      
      // Устанавливаем мета-тег для цвета темы в iOS
      updateMetaThemeColor('#000000');
      
      // Устанавливаем предпочтительную цветовую схему для всех элементов формы
      setColorScheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      
      // Возвращаем оригинальный цвет темы
      updateMetaThemeColor('#f2f2f6');
      
      // Возвращаем светлую цветовую схему
      setColorScheme('light');
    }
    
    // Очистка при размонтировании
    return () => {
      // Мы не удаляем класс dark при размонтировании,
      // так как это может повлиять на другие компоненты
    };
  }, [darkMode]);
  
  // Обработка изменений системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event) => {
      const systemPrefersDark = event.matches;
      
      // Если пользователь не переопределил тему вручную,
      // следуем системным настройкам
      if (darkMode === systemPrefersDark) {
        // Применяем нужную тему
        if (systemPrefersDark) {
          document.documentElement.classList.add('dark');
          updateMetaThemeColor('#000000');
          setColorScheme('dark');
        } else {
          document.documentElement.classList.remove('dark');
          updateMetaThemeColor('#f2f2f6');
          setColorScheme('light');
        }
      }
    };
    
    // Добавляем слушатель изменений системной темы
    try {
      // Современный метод (addListener устарел)
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (e) {
      // Fallback для старых браузеров
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [darkMode]);
  
  // Обеспечиваем применение темы к элементам ввода
  useEffect(() => {
    if (!darkMode) return;
    
    // Эта функция будет добавлять атрибут data-theme="dark" ко всем
    // динамически добавляемым элементам ввода
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const inputs = node.querySelectorAll('input, textarea, select');
              inputs.forEach((input) => {
                input.setAttribute('data-theme', 'dark');
              });
              
              if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.tagName === 'SELECT') {
                node.setAttribute('data-theme', 'dark');
              }
            }
          });
        }
      });
    });
    
    // Наблюдаем за всем DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // Очистка при размонтировании
    return () => observer.disconnect();
  }, [darkMode]);
  
  // Компонент не имеет визуального представления
  return null;
};

/**
 * Обновляет мета-тег theme-color для изменения цвета UI браузера
 * 
 * @param {string} color Цвет в формате HEX
 */
function updateMetaThemeColor(color) {
  // Ищем существующий мета-тег
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  
  if (!metaThemeColor) {
    // Если мета-тег не существует, создаем его
    metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    document.head.appendChild(metaThemeColor);
  }
  
  // Устанавливаем цвет
  metaThemeColor.content = color;
}

/**
 * Устанавливает предпочтительную цветовую схему для элементов формы
 * 
 * @param {string} scheme Цветовая схема ('dark' или 'light')
 */
function setColorScheme(scheme) {
  // Создаем или обновляем стиль для элементов формы
  let styleElement = document.getElementById('color-scheme-style');
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'color-scheme-style';
    document.head.appendChild(styleElement);
  }
  
  // Устанавливаем правила CSS
  styleElement.textContent = `
    input, textarea, select, button {
      color-scheme: ${scheme};
    }
  `;
  
  // Также устанавливаем атрибуты для всех существующих элементов ввода
  document.querySelectorAll('input, textarea, select').forEach((input) => {
    input.setAttribute('data-theme', scheme);
  });
}

export default DarkModeEnforcer;
