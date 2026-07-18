const ActionToolbar = ({
  activePanel,
  categories,
  selectedCategory,
  showSummary,
  onCategoryChange,
  onTogglePanel,
  onToggleSummary,
}) => {
  return (
    <div className="toolbar">
      <select
        className="dropdown"
        value={selectedCategory}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <option value="all">All Items</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <button onClick={onToggleSummary}>
        {showSummary ? 'Hide Summary' : 'Show Summary'}
      </button>

      <button onClick={() => onTogglePanel('add')}>
        {activePanel === 'add' ? 'Cancel' : 'Add New Item'}
      </button>
    </div>
  )
}

export default ActionToolbar
