const UpdateSection = ({
  items,
  categories,
  editId,
  editName,
  editCategory,
  editQuantity,
  editThreshold,
  editExpiryDate,
  onNameChange,
  onCategoryChange,
  onQuantityChange,
  onThresholdChange,
  onExpiryDateChange,
  onSubmit,
  onCancel,
}) => {
  const selectedItem = items.find(item => item.id === editId)

  if (!selectedItem) {
    return (
      <div className="update-section">
        <p className="item-details">Select an item to update.</p>
      </div>
    )
  }

  return (
    <div className="update-section">
      <p className="item-name">Updating: {selectedItem.name}</p>

      <form className="item-form" onSubmit={onSubmit}>
        <input value={editName} onChange={onNameChange} placeholder='Name' />
        <select value={editCategory} onChange={onCategoryChange}>
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input value={editQuantity} onChange={onQuantityChange} placeholder='Quantity' />
        <input value={editThreshold} onChange={onThresholdChange} placeholder='Threshold' />
        <input type='date' value={editExpiryDate} onChange={onExpiryDateChange} />
        <button type='submit'>Submit Update</button>
        <button type='button' onClick={onCancel}>Cancel</button>
      </form>
    </div>
  )
}

export default UpdateSection
