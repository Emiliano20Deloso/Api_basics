"use strict"
import express from 'express'
import fs from 'fs'

const app = express()
const PORT = 3000

// Middleware 
app.use(express.json())
app.use(express.static('./public'))

let itemsCatalog = []
let nextId = 1

// 2º POST /api/items 
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

// 3º GET /api/items 
app.get('/api/items', (req, res) => {
  if (itemsCatalog.length === 0) {
    return res.status(404).json({ message: "No items found" })
  }
  res.json(itemsCatalog)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
