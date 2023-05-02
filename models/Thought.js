const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
    {
        thoughText: {
            type: String,
            required: true,
            min: 1,
            max: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    }
)

userSchema.virtual('reactionCount').get(function() {
    return this.reactions.length
})


const Thought = model('Thought', thoughtSchema)

module.exports = Thought;