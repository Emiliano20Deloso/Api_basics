"use strict"
import express from 'express'
import fs from 'fs'

const app = express()
const PORT = 3000

//Midllewares 
app.use(express.json())
app.use(express.static('./public'))

let itemsCatalog = []
let nextId = 1

// POST /api/items →
app.post('/api/items', (req, res) => {
  const { name, type, effect } = req.body
  if (!name || !type || !effect) {
    return res.status(400).json({ message: "Faltan name, type o effect" })
  }
  if (itemsCatalog.some(item => item.name === name)) {
    return res.status(409).json({ message: "Ese item ya existe" })
  }
  const newItem = { id: nextId++, name, type, effect }
  itemsCatalog.push(newItem)
  res.status(201).json(newItem)
})

// GET /api/items 
app.get('/api/items', (req, res) => {
  if (itemsCatalog.length === 0) {
    return res.status(404).json({ message: "No items found" })
  }
  res.json(itemsCatalog)
})

// GET /api/items/:id 
app.get('/api/items/:id', (req, res) => {
  const itemId = +req.params.id
  const item = itemsCatalog.find(i => i.id === itemId)
  if (!item) {
    return res.status(404).json({ message: "Item not found" })
  }
  res.json(item)
})

// DELETE /api/items/:id
app.delete('/api/items/:id', (req, res) => {
  const itemId = +req.params.id
  const index = itemsCatalog.findIndex(i => i.id === itemId)
  if (index === -1) {
    return res.status(404).json({ message: "Item not found" })
  }
  itemsCatalog.splice(index, 1)
  res.json({ message: "Item deleted successfully" })
})

// PUT /api/items/:id 
app.put('/api/items/:id', (req, res) => {
  const itemId = +req.params.id
  const { name, type, effect } = req.body
  const item = itemsCatalog.find(i => i.id === itemId)
  if (!item) {
    return res.status(404).json({ message: "Item not found" })
  }
  if (name)   item.name   = name
  if (type)   item.type   = type
  if (effect) item.effect = effect
  res.json(item)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})