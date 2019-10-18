const router = require('express').Router()
const {
  getPlayers,
  getScoreboard,
  addPlayer,
  updatePlayer,
  removePlayer,
  addScore
} = require('./mongo')

const started = new Date()

router.get('/', (req, res) => res.send({ started, uptime: (new Date() - started) / (1000 * 60) }))

router.get('/players', async (req, res) => {
  res.send(await getPlayers())
})

router.get('/scoreboard', async (req, res) => {
  res.send(await getScoreboard())
})

router.post('/player', async (req, res) => {
  let player = req.body
  const result = await addPlayer(player)
  res.json(result.ops[0])
})

router.put('/player/:id', async (req, res) => {
  const id = +req.params.id
  let player = req.body
  await updatePlayer(id, player)
  res.json(player)
})

router.delete('/player/:id', async (req, res) => {
  const id = +req.params.id
  await removePlayer(id)
  res.sendStatus(200)
})

router.post('/score/:id', (req, res) => {
  const id = +req.params.id
  const score = +req.body.score
  addScore(id, score)
  res.sendStatus(200)
})

module.exports = router