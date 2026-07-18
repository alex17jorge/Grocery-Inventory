const AddItemForm = ({
  newName,
  newCategory,
  newQuantity,
  newThreshold,
  newExpiryDate,
  categories,
  onNameChange,
  onCategoryChange,
  onQuantityChange,
  onThresholdChange,
  onExpiryDateChange,
  onSubmit,
}) => {
  return (
    <form className="item-form" onSubmit={onSubmit}>
      <input value={newName} onChange={onNameChange} placeholder='Name' />
      <select value={newCategory} onChange={onCategoryChange}>
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <input value={newQuantity} onChange={onQuantityChange} placeholder='Quantity' />
      <input value={newThreshold} onChange={onThresholdChange} placeholder='Threshold' />
      <input type='date' value={newExpiryDate} onChange={onExpiryDateChange} />
      <button type='submit'>Add Item</button>
    </form>
  )
}

export default AddItemForm
