import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const offer = product.price - (product.price * product.discount / 100);
  const img = product.images?.[0] || 'https://via.placeholder.com/300';

  return (
    <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
      <div className="card hover-card h-100 border-0 shadow-sm rounded-3 overflow-hidden product-card">
       
<img src={img} alt={product.name} className="card-img-top" style={{ height: 300, objectFit: 'cover' }} />
        <div className="card-body bg-white p-2">
          <h6 className="fw-bold mb-1 text-truncate" style={{ fontSize: '14px' }}>{product.name}</h6>
          <div className="d-flex gap-1 align-items-center mb-1">
            <span className="text-danger fw-bold" style={{ fontSize: '15px' }}>৳{offer.toFixed(0)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-decoration-line-through text-muted" style={{ fontSize: '11px' }}>৳{product.price}</span>
                <span className="badge bg-warning text-dark" style={{ fontSize: '9px' }}>{product.discount}% OFF</span>
              </>
            )}
          </div>
          <div className="small fw-medium" style={{ fontSize: '12px' }}>
            {product.stockType === 'IN_STOCK' ? (
              <span className="text-success"><i className="las la-check-circle"></i> In Stock</span>
            ) : (
              <span className="text-danger"><i className="las la-times-circle"></i> Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}