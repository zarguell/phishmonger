import { useReducer, useCallback } from 'react'

const MAX_HISTORY = 50

interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

type HistoryAction<T> =
  | { type: 'SET'; payload: T }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR'; initialState: T }

function historyReducer<T>(state: HistoryState<T>, action: HistoryAction<T>): HistoryState<T> {
  switch (action.type) {
    case 'SET': {
      const { past, present, future } = state

      // If the new state is the same as the present, do nothing
      if (present === action.payload) {
        return state
      }

      // Build new past array with MAX_HISTORY limit
      const newPast = [...past, present]
      if (newPast.length > MAX_HISTORY) {
        newPast.shift() // Remove oldest entry
      }

      return {
        past: newPast,
        present: action.payload,
        future: [], // Clear future on new state
      }
    }

    case 'UNDO': {
      const { past, present, future } = state

      if (past.length === 0) {
        return state // Cannot undo
      }

      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      }
    }

    case 'REDO': {
      const { past, present, future } = state

      if (future.length === 0) {
        return state // Cannot redo
      }

      const next = future[0]
      const newFuture = future.slice(1)

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      }
    }

    case 'CLEAR': {
      return {
        past: [],
        present: action.initialState,
        future: [],
      }
    }

    default:
      return state
  }
}

export function useUndoRedo<T>(initialState: T) {
  const [state, dispatch] = useReducer(historyReducer<T>, {
    past: [],
    present: initialState,
    future: [],
  })

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    dispatch({
      type: 'SET',
      payload: typeof newState === 'function' ? (newState as (prev: T) => T)(state.present) : newState,
    })
  }, [state.present])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR', initialState })
  }, [initialState])

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  return {
    state: state.present,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
  }
}
