import { useId } from 'react'
import Link from '../../../shared/ui/Link.jsx'
import { paths } from '../../../shared/lib/paths.js'

export default function BeanCard({
  bean,
  compact = false,
  favoriteButton,
  cartButton,
}) {
  const titleId = useId()

  return (
    <article className="bean-card" aria-labelledby={titleId}>
      <h3 id={titleId}>
        <Link to={paths.bean(bean.id)}>{bean.name}</Link>
      </h3>
      <p>{bean.notes.join(', ')}</p>
      <p className="price">{bean.price} грн</p>
      {favoriteButton}
      {!compact && cartButton}
    </article>
  )
}
