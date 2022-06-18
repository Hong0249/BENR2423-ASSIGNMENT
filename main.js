const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Visitor = require("./visitor");
const Facility = require("./faci_info");

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
	Visitor.injectDB(client);
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
			version: '1.1.0',
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
 *   schemas:
 *     User:
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *     Visitor:
 *       properties:
 *         name:
 *           type: string
 *         ic_no:
 *           type: string
 *         hp:
 *           type: string
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
				username: user[0].username,
				role: user[0].role
			}),
			role: user[0].role
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
 *       security: 
 *       - bearerAuth: []
 *     description: User Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *               role: 
 *                 type: string
 *                 enum: [admin, user]
 *                 required: true
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
	if(req.body.role == "admin") {
		const user = await User.register(req.body.username, req.body.password, req.body.role);
		if (user != null) {
			console.log("Register successful");
			res.status(200).send("User registered");
		} else {
			console.log("Register failed")
			res.status(404).json("Username already exists");
		}
	}
})

app.post('/createFacility', async (req, res) => {
	console.log(req.body);
	const facility = await Facility.createFacility(req.body);
	if (facility != null) {
		console.log("Facility created");
		res.status(200).send("Facility created");
	} else {
		console.log("Facility creation failed")
		res.status(404).json("Facility already exists");
	}
})

app.get('/facilities/:name', async (req, res) => {
	console.log(req.params);
	const facilities = await Facility.getFacilities(req.params.name);
	if (facilities != null) {
		console.log("Get Facilities Successful!");
		res.status(200).json(facilities);
	} else {
		console.log("Get Facilities failed")
		res.status(404).send("No Facilities found");
	}
})

app.patch('/updateFacility/:id', async (req, res) => {
	console.log(req.body);
	const facility = await Facility.updateFacility(req.body.facility_id, req.body.facility_name, req.body.location, req.body.operating_hour, req.body.max_no_visitors, req.body.manager_id);
	if (facility != null) {
		console.log("Update Facility Successful!");
		res.status(200).json(facility);
	} else {
		console.log("Update Facility failed")
		res.status(404).send("Facility not found");
	}
})

app.delete('/deleteFacility', async (req, res) => {
	const facility = await Facility.deleteFacility(req.body.facility_id);
	if (facility != null) {
		console.log("Delete Facility Successful!");
		res.status(200).send("Facility deleted");
	} else {
		console.log("Delete Facility failed")
		res.status(404).send("Facility not found");
	}
})

app.post('/createVisitor', async (req, res) => {
	console.log(req.body);
	const visitor = await Visitor.create_visitor(req.body.name, req.body.ic_no, req.body.hp);
	if (visitor != false) {
		console.log("Visitor created");
		res.status(200).send("Visitor created");
	} else {
		console.log("Visitor creation failed")
		res.status(404).json("Visitor already exists");
	}
})

app.post('/BookingandReservation', async (req, res) => {
	console.log(req.body);
	const booking = await Visitor.BookingandReservation(req.body.facility_id, req.body.visitor_id, req.body.time_slot);
	if (booking != false) {
		console.log("Booking and Reservation Successful!");
		res.status(200).json(booking);
	} else {
		console.log("Booking and Reservation failed")
		res.status(404).send("Booking and Reservation failed");
	}
})

app.get('/queryBooking/:id', async (req, res) => {
	console.log(req.params);
	const booking = await Visitor.queryBooking(req.params.visitor_id);
	if (booking != null) {
		console.log("Booking found!");
		res.status(200).json(booking);
	} else {
		console.log("Booking not found")
		res.status(404).send("Booking not found");
	}
})






// Middleware Express for JWT
app.use(verifyToken);

/**
 * @swagger
 * /visitor/{id}:
 *   get:
 *     security: 
 *       - bearerAuth: []
 *     description: Get visitor by id
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: visitor id
 *     responses:
 *       200:
 *         description: Visitor found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Query not found
 */

app.get('/visitor/:id', async (req, res) => {
	console.log(req.user);
	console.log(req.params);

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


/**
 * @swagger
 * /update_info:
 *   patch:
 *     security: 
 *       - bearerAuth: []
 *     description: Update facilities info
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: name of the facility
 *       - in: body
 *       
 *     responses:
 *       200:
 *         description: Visitor found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Query not found
 */



// app.get('/admin/only', async (req, res) => {
// 	console.log(req.user);

// 	if (req.user.role == 'admin')
// 		res.status(200).send('Admin only')
// 	else
// 		res.status(403).send('Unauthorized')
// })

// app.listen(port, () => {
// 	console.log(`FMS REST API listening on port ${port}`)
// })


const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '1h' });
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