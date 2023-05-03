const { User, Thought, reactionSchema } = require('../models');
const { add } = require('../models/Reaction');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();

            res.json(thoughts)
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },
    async getSingleThought(req, res) {
        try {
            console.log(req.params.id)
            const thought = await Thought.findOne({ _id: req.params.id })
            // .select('-__v')
            // .lean();

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' })
            }

            return res.json({ thought })
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            const addThought = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                {  runValidators: true, new: true }
            )

            res.json(addThought)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.id });

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' })
            }

            const thoughtName = await Thought.findOneAndUpdate(
                { _id: req.params.id },
                { thoughtText: req.body.thoughtText },
                { runValidators: true, new: true }
            );

            res.json(thoughtName)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.id });

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' })
            }

            const removeThought = await Thought.findOneAndDelete({ _id: req.params.id });

            return res.json({ message: 'Successfully removed thought' })
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async createReaction(req, res) {
        try {
            console.log(req.params.id)
            const addReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { runValidators: true, new: true }
            )

            if (!addReaction) {
                return res.status(404).json({ message: 'No thought found with that ID' })
            }

            return res.json(addReaction)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' })
            }

            const removeReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } },
                { new: true }
            );

            return res.json(removeReaction)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}