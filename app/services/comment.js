class CommentService {
    constructor(Comment){
        this.Comment = Comment;
        this.getAll  = this.getAll.bind(this); 
        this.create  = this.create.bind(this); 
        this.findById  = this.findById.bind(this); 
        this.findByIdAndUpdate  = this.findByIdAndUpdate.bind(this); 
    }
    async create(newComment){
        return await this.Comment.create(newComment);
    }
    async getAll(){
        return await this.Comment.find({});
    }
    async findById(id){
        return await this.Comment.findById(id);
    }
    async findByIdAndUpdate(id, newData){
        return await this.Comment.findByIdAndUpdate(id, newData);
    }   
    async findByIdAndRemove(id){
        return await this.Comment.findByIdAndRemove(id);
    }   
}
module.exports = CommentService;