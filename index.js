const app = require('express')();
const port = 8000;
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('C:/Users/opilane/source/repos/artur/Project/games-api-Artur/docs/swagger.json')
app.get('/games', (req, res)=>{res.send(["Viperr,Cyberpunk"])
})
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`);
});
