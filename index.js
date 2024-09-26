const express = require('express')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');
const cors = require('cors')


app.use(express.json())
app.use(cors())

const games = [
    { id: 1, name: "Viperr", price: 3500 },
    { id: 2, name: "Cyberpunk", price: 3500 },
    { id: 3, name: "Witcher 3", price: 3500 },
    { id: 4, name: "Minecraft", price: 3500 },
    { id: 5, name: "CS2", price: 3500 },
    { id: 6, name: "Roblox", price: 3500 },
    { id: 7, name: "Grand Theft Auto 2", price: 3500 },
    { id: 8, name: "Valorant", price: 3500 },
    { id: 9, name: "Dota 2", price: 3500 },
    { id: 10, name: "Forza Horizon 5", price: 3500 }
];

app.get('/games', (req,res) =>{
    res.send(games)
})

app.get('/games/:id', (req,res) => {
    if (typeof games[req.params.id -1] === 'undefined'){
        return res.status(404).send({error: "Game not found"})
    }
    res.send(games[req.params.id -1])
})

app.post('/games', (req,res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({error: 'One or all params are missing'})
    }
    let game ={
        id: games.length +1,
        price: req.body.price,
        name: req.body.name
    }

    games.push(game)

    res.status(201)
        .location(`${getBaseUrl(req)}/games/${games.length}`)
        .send(game)
})

app.delete('/games/:id', (req,res) => {
    if (typeof games[req.params.id -1] === 'undefined'){
        return res.status(404).send({error: "Game not found"})
    }

    games.splice(req.params.id -1, 1)

    res.status(204).send({error: "No content"})
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}/games`)
})

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + `://${req.headers.host}`
}