const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);


const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const toJSONPlugin = require('./plugins/toJSON')


const app = express()
app.use(cors())
app.use(express.json())

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const itemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'General'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0
    },
    threshold: {
      type: Number,
      default: 1
    },
    expiryDate: {
      type: Date
    }
})

itemSchema.plugin(toJSONPlugin)


const Item = mongoose.model('Item', itemSchema)

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const findDuplicateItem = async (name, excludeId = null) => {
  const normalizedName = name.trim()
  const query = {
    name: {
      $regex: `^${escapeRegex(normalizedName)}$`,
      $options: 'i'
    }
  }

  if (excludeId) {
    query._id = { $ne: excludeId }
  }

  return Item.findOne(query)
}

app.get('/items', (req, res) => {
  Item.find({}).then(items => {
    res.json(items)
  })
}) 

app.post('/items', async (req, res) => {
  const body = req.body
  const itemName = body.name?.trim()

  if (!itemName) {
    return res.status(400).json({ error: 'Name is required' })
  }

  const duplicateItem = await findDuplicateItem(itemName)

  if (duplicateItem) {
    return res.status(409).json({ error: 'Item already exists' })
  }

  const item = new Item ({
    name: itemName,
    category: body.category,
    quantity: body.quantity,
    threshold: body.threshold,
    expiryDate: body.expiryDate
  })

  item.save().then(savedItem => {
    res.json(savedItem)
  })
})

app.put('/items/:id', async (req, res) => {
  const body = req.body
  const itemName = body.name?.trim()

  if (!itemName) {
    return res.status(400).json({ error: 'Name is required' })
  }

  const duplicateItem = await findDuplicateItem(itemName, req.params.id)

  if (duplicateItem) {
    return res.status(409).json({ error: 'Item already exists' })
  }

  Item.findByIdAndUpdate(
    req.params.id,
    {
      name: itemName,
      category: body.category,
      quantity: body.quantity,
      threshold: body.threshold,
      expiryDate: body.expiryDate
    },
    { new: true, runValidators: true }
  )
    .then(updatedItem => {
      if (updatedItem) {
        res.json(updatedItem)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      res.status(400).json({ error: error.message })
    })
})

app.delete('/items/:id', (req, res) => {
  Item.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})