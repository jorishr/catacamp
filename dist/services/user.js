class UserService{constructor(s){this.User=s,this.register=this.register.bind(this),this.getAllUsers=this.getAllUsers.bind(this),this.findById=this.findById.bind(this)}async register(s,e){return await this.User.register(new this.User(s),e)}async getAllUsers(){return await this.User.find({})}async findById(s){return await this.User.findById(s)}async findByIdAndUpdate(s,e){return await this.User.findByIdAndUpdate(s,e)}}module.exports=UserService;