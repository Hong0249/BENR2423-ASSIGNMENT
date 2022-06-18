const bcrypt = require("bcrypt");
let users;

class User {
	static async injectDB(conn) {
		users = await conn.db("vms").collection("users")
	}

	static async register(username, password, role) {
		// TODO: Check if username exists
		let usersearch = await users.find({ username: username }).toArray()
			if (usersearch.length > 0) {
				//const message = "User already exists with this credentials. Please login"
				return
			} else {
				// TODO: Hash password
				let passwordHash = await bcrypt.hash(password, 15);
				password = passwordHash;

				// TODO: Save user to database
				await users.insertOne({ username: username, password: password, role: role });
			}
		return users.find({ username: username }).toArray();
	};

	static async login(username, password) {
		// TODO: Check if username exists
		let usersearch = await users.find({ username: username }).toArray();
			if (usersearch.length == 0) {
				return null
			}

		// TODO: Validate password
		let key = await bcrypt.compare(password, usersearch[0].password);

		// TODO: Return user object
		if (key) {
			return usersearch
		} else {
			return null
		}
	}

}

module.exports = User;