const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

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
    
    afterEach(async () => {
        await client.db("vms").collection("visitor").deleteOne({ ic_no: "981106-02-6890" });
    });

    //Test if the new user has registered successfully
    test("Register the user account", async () => {
        const res = await User.Register("Alice", "981106-02-6890", "alice@gmail.com", "012-5568924", "Low Risk")
        console.log(res[0], res[1]);
        expect(res[0].ic_no).toBe("981106-02-6890")
    })


    test("Doing the booking and reservation", async () => {
    	const res = await User.BookingandReservation("001", "122", "0930")
    	expect(res.length).toBe(1)
    })


    test("Query for booking request made", async () => {
     const res = await User.Booking_query("123")
     expect(res).not.toBeNull()
    })
});