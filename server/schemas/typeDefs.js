const { gql } = require('apollo-server-express')

const typeDefs = gql`
    scalar Date
    type User {
        _id: ID
        username: String
        email: String
        password: String
        skills: [Skills]
        educations: [Education]
        experiences: [Experience]
        userInfos: [UserInfo]
    }

    type Skills {
        _id: ID!
        technicalSkills: String
        languages: String
        softSkills: String
        interests: String
        owner: ID
    }

    type Experience {
        _id: ID!
        organization: String
        position: String
        startDate: String
        endDate: String
        location: String
        description: String
        owner: ID
    }

    type Education {
        _id: ID!
        school: String
        degree: String
        major: String
        gpa: String
        graduationDate: String
        certifications: [String]
        owner: ID
    }

    type UserInfo {
        firstName: String!
        lastName: String!
        address: String!
        phoneNumber: String!
        email: String!
        owner: ID
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]!
        user(userId: ID!): User
        me(userId: ID!): User
        skills: [Skills]
        educations: [Education]
        experiences: [Experience]
        userInfos: [UserInfo]
    }

    type Mutation {
        login(username: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        removeUser(userId: ID!): User
        addSkills(technicalSkills: String, languages: String, softSkills: String, interests: String, owner: ID): Skills
        removeSkills(skillId: ID!): Skills
        addExperience(organization: String, position: String, startDate: String, endDate: String, location: String, description: String, owner: ID): Experience
        removeExperience(experienceId: ID!): Experience
        addEducation(school: String, degree: String, major: String, gpa: String, graduationDate: String, certifications: String, owner: ID): Education
        removeEducation(educationId: ID!): Education
        addUserInfos(firstName: String!, lastName: String!, address: String!, phoneNumber: String!, email: String!, owner: ID): UserInfo
        removeUserInfos(userInfosID: ID!): UserInfo
    }
`;

module.exports = typeDefs;

