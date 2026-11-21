import BeanCard from '../../features/beans/components/BeanCard.jsx'
import AddToCartButton from '../../features/cart/components/AddToCartButton.jsx'
import FavoriteButton from '../../features/favorites/components/FavoriteButton.jsx'
import { beans } from '../../lib/beans.js'

export default function CatalogPage() {
  return (
    <>
      <h1>Кава в зернах</h1>
      <section className="catalog" aria-labelledby="catalog-title">
        <h2 id="catalog-title">Усі сорти ({beans.length})</h2>
        <ul className="bean-grid">
          {beans.map((bean) => (
            <li key={bean.id}>
              <BeanCard
                bean={bean}
                favoriteButton={
                  <FavoriteButton productId={bean.id} name={bean.name} />
                }
                cartButton={<AddToCartButton bean={bean} />}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
