let faci;

class Facility {
	static async injectDB(conn) {
        faci = await conn.db("vms").collection("facilities")
	}

    static async createFacility(param) {
		// TODO: Check facilities
		let facilities = await faci.find({ facilities_id: facilities_id }).toArray();
        console.log(facilities)
        if (facilities.length > 0) {
            return false;
        } else {
            let output = await faci.insertOne({ 
                facilities_id: param.facilities_id, 
                name: param.name, 
                location: param.location, 
                operating_hour: param.operating_hour, 
                max_no_visitors: param.max_no_visitors, 
                manager_id: param.manager_id 
            })
            console.log(output)
            return faci.find({ facilities_id: facilities_id }).toArray()
        }
	}

	static async getFacilities(name) {
		// TODO: Find facilities
        let facilities = await faci.find({"name": {$regex: name, $options: "i"}}).toArray();
        console.log(facilities)
        if( facilities.length == 0){
            return false;
        } else {
            return facilities;
        }
	}

    static async updateFacility(facilities_id, name, location, operating_hour, max_no_visitors, manager_id) {
        // TODO: Check facilities
        let facilities = await faci.find({ facilities_id: facilities_id }).toArray();
        if (facilities.length == 0) {
            return false;
        }
        else {
            let output = await faci.updateOne({ facilities_id: facilities_id }, { $set: { name: name, location: location, operating_hour: operating_hour, max_no_visitors: max_no_visitors, manager_id: manager_id } })
            return faci.find({ facilities_id: facilities_id }).toArray()
        }
    }

    static async deleteFacility(facilities_id) {
        let facilities = await faci.find({ facilities_id: facilities_id }).toArray();
        if (facilities.length == 0) {
            return false;
        }
        else {
            let output = await faci.deleteOne({ facilities_id: facilities_id })
            console.log[output, "deleted"]
            return true;
        }
    }
}

module.exports = Facility;