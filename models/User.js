const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                'Please enter a valid email address',
            ]
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
)

// friendCount virtual
userSchema.virtual('friendCount').get(function() {
    return this.friends.length
})

// userSchema.pre('findOneAndDelete', async () => {
//     const parent = await this.findOne()
//     await mongoose.model('thoughts').deleteMany({ _id: { $in: parent.thoughts } })
//     next();
// })

const User = model('User', userSchema)

module.exports = User;