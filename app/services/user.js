class UserService {
    constructor(User){
        this.User        = User;
        this.register    = this.register.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.findById    = this.findById.bind(this);
    }
    async register(newUser, password){
        return await this.User.register(new this.User(newUser), password);
    }
    async getAllUsers(){
        return await this.User.find({});
    }
    async findById(id){
        return await this.User.findById(id);
    }
    async findByIdAndUpdate(id, newData){
        return await this.User.findByIdAndUpdate(id, newData);
    }
    async findByUsername(name){
        return await this.User.findOne({username: name});
    }
}
module.exports = UserService;