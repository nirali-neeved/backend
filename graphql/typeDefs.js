const { gql } = require("apollo-server-express");

const typeDefs = gql(`
    type User{
        id:ID!
        googleId:String
        name:String!
        email:String!
    }

    type Task{
        id:ID!
        title:String!
        description:String!
        completed:Boolean!
        userId:ID!
        user:User!
    }

    type Query{
        me:User!
        myTask:[Task!]!
        task(id:ID!):Task
    }

    type Mutation{
        createTask(title:String!,description:String!):Task!
        toggleTask(id:ID!):Task!
        deleteTask(id:ID!):Boolean!
    }
`);

module.exports = typeDefs;
