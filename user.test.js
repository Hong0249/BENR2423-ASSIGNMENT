const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

describe("User Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"my-mongodb+srv-connection-string",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("Register the visitor account", async () => {
		const res = await User.register("name", "age", "gender", "room_number", "contact_number", "mysj_status", "email", "password")
		expect(res).toBeTruthy()
	})

	test("Doing the booking and reservation", async () => {
		const res = await User.BookingandReservation("name", "email", "password", "time_slot", "number_of_visitors")
		expect(res).toBeTruthy()
	})

    test("Doing the facilities info", async () => {
		const res = await User.BookingandReservation("facilities_manager_name", "location", "max_num_of_visitor", "facilities_manager_contact_number", "email", "password")
		expect(res).toBeTruthy()
	})

    test("User login invalid name, email", async () => {
		const res = await User.login("name", "email")
		expect(res).toBeFalsy()
        try{
            await User.login()
        } catch(e){
            expext(e).toMatch("invalid name and email")
        }
	})

	test("User login invalid password", async () => {
		const res = await User.login("password")
		expect(res).toBeFalsy()
        try{
            await User.login()
        } catch(e){
            expext(e).toMatch("invalid password")
        }
	})

	test("User login successfully", async () => {
		const res = await User.login("name", "email", "password")
		expect(res).toBe(true)
	})
});