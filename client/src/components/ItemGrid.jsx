const ItemGrid = ({ items, onDelete, onEdit }) => {
  return (
    <div className="list-group">
      {items.map(item => {
        const threshold = Number(item.threshold) || 0
        const quantity = Number(item.quantity) || 0
        const stockState = quantity <= threshold
          ? 'critical'
          : quantity <= threshold + 2
            ? 'warning'
            : 'normal'

        const stockLabel = quantity <= threshold
          ? 'Out-Of-Stock'
          : quantity <= threshold + 2
            ? 'Low-Stock'
            : 'In-Stock'

        return (
          <div className="item-row" key={item.id}>
            <div className="item-top-row">
              <p className="item-name">{item.name}</p>
              <span className={`stock-indicator ${stockState}`}>{stockLabel}</span>
            </div>
            <p className="item-details">Category: {item.category || 'General'}</p>
            <p className="item-details">Quantity: {item.quantity}</p>
            <p className="item-details">Threshold: {item.threshold}</p>
            <p className="item-details">Expiry Date: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</p>

            <div className="card-actions">
              <button type="button" onClick={() => onEdit(item)}>Update</button>
              <button type="button" onClick={() => onDelete(item.id)}>Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ItemGrid
