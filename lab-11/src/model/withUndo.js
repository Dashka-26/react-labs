/**
 * Ред'юсер вищого порядку: отримує ред'юсер і повертає новий, який веде
 * історію змін. Стан нового ред'юсера — історія:
 *
 *   { past: [...], present, future: [...] }
 *
 * present — стан, з яким працює reducer; past — попередні стани, від
 * найстарішого до останнього; future — скасовані стани, які можна
 * повторити, від найближчого.
 *
 * Дії:
 *   { type: 'undo' }  повертає попередній стан
 *   { type: 'redo' }  повторює скасовану дію
 *   будь-яка інша дія йде в reducer разом із present. Якщо reducer
 *   повернув той самий стан, історія не змінюється.
 *
 * Історія зберігає не більше limit кроків. Як і будь-який ред'юсер, новий
 * ред'юсер не змінює історію, яку отримав.
 *
 * Використання на прикладі лічильника:
 *   const undoableCounter = withUndo(counterReducer)
 *   undoableCounter(createHistory(0), { type: 'incremented' })
 *   // { past: [0], present: 1, future: [] }
 *
 * Поки що кидає помилку. Вимоги — у тестах tests/withUndo.test.js і
 * tests/HistoryButtons.test.jsx.
 */
export function withUndo(reducer, limit = 20) {
  return function undoableReducer(state, action) {
    const { past, present, future } = state

    switch (action.type) {
      case 'undo': {
        if (past.length === 0) return state
        const previous = past[past.length - 1]
        const newPast = past.slice(0, -1)
        const nextFuture = [present, ...future]
        return {
          past: newPast,
          present: previous,
          future: limit <= 0 ? [] : nextFuture.slice(0, limit),
        }
      }

      case 'redo': {
        if (future.length === 0) return state
        const [next, ...newFuture] = future
        const nextPast = [...past, present]
        return {
          past: limit <= 0 ? [] : nextPast.slice(-limit),
          present: next,
          future: newFuture,
        }
      }

      default: {
        const nextPresent = reducer(present, action)
        if (Object.is(nextPresent, present)) return state
        const nextPast = [...past, present]
        return {
          past: limit <= 0 ? [] : nextPast.slice(-limit),
          present: nextPresent,
          future: [],
        }
      }
    }
  }
}

/** Історія, з якої починають: present і порожні past та future. */
export function createHistory(present) {
  return {
    past: [],
    present,
    future: [],
  }
}
