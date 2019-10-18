const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb')
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'scoreboard'
const client = new MongoClient(url, { useUnifiedTopology: true })
var db

client.connect(function (err) {
  assert.equal(null, err)
  console.log("Connected successfully to server")

  db = client.db(dbName)

  //client.close();
})

const find = async function (collectionName, filter) {
  const collection = db.collection(collectionName)
  return await collection.find(filter).toArray()
}

async function getNextSequence(name) {
  const collection = db.collection("counters")
  const result = await collection.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true }
  )
  
  return result.value ? result.value.seq : 0
}

const insert = async function (collectionName, data) {
  const collection = db.collection(collectionName)
  const id = await getNextSequence("players")
  return await collection.insertOne({ id, ...data })
}

const update = async function (collectionName, id, data) {
  const collection = db.collection(collectionName)
  return await collection.updateOne({ id }, data, { upsert: true })
}

const remove = async function (collectionName, id) {
  const collection = db.collection(collectionName)
  return await collection.deleteOne({ id })
}

async function getPlayers() {
  return find("players")
}

function getScoreboard() {
  return find("scoreboard")
}

function addPlayer(player) {
  return insert("players", player)
}

function updatePlayer(id, player) {
  delete player._id
  return update("players", id, { $set: player })
}

async function removePlayer(id) {
  await remove("players", id)
  await remove("scoreboard", id)
}

function addScore(id, score) {
  return update("scoreboard", id, { $inc: { score } })
}

module.exports = { db, getPlayers, getScoreboard, addPlayer, updatePlayer, removePlayer, addScore }
