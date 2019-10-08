const User = require('../models/User');
const paginate = require('../extra/paginate');
const { ResourceNotFoundError, InternalError } = require('../extra/errorHandler');

module.exports = {
    index(){
        //query options
        let options = {
            select: 'name username photo email',
            sort: { username: 1 },
        };

        return paginate(User, {}, {}, options);
    },

    create(data){
        if (data.name) {
            data.name = {
                firstname: data.name.firstname,
                lastname: data.name.lastname
            };
        }
    
        let user = new User(data);
    
        return user.save();
    },

    find(id){
        return User.findById(id).exec();
    },

    async update(id, data){
        let options = { new: true, runValidators: true, context: 'query' };

        User.findByIdAndUpdate(id, {$set: data}, options, (err, user) => {
            if (err) throw new InternalError(err);

            if (!user) throw new ResourceNotFoundError('User',id);
            
            return user;
        });
    },

    async delete(id){
        let user = await User.findById(id);
        
        if (!user) throw new ResourceNotFoundError('User',id);

        return user.delete();
    },

};