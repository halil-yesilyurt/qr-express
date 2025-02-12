import { useState, useEffect } from 'react'

export function useDarkMode() {
  // Check if user has a saved preference
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // If no saved preference, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const [isDarkMode, setIsDarkMode] = useState(getSavedTheme)

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    // Apply theme to both document root and body
    document.documentElement.classList.toggle('dark', isDarkMode)
    document.body.className = isDarkMode ? 'dark bg-gray-900' : 'light bg-gray-100'
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev
      localStorage.setItem('theme', newValue ? 'dark' : 'light')
      return newValue
    })
  }

  return { isDarkMode, toggleDarkMode }
} 