const express = require('express')
const App = express()

const fileupload = require('express-fileupload')
const { recognize } = require('tesseract.js')

// Accept json data (f test) and media form data
App.use(express.json())
App.use(fileupload())

// Load view engine and set a static path to assets
App.set('view engine', 'hbs')
App.set('views', `${__dirname}/views`)
App.use(express.static(`${__dirname}/public`))

// Routes
App.get('/', (req, res) => res.render('index'))

// Post route to catch image and show recognize result
App.post('/upload', (req, res) => {
  const { image } = req.files

  // Title of Tesseract recognize log
  console.log('\x1b[1m\x1b[35m', `Upload of ${image.name}`, '\x1b[0m')

  // Recognizing image-buffer

  // Check all language codes (used on second param of recognize) of Tesseract in:
  // https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016
  recognize(image.data, 'por', { logger: d => console.log(`[${d.status}] ${Math.floor(d.progress * 100)}%`) })
    .then(({ data: { text } }) => res.render('result', { text }))
})

App.listen(5000, console.log('Application running on port 5000'))
