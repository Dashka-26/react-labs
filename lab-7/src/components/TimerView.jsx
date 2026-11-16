/**
 * Простий (presentational) компонент таймера: лише показує те, що отримав у
 * props, і викликає передані обробники. Власного стану й ефектів не має.
 *
 * Використання:
 *   <TimerView
 *     method={method}
 *     secondsLeft={175}
 *     status="running"   // 'idle' | 'running' | 'paused' | 'done'
 *     onStart={…}
 *     onPause={…}
 *     onReset={…}
 *   />
 *
 * Вимоги — у тестах tests/TimerView.test.jsx.
 */
import { formatTime } from '../formatTime.js'

export default function TimerView({
  method,
  secondsLeft,
  status,
  onStart,
  onPause,
  onReset,
}) {
  return (
    <article className="brew-timer" aria-labelledby={`${method.id}-title`}>
      <h3 id={`${method.id}-title`}>{method.name}</h3>
      <p>{method.recipe}</p>
      <p className="time" role="timer">
        {formatTime(secondsLeft)}
      </p>
      <p role="status" className="timer-done">
        {status === 'done' ? 'Готово! Час пити каву.' : ''}
      </p>
      <div className="timer-controls">
        {status === 'idle' && (
          <button type="button" onClick={onStart}>
            Старт
          </button>
        )}
        {status === 'running' && (
          <>
            <button type="button" onClick={onPause}>
              Пауза
            </button>
            <button type="button" onClick={onReset}>
              Скинути
            </button>
          </>
        )}
        {status === 'paused' && (
          <>
            <button type="button" onClick={onStart}>
              Продовжити
            </button>
            <button type="button" onClick={onReset}>
              Скинути
            </button>
          </>
        )}
        {status === 'done' && (
          <button type="button" onClick={onReset}>
            Спочатку
          </button>
        )}
      </div>
    </article>
  )
}
