const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { AuthenticationError} = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id})
                    .select ('-__v -password')
                    .populate('books');
            return userData;
            }
            throw new AuthenticationError('Please login');
        }
    },
    Mutation: {
        login: async(parent,{email, password}) => {
            try {
            const user = await User.findOne({email});
            if (!user) {
                throw new AuthenticationError('Incorrect email or password');
            }
            const isPasswordCorrect = await User.isCorrectPassword(password);
            if (!isPasswordCorrect) {
                throw new AuthenticationError('Incorrect email or password');
            }
            const token = signToken(user);
            return {token, user};
        } catch (err) {
            throw new AuthenticationError('Failed to authenticate');
        }
    },
    addUser: async(parent,{username, email, password}) => {
        try {
            const newUser = await User.create({username, email, password});
            const token = signToken(newUser);
            return {token, newUser};
        } catch (err) {
            throw new Error ('Failed to add user');
        }
    },
    saveBook: async(parent, {input}, context) => {
        try {
            if (context.user) {
                const updatedUserData = await User.findByIdAndUpdate({_id: context.user._id}, {$addToSet: {savedBooks: input}}, {new: true, runValidators: true});
                return updatedUserData;
            }
            throw new AuthenticationError('Please log in to save book');
        } catch (err) {
            throw new Error ('Failed to save book');
        }
    },
    removeBook: async(parent, args, context) => {
        try {
            if (context.user) {
                const  updatedUserData = await User.findByIdAndUpdate({_id: context.user._id}, {$pull: {savedBooks: {bookId: args.bookId}}}, {new:true});
                return updatedUserData;
            }
            throw new AuthenticationError('Please log in to remove book');
        } catch (err) {
            throw new Error ('Failed to remove book');
        }
    }
}
}
module.exports = resolvers;