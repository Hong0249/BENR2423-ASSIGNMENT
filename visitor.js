let visitors;

class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("vms").collection("visitor")
	}

    static async create_visitor(name, ic_no, hp) {
		// TODO: Visitor already exists
        let document = await visitors.find({ic_no: ic_no}).toArray();

        if( document.length > 0){
            return false
        } else {
        // TODO: Save new visitor to database
            await visitors.insertOne({
                name: name,
                ic_no: ic_no,
                hp: hp,
            })
            return visitors.find({ic_no: ic_no}).toArray()
        }
	}

    static async getVisitor(ic_no) {
        let visitor = await visitors.find({ic_no: ic_no}).toArray();
        console.log(visitor);
		if(visitor.length > 0){
            return visitor;
        } else {
            return null;
        }
	}
 }

module.exports = Visitor;