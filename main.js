const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Visitor = require("./visitor");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://Group13:p%4055w0rd@cluster0.ft7ws.mongodb.net/vms?retryWrites=true&w=majority",
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
const port =  process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Facilities MS API',
			version: '1.0.0',
		},
		securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header',
			},
		}
	},
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('Welcome To Facilities MS API')
})

/**
 * @swagger
 * components:
 * 	securitySchemes:
 * 		BearerAuth:
 * 			type: http
 * 			scheme: bearer
 *  
 * 	schemas:
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
 *         description: Login Successful!
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
		console.log("Login Successful!");
		res.status(200).json({
			_id: user[0]._id,	
			username: user[0].username,
			token: generateAccessToken({
				_id: user[0]._id,
				username: user[0].username
			})
		})
	} else {
		console.log("Login failed")
		res.status(401).send("Invalid username or password");
		return
	}
})

/**
 * @swagger
 * /register:
 *   post:
 *     description: User Register
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
 *         description: Register successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Register failed
 */

app.post('/register', async (req, res) => {
	console.log(req.body);

	const user = await User.register(req.body.username, req.body.password);
	if (user != null) {
		console.log("Register successful");
		res.status(200).send("User registered");
	} else {
		console.log("Register failed")
		res.status(404).json("Username already exists");
	}

})

// Middleware Express for JWT
app.use(verifyToken);

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

	if(req.user.role == 'user') {
		let visitor = await Visitor.getVisitor(req.params.id);

		if (visitor)
			res.status(200).json(visitor)
		else
			res.status(404).send("Invalid Visitor Id");
	} else {
		res.status(403).send('Unauthorized')
	}
})

app.get('/admin/only', async (req, res) => {
	console.log(req.user);

	if (req.user.role == 'admin')
		res.status(200).send('Admin only')
	else
		res.status(403).send('Unauthorized')
})

app.listen(port, () => {
	console.log(`FMS REST API listening on port ${port}`)
})

//JWT
/**
 * @swagger
 * /api/users/test:
 *  post:
 *      security: 
 *          - Bearer: []
 *      summary: test authorization
 *      tags: [User]
 *      description: use to test authorization JWT
 *      responses:
 *          '200':  
 *              description: success
 *          '500':
 *                  description: Internal server error
 */


const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '60s' });
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, "my-super-secret", (err, user) => {
		console.log(err)

		if (err) return res.sendStatus(403)

		req.user = user

		next()
	})
}