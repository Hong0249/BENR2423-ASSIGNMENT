let visitors;

class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("vms").collection("visitor")
        visitors[1] = await conn.db("vms").collection("booking_request")
        visitors[2] = await conn.db("vms").collection("facilities")
	}

	static async Register(name, ic_no, email, hp, mysj_status) {
		// TODO: Check name, email exists
        const document = await visitors.find(
            {ic_no: ic_no}).toArray();

        if( document.length > 0){
            return [false, "User already exists"]
        } else {
        // TODO: Save new user to database
            await visitors.insertOne({
                name: name,
                ic_no: ic_no,
                email: email,
                hp: hp,
                mysj_status: mysj_status
            })
            return visitors.find({ic_no: ic_no}).toArray()
        }
	}


	static async BookingandReservation(facilities_id, visitor_id, time_slot) {
        let i,ii;
		// TODO: Check if current booking is full
        let result = await visitors[1].find(
            {facilities_id: facilities_id, time_slot: time_slot}).toArray();

        let facilities = await visitors[2].find(
            {facilities_id: facilities_id}).toArray();

            console.log(result.length, facilities[0].max_no_visitors);
        if(result.length <= facilities[0].max_no_visitors){
            i = true;
            console.log("Booking is available");
        } else {
            i =  false;
            console.log("Booking is full");
        }

        // TODO: Check if duplicate booking
        let result2 = await visitors[1].find(
            {facilities_id: facilities_id, time_slot: time_slot, visitor_id: visitor_id}).toArray();
        if(result2.length == 0){
            ii =  true;
            console.log("You may book this facility");
        } else {
            ii =  false;
            console.log("You have already booked this facility");
        }

		// TODO: Save booking request to database
        if(i && ii){
            await visitors[1].insertOne({
                facilities_id: facilities_id,
                visitor_id: visitor_id,
                time_slot: time_slot
            })
        } else {
            return false
        };

        return visitors[1].find({
            facilities_id: facilities_id,
            visitor_id: visitor_id,
            time_slot: time_slot
        }).toArray()
	}

    static async Booking_query(visitor_id) {
    	// TODO: Query booking request
        let result = await visitors[1].find(
            {visitor_id: visitor_id}).toArray();
        if(result.length > 0){
            return result;
        } else {
            return null;
        }
    }
 }

module.exports = Visitor;