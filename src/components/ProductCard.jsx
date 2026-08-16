const priceAsOfDate = new Date().toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-image" loading="lazy" />
        ) : (
          <img
            src="https://placehold.co/400x400/eef2f8/5b6b85?text=No+Image"
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        )}
      </div>
      <div className="product-card-body">
        <div className="product-category-tag">{product.category}</div>
        <div className="product-name">{product.name}</div>
        {product.description && (
          <div className="product-highlight">{product.description}</div>
        )}
        <div className="product-price-row">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
        </div>
        <span className="product-price-note">
          Price as of {priceAsOfDate}. Price and availability may change on Amazon.
        </span>
        <a
          href={product.affiliate_link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="product-link"
        >
          View on Amazon &rarr;
        </a>
      </div>
    </div>
  )
}

export default ProductCard
