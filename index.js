const express = require('express')
const https = require('https')
const http = require('http')
const app = express()
const PORT = 3000

const services = [
  { name: 'Forum', url: 'https://forumm.dmenu.me/' },
  { name: 'Main Website', url: 'https://www.dmenu.me/' },
  { name: 'GM Players', url: 'https://gms.dmenu.me/' },
  { name: 'Paid Cheat DataBase', url: 'https://dba.dmenu.me/' }
]

app.use(express.static(__dirname + '/public'))

app.get('/status', async (req, res) => {
  const checks = await Promise.all(services.map(async s => {
    const isHttps = s.url.startsWith('https://')
    const client = isHttps ? https : http

    return new Promise(resolve => {
      const req = client.get(s.url, r => {
        resolve({ name: s.name, online: r.statusCode === 200 })
      }).on('error', () => resolve({ name: s.name, online: false }))

      req.setTimeout(5000, () => {
        req.abort()
        resolve({ name: s.name, online: false })
      })
    })
  }))

  res.json(checks)
})

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))