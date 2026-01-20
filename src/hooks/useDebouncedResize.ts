import { useEffect } from 'react'

/**
 * Debounces window resize events to prevent excessive layout recalculations.
 * Per Phase 3 Research: debounce with 100-200ms delay prevents layout thrashing.
 */
export function useDebouncedResize(callback: () => void, delay: number = 200) {
  useEffect(() => {
    let timeoutId: number

    const handler = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        callback()
      }, delay)
    }

    window.addEventListener('resize', handler)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handler)
    }
  }, [callback, delay])
}