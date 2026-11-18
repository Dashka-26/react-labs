/**
 * Показує перші `step` елементів з `items` і кнопку, що показує наступні.
 *
 * Використання:
 *   <ShowMore items={reviews} step={3}>
 *     {(visibleItems) => <ul>…</ul>}
 *   </ShowMore>
 *
 * Вимоги — у тестах tests/ShowMore.test.jsx.
 */
import { useState } from 'react'

export default function ShowMore({ items, step, children }) {
  const [count, setCount] = useState(step)

  const visibleItems = items.slice(0, count)
  const hiddenCount = items.length - visibleItems.length
  const showButton = items.length > step

  function handleClick() {
    if (hiddenCount > 0) {
      setCount((prev) => Math.min(prev + step, items.length))
    } else {
      setCount(step)
    }
  }

  return (
    <>
      {children(visibleItems)}
      {showButton && (
        <button type="button" className="show-more" onClick={handleClick}>
          {hiddenCount > 0
            ? `Показати ще ${Math.min(step, hiddenCount)}`
            : 'Згорнути'}
        </button>
      )}
    </>
  )
}
