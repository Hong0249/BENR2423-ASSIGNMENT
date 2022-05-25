const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

MongoClient.connect(
	// TODO: Connection 
	"my-mongodb+srv-connection-stringmy-mongodb+srv-connection-string",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})

const express = require('express')
const app = express()
const port = 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'FVMS API',
			version: '1.0.0',
		},
	},
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('Welcome To FVMS API')
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 *         password: 
 *           type: string
 */

/**
 * @swagger
 * /login:
 *   post:
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: User Login Successful!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */
app.post('/login', async (req, res) => {
	console.log(req.body);

	const user = await User.login(req.body.username, req.body.password);
	if (user != null) {
		console.log("User Login Successful!");
		res.status(200).json({
			_id: user[0]._id,	
			username: user[0].username,
		})
	} else {
		console.log("Login failed")
		res.status(401).json({
			error: "Invalid username or password"
		})
	}
})

app.post('/register', async (req, res) => {
	console.log(req.body);

	const user = await User.register(req.body.username, req.body.password);
	if (user != null) {
		console.log("Register successful");
		res.status(200).json({
			message: "User registered"
		})
	} else {
		console.log("Register failed")
		res.status(404).json({
			error: "Username already exists"
		})
	}

})

/**
 * @swagger
 * /visitor/{id}:
 *   get:
 *     description: Get visitor by id
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: visitor id
 */
 app.get('/visitor/:id', async (req, res) => {
	console.log(req.params.id);
	//Still Working on this

	res.status(200).json({})
})

app.listen(port, () => {
	console.log(`VMS REST API listening on port ${port}`)
})
