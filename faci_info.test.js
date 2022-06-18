const MongoClient = require("mongodb").MongoClient;
const Facilities = require("./faci_info");

describe("Facilitiy_Info_Test", () => {
    let client;
    beforeAll(async () => {
        client = await MongoClient.connect(
            "mongodb+srv://Group13:p%4055w0rd@cluster0.ft7ws.mongodb.net/vms?retryWrites=true&w=majority",
            { useNewUrlParser: true },
        );
        Facilities.injectDB(client);
    })

    afterAll(async () => {
        await client.close();
    })
    
    //Test if new facility is created in the database
    test("Create new facility", async () => {
        const res = await Facilities.create_facility_info("004","Gym2","3rd Floor","10:00 to 20:00",50,"6281f89e3de33fd8283f7228")
        console.log(res)
        expect(res[0].facilities_id).toBe("004")
        })
    //Test if a facility is in the database
    test("Get facility", async () => {
        const res = await Facilities.getFacilities("gym")
        expect(res[0].name).toBe("Gym")
        })
    //Test if a facility is updated in the database
    test("Update facility", async () => {
        const res = await Facilities.update_facility_info("004","Gym4","4rd Floor","10:00 to 20:00",30,"6281f89e3de33fd8283f7228")
        expect(res[0].name).toBe("Gym4")
        })
        
});