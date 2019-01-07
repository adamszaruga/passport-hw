
class Database {
    constructor() {
        this.users = [];
    }

    async getUsers() {
        return users;
    }    

    async createUser(email, password) {
        let newUser = {
            id: Database.nextId++,
            email,
            password
        }
        this.users = this.users.concat(newUser);
        return newUser;
    }

    async findUserByEmail(emailCheck) {
        let user = this.users.find(({ email }) => email === emailCheck);
        return user;
    }

    async findUserById(idCheck) {
        let user = this.users.find(({ id }) => id === idCheck);
        return user;
    }
}

Database.nextId = 0;

module.exports = Database;
