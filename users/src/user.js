const mongoose = require('mongoose');
const PostSchema = require('./postSchema');
const Schema = mongoose.Schema;


//Properties of the UserSchema object
const UserSchema = new Schema({
	name: {
		type: String,
		validate: {
			validator: (name) => name.length > 2 ,
			message: 'Name must be longer than 2 characters.'
		},
		required: [true, 'Name is required.']
	},
	posts: [PostSchema],
	likes: Number,
	blogPosts: [{
		type: Schema.Types.ObjectId, 
        ref: 'blogPost'
	}]
});

UserSchema.virtual('postCount').get(function() {
	return this.posts.length;
});

UserSchema.pre('remove', function(next) {
	const BlogPost = mongoose.model('blogPost');
	//this === joe
	BlogPost.remove({ _id: { $in: this.blogPosts } })
	.then(() => next());
})

//User = Collection name
//represents the entire collection of users data
const User = mongoose.model('user', UserSchema);
module.exports = User;

/*
NOTES:
Virtual Type/field/property: refers to any property that 
doesnt get persisted to the mongoDB database
 */