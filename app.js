"use strict"
import express from 'express'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 3000

// Middleware 
app.use(express.json())
app.use(express.static('./public'))

let itemsCatalog = [];
let nextItemId   = 1;

// POST /api/items 
app.post('/api/items', (req, res) => {
    const { name, type, effect } = req.body
    if (!name || !type || !effect) {
      return res.status(400).json({ message: "Faltan name, type o effect" })
    }
    if (itemsCatalog.some(item => item.name === name)) {
      return res.status(409).json({ message: "Ese item ya existe" })
    }
    const newItem = { id: nextItemId++, name, type, effect }
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
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
