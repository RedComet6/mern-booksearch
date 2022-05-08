const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    // queries, readonly
    Query: {
        me: async (parent, args, context) => {
            // if user is logged in, they will have a context.user
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select("-__v -password");

                return userData;
            }
            // throw if query cannot find context.user, meaning the user is not logged in
            throw new AuthenticationError("Not logged in");
        },
    },
    // mutations, create, update, delete
    Mutation: {
        // new user signup
        addUser: async (parent, args) => {
            // create a new user and assign them an authorization token
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // login for existing user
        login: async (parent, { email, password }) => {
            // identify user loggin in
            const user = await User.findOne({ email });
            // throw if matching user cannot be found
            if (!user) {
                throw new AuthenticationError("Incorrect credentials");
            }
            // validate input password
            const correctPw = await user.isCorrectPassword(password);
            // throw if password does not match the correct password associated with the input email
            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }
            // assign authorization token
            const token = signToken(user);
            return { token, user };
        },
        // add a book to the user's "My Books"
        saveBook: async (parent, { bookData }, context) => {
            // if user is logged in, they will have a context.user
            if (context.user) {
                // update the user document by pushing the newly added book into the savedBooks array
                const updatedUser = await User.findByIdAndUpdate({ _id: context.user._id }, { $push: { savedBooks: bookData } }, { new: true });

                return updatedUser;
            }
            // throw if user does not have a context.user, meaning they are not logged in
            throw new AuthenticationError("You need to be logged in!");
        },
        // remove a book from the user's "My Books"
        removeBook: async (parent, { bookId }, context) => {
            // if user is logged in, they will have a context.user
            if (context.user) {
                // update the user document by pulling the newly removed book from the savedBooks array
                const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId } } }, { new: true });

                return updatedUser;
            }
            // throw if user does not have a context.user, meaning they are not logged in
            throw new AuthenticationError("You need to be logged in!");
        },
    },
};

module.exports = resolvers;
