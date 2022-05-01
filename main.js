const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

MongoClient.connect(
	// TODO: Connection 
	"my-mongodb+srv-connection-string",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})
