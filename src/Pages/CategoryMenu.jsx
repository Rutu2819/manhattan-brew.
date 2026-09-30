import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { categories } from '../Data/menuData'
import './CategoryMenu.css'
import { useCart } from '../context/CartContext'
import { MenuHero, MenuRail } from '../MenuHero'

export default function CategoryMenu() {
  const { slug } = useParams()
  const category = categories.find((c) => c.slug === slug)
  const { addToCart } = useCart()

  // Open every counter at the top so the big counter name shows first
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [slug])

  if (!category) {
    return <p>Category not found.</p>
  }

  return (
    <div className="mb-catpage" style={{ '--cat-color': category.color }}>
      <MenuHero category={slug} count={category.items.length} />
      <MenuRail active={slug} />

      <div className="mb-item-grid">
        {category.items.map((item) => (
          <div className="mb-item-card" key={item.id}>
            <div className="mb-item-photo">
              <img src={item.image} alt={item.name} loading="lazy" />
              {item.tag && <span className="mb-item-tag">{item.tag}</span>}
            </div>
            <div className="mb-item-body">
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <div className="mb-item-footer">
                <span className="mb-item-price">₹{item.price}</span>
                <button className="mb-add-to-cart" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}