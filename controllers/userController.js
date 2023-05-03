const { User, Thought } = require('../models');

const getNumberFriends = async () => {
    const numberOfFriends = await User.aggregate().count('friendCount')
    return numberOfFriends;
}

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();

            const usersObj = {
                users,
                friends: await getNumberFriends(),
            }
            return res.json(usersObj)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try {
            console.log(req.params.id)
            const user = await User.findOne({ _id: req.params.id })
            // .select('-__v')
            // .lean();

            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID' })
            }

            return res.json({ user })
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async updateUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id });

            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID' })
            }

            const name = await User.findOneAndUpdate(
                { _id: req.params.id },
                { username: req.body.username },
                { new: true }
            );

            res.json(name)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async deleteUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id });

            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID' })
            }

            const removeUser = await User.findOneAndDelete({ _id: req.params.id });

            return res.json({ message: 'Successfully removed user' })
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async addFriend(req, res) {
        try {
            const userId = await User.findOne({ _id: req.params.userId })
            const friendId = await User.findOne({ _id: req.params.friendId });

            if (!userId || !friendId) {
                return res.status(404).json({ message: 'No user or friend found with that ID' })
            }

            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { friends: req.params.friendId } },
                { new: true }
            );

            return res.json(user)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )

            return res.json(user)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}