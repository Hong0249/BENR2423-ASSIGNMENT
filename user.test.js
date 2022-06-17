const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

describe("User Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://Group13:p%4055w0rd@cluster0.ft7ws.mongodb.net/vms?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("New user registration", async () => {
		const res = await User.register("UTeM", "p@ssw0rd")
		expect(res[0].username).toBe("UTeM")
	})

	test("Duplicate username", async () => {
		const res = await User.register("UTeM", "p@ssw0rd")
		expect(res.length).toBe(1)
	})

	test("User login invalid username", async () => {
		const res = await User.login("UUTEM", "p@ssw0rd")
		expect(res.usersearch).toBe(false)
	})

	test("User login invalid password", async () => {
		const res = await User.login("UTeM", "p@ssw0rdf")
		expect(res.key).toBe(false)
	})

	test("User login successfully", async () => {
		const res = await User.login("UTeM", "p@ssw0rd")
		expect(res[1]).toBe(true)
	})
});