// src/components/shared/DarkModeEnforcer.jsx

import { useEffect } from 'react';

/**
 * Компонент, который принудительно применяет стили темной темы ко всем текстовым элементам
 * @param {Object} props 
 * @param {boolean} props.darkMode - Флаг включения темной темы
 * @returns {null} Компонент не имеет визуального представления
 */
const DarkModeEnforcer = ({ darkMode }) => {
  useEffect(() => {
    if (!darkMode) return;
    
    // Вставляем специальные стили для темной темы
    const styleEl = document.createElement('style');
    styleEl.id = 'dark-mode-enforcer';
    styleEl.textContent = `
      /* Глобальные правила для всего текста */
      html.dark * {
        color: white !important;
      }
      
      /* Поле ввода */
      html.dark input, 
      html.dark textarea,
      html.dark .ios-search-input,
      html.dark [contenteditable] {
        color: white !important;
      }
      
      /* Фикс для температуры */
      html.dark .text-\\[76px\\] {
        color: white !important;
        text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
      }
      
      /* Очень важное правило с высоким весом */
      html.dark [class] {
        color: white !important;
      }
      
      /* Исключения для иконок и цветных элементов */
      html.dark svg *,
      html.dark [class*="lucide"] *,
      html.dark .text-ios-blue,
      html.dark .text-ios-green,
      html.dark .text-ios-red,
      html.dark .text-ios-orange,
      html.dark .bg-ios-blue,
      html.dark .bg-ios-red,
      html.dark .bg-ios-green,
      html.dark .ios-button[class*="bg-"],
      html.dark [class*="text-ios-"] {
        color: inherit !important;
      }
      
      /* Особое правило для цветных кнопок */
      html.dark .bg-ios-blue {
        color: white !important;
      }
    `;
    
    document.head.appendChild(styleEl);
    
    // Функция для принудительного применения стилей к элементам
    const enforceWhiteColorForAllElements = () => {
      // Особенный случай для заголовка температуры (числа 76px)
      document.querySelectorAll('.text-\\[76px\\]').forEach(el => {
        el.style.setProperty('color', 'white', 'important');
      });
      
      // Поиск всех текстовых контейнеров
      document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div:not([class*="text-ios-"]):not([class*="bg-ios"]), label, .ios-text-title1, .ios-text-title2, .ios-text-headline, .ios-text-body, .ios-text-subheadline, .ios-text-caption1, .ios-text-caption2').forEach(el => {
        el.style.setProperty('color', 'white', 'important');
      });
      
      // Особый фикс для поля поиска
      document.querySelectorAll('input.ios-search-input').forEach(el => {
        el.style.setProperty('color', 'white', 'important');
      });
    };
    
    // Применяем сразу и после небольшой задержки (для элементов, добавленных после рендеринга)
    enforceWhiteColorForAllElements();
    const timerId = setTimeout(enforceWhiteColorForAllElements, 100);
    
    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(() => {
      enforceWhiteColorForAllElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // Очистка при размонтировании
    return () => {
      const styleElement = document.getElementById('dark-mode-enforcer');
      if (styleElement) {
        styleElement.remove();
      }
      clearTimeout(timerId);
      observer.disconnect();
    };
  }, [darkMode]);
  
  // Компонент не рендерит никакого UI
  return null;
};

export default DarkModeEnforcer;
