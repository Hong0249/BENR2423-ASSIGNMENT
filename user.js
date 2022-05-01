let users;

class User {
	static async injectDB(conn) {
		users = await conn.db("my-database-name").collection("users")
	}

	static async register(username, password) {
		// TODO: Check if username exists

		// TODO: Hash password

		// TODO: Save user to database
	}

	static async login(username, password) {
		// TODO: Check if username exists

		// TODO: Validate password

		// TODO: Return user object
		return;
	}
}

module.exports = User;