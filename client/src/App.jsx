import { useEffect, useMemo, useState } from 'react';
import './App.css'
import productService from './services/Items'
import ActionToolbar from './components/ActionToolbar'
import ItemGrid from './components/ItemGrid'
import AddItemForm from './components/AddItemForm'
import UpdateSection from './components/UpdateSection'

const App = () => {
  const [items, setItems] = useState([])
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newQuantity, setNewQuantity] = useState('')
  const [newThreshold, setNewThreshold] = useState('')
  const [newExpiryDate, setNewExpiryDate] = useState('')

  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editQuantity, setEditQuantity] = useState('')
  const [editThreshold, setEditThreshold] = useState('')
  const [editExpiryDate, setEditExpiryDate] = useState('')

  const [activePanel, setActivePanel] = useState('items')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stockFilter, setStockFilter] = useState('')
  const [showSummary, setShowSummary] = useState(false)

  const [filter, setFilter] = useState('')

  const togglePanel = (panelName) => {
    setActivePanel(currentPanel => currentPanel === panelName ? null : panelName)
  }

  const showItems = activePanel === 'items'
  const showForm = activePanel === 'add'
  const showItemsUp = activePanel === 'update'

  const categories = ['General', ...new Set(items.map(item => item.category).filter(Boolean).filter(category => category !== 'General'))]

  useEffect(() => {
    productService.getAll().then(items => {
      console.log('Data received:', items)
      setItems(items)
    })
  }, [])

  const resetNewItemForm = () => {
    setNewName('')
    setNewCategory('')
    setNewQuantity('')
    setNewThreshold('')
    setNewExpiryDate('')
  }

  const resetEditForm = () => {
    setEditId(null)
    setEditName('')
    setEditCategory('')
    setEditQuantity('')
    setEditThreshold('')
    setEditExpiryDate('')
  }

  const getStockStatus = (item) => {
    const threshold = Number(item.threshold) || 0
    const quantity = Number(item.quantity) || 0

    if (quantity > threshold + 2) {
      return 'instock'
    }

    if (quantity <= threshold + 2 && quantity > threshold) {
      return 'lowstock'
    }

    return 'outofstock'
  }

  const filterItemsByStock = (itemsList, currentStockFilter) => {
    if (!currentStockFilter) {
      return itemsList
    }

    return itemsList.filter(item => getStockStatus(item) === currentStockFilter)
  }

  const addItem = (event) => {
    event.preventDefault()

    const trimmedName = newName.trim()
    const itemAlreadyExists = items.some(item => item.name.toLowerCase() === trimmedName.toLowerCase())

    if (itemAlreadyExists) {
      window.alert('This item already exists.')
      resetNewItemForm()
      return
    }

    const itemObject = {
      name: trimmedName,
      category: newCategory,
      quantity: Number(newQuantity),
      threshold: Number(newThreshold),
      expiryDate: newExpiryDate
    }

    productService.create(itemObject)
      .then(response => {
        setItems(items.concat(response))
        resetNewItemForm()
        setActivePanel('items')
      })
      .catch(error => {
        console.error('POST failed:', error.response?.data || error.message)
        if (error.response?.status === 409) {
          window.alert('This item already exists.')
        }
      })
  }

  const removeItem = (id) => {
    productService.remove(id).then(() => {
      setItems(items.filter(i => i.id !== id))
    })
  }

  const startEdit = (item) => {
    setEditId(item.id)
    setEditName(item.name)
    setEditCategory(item.category)
    setEditQuantity(item.quantity)
    setEditThreshold(item.threshold)
    setEditExpiryDate(item.expiryDate ? new Date(item.expiryDate).toISOString().slice(0, 10) : '')
  }

  const cancelEdit = () => {
    resetEditForm()
  }

  const updateItem = (event) => {
    event.preventDefault()

    const itemObject = {
      name: editName,
      category: editCategory,
      quantity: Number(editQuantity),
      threshold: Number(editThreshold),
      expiryDate: editExpiryDate
    }

    productService.update(editId, itemObject)
      .then(updatedItem => {
        setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item))
        cancelEdit()
        setActivePanel('items')
      })
      .catch(error => {
        console.error('PUT failed:', error.response?.data || error.message)
      })
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const itemsToShow = useMemo(() => (
    filter
      ? items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
      : items
  ), [filter, items])

  const itemsForSelectedCategory = useMemo(() => (
    selectedCategory === 'all'
      ? itemsToShow
      : itemsToShow.filter(item => item.category === selectedCategory)
  ), [itemsToShow, selectedCategory])

  const filteredItemsByStock = useMemo(() => (
    filterItemsByStock(itemsForSelectedCategory, stockFilter)
  ), [itemsForSelectedCategory, stockFilter])

  const stockCounts = useMemo(() => {
    const counts = {
      good: 0,
      low: 0,
      out: 0,
    }

    items.forEach(item => {
      const stockStatus = getStockStatus(item)

      if (stockStatus === 'instock') counts.good += 1
      if (stockStatus === 'lowstock') counts.low += 1
      if (stockStatus === 'outofstock') counts.out += 1
    })

    return counts
  }, [items])

  const categoryPercentages = useMemo(() => {
    return categories
      .map(category => {
        const categoryCount = items.filter(item => item.category === category).length
        const percent = items.length ? Math.round((categoryCount / items.length) * 100) : 0

        return {
          category,
          percent,
        }
      })
      .sort((a, b) => b.percent - a.percent)
  }, [categories, items])

  return (
    <div className="app">
      <h1>Grocery Inventory</h1>

      <ActionToolbar
        activePanel={activePanel}
        categories={categories}
        selectedCategory={selectedCategory}
        showSummary={showSummary}
        onCategoryChange={(value) => {
          setSelectedCategory(value)
          setActivePanel('items')
          setShowSummary(false)
          setFilter('')
        }}
        onTogglePanel={(panelName) => {
          setShowSummary(false)
          togglePanel(panelName)
        }}
        onToggleSummary={() => {
          setShowSummary(current => {
            const nextValue = !current

            if (nextValue) {
              setActivePanel(null)
            }

            return nextValue
          })
        }}
      />

      {showSummary && (
        <div className="summary-card">
          <div className="summary-card-header">
            <h2>Inventory Summary</h2>
          </div>

          <div className="summary-stats-grid">
            <div className="summary-stat">
              <span className="summary-label">Total Items</span>
              <strong>{items.length}</strong>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Total Categories</span>
              <strong>{categories.length}</strong>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Good Stock</span>
              <strong>{goodStockCount}</strong>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Low Stock</span>
              <strong>{lowStockCount}</strong>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Out of Stock</span>
              <strong>{outOfStockCount}</strong>
            </div>
          </div>

          <div className="category-percentage-list">
            {categoryPercentages.map(({ category, percent }) => (
              <div className="category-percentage-row" key={category}>
                <span>{category}</span>
                <span>{percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="content-area">
        {showItems && items.length > 0 && (
          <div className="stock-filter-row">
            <select
              className="dropdown"
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
            >
              <option value="">Filter/All</option>
              <option value="instock">In Stock</option>
              <option value="lowstock">Low Stock</option>
              <option value="outofstock">Out of Stock</option>
            </select>
          </div>
        )}

        {showItems && (
          <ItemGrid
            items={filteredItemsByStock}
            onEdit={(item) => {
              startEdit(item)
              setActivePanel('update')
            }}
            onDelete={(id) => {
              removeItem(id)
              setActivePanel('items')
            }}
          />
        )}

        {showForm && (
          <div>
            <AddItemForm
              newName={newName}
              newCategory={newCategory}
              newQuantity={newQuantity}
              newThreshold={newThreshold}
              newExpiryDate={newExpiryDate}
              categories={categories}
              onNameChange={(event) => setNewName(event.target.value)}
              onCategoryChange={(event) => setNewCategory(event.target.value)}
              onQuantityChange={(event) => setNewQuantity(event.target.value)}
              onThresholdChange={(event) => setNewThreshold(event.target.value)}
              onExpiryDateChange={(event) => setNewExpiryDate(event.target.value)}
              onSubmit={addItem}
            />
          </div>
        )}

        {showItemsUp && (
          <UpdateSection
            filter={filter}
            items={itemsToShow}
            categories={categories}
            editId={editId}
            editName={editName}
            editCategory={editCategory}
            editQuantity={editQuantity}
            editThreshold={editThreshold}
            editExpiryDate={editExpiryDate}
            onFilterChange={handleFilterChange}
            onStartEdit={startEdit}
            onNameChange={(event) => setEditName(event.target.value)}
            onCategoryChange={(event) => setEditCategory(event.target.value)}
            onQuantityChange={(event) => setEditQuantity(event.target.value)}
            onThresholdChange={(event) => setEditThreshold(event.target.value)}
            onExpiryDateChange={(event) => setEditExpiryDate(event.target.value)}
            onSubmit={updateItem}
            onCancel={cancelEdit}
          />
        )}
      </div>
    </div>
  )
}

export default App