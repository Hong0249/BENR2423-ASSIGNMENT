let users;

class User {
	static async injectDB(conn) {
		users = await conn.db("my-database-name").collection("users")
	}

	static async Register(name, age, gender, room_number, contact_number, mysj_status, email, password) {
		// TODO: Register name, age, gender, room_number, contact_number, mysj_status, email exists

		// TODO: Hash password

		// TODO: Save BookingandReservation to database
	}

	static async BookingandReservation(name, email, password, time_slot, number_of_visitors) {
		// TODO: Check if name, email, time_slot, number_of_viitors exists

		// TODO: Hash password

		// TODO: Save BookingandReservation to database
        return
	}

	static async Facilities_info(facilities_manager_name, location, max_num_of_visitor, facilities_manager_contact_number, email, password) {
		// TODO: Check if facilitiesmanagername, location, max_num_of_visitor, facilities_manager_contact_number, email exists

		// TODO: Validate password

		// TODO: Save Facilities_info to database
        return
	}
}

module.exports = User;