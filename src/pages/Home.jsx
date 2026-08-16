import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { categoryIcon } from '../utils/categoryIcons'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'

const TRUST_PILLARS = [
  {
    icon: '\u{1F50D}',
    title: 'Independent Curation',
    text: 'We hand-select every product based on specs, reviews, and real-world usefulness — not who pays the most.',
  },
  {
    icon: '\u{1F517}',
    title: 'Direct Amazon Links',
    text: 'Every pick links straight to its official Amazon listing, so you always see current pricing and reviews.',
  },
  {
    icon: '\u{1F504}',
    title: 'Regularly Updated',
    text: 'Our picks are refreshed as new products launch and prices shift, so the list stays current.',
  },
]

function Home() {
  const { products, loading } = useProducts()
  const categories = useCategories()

  const topPicks = products.slice(0, 4)

  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-eyebrow">Tech Picks, Curated</span>
          <h1>Find the right tech, without the research rabbit hole.</h1>
          <p>
            We dig through laptops, components, peripherals, and smart home gear so you
            don't have to — then link you straight to Amazon to buy.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-accent">
              Shop All Products
            </Link>
            <a href="#top-picks" className="btn btn-secondary">
              See Top Picks
            </a>
          </div>
        </div>
      </section>

      <div className="container">
        {categories.length > 0 && (
          <section className="page-section page-section--tight">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">Browse</span>
                <h2>Shop by Category</h2>
              </div>
            </div>
            <div className="category-grid">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="category-card"
                >
                  <span className="category-icon">{categoryIcon(cat)}</span>
                  <span className="category-label">{cat}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="page-section page-section--tight" id="top-picks">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">Editor's Picks</span>
              <h2>Top Picks Right Now</h2>
              <p>A handful of standouts from across our catalog.</p>
            </div>
            <Link to="/shop" className="btn btn-secondary btn-sm">
              View All Products
            </Link>
          </div>

          {loading ? (
            <div className="state-message">Loading picks...</div>
          ) : topPicks.length === 0 ? (
            <div className="state-message">No products yet — check back soon.</div>
          ) : (
            <div className="products-grid">
              {topPicks.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="page-section page-section--tight">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">Why Trust Us</span>
              <h2>How We Pick Products</h2>
            </div>
          </div>
          <div className="trust-grid">
            {TRUST_PILLARS.map((pillar) => (
              <div className="trust-card" key={pillar.title}>
                <div className="trust-card-icon">{pillar.icon}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="page-section page-section--tight">
          <Newsletter />
        </section>
      </div>
    </div>
  )
}

export default Home
