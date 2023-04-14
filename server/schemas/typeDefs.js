const { gql } = require('apollo-server-express');

const typeDefs = gql`
    
    input saveBookInput {
        author:[author]
        description: String!
        title: String!
        bookId: String!
        image: String!
        link: String!
    },

    type Query {
        me: User
    },

    type Mutation {
        login: (email: String!, password: String!): Auth
        addUser: (username: String!, email: String!, password: String!): Auth
        saveBook: (input: saveBookInput): User
        removeBook: (bookId): User
    },
    
    type User {
        _id: ID!
        username: String
        email: String
        bookCount: Int
        savedBooks [Book]
    },

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    },

    type Auth {
        token: ID!
        user: [User]
    }
`;

module.exports = typeDefs;