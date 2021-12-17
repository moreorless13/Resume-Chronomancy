const { AuthenticationError } = require('apollo-server-express');
const { User, Skills, Education, Experience, UserInfo } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            const users = await User.find().populate([{ path: 'skills', model: Skills }, { path: 'educations', model: Education }, { path: 'experiences', model: Experience }, { path: 'userInfos', model: UserInfo }]);
            return users;
        },
        user: async (parent, { userId }, context) => {
            if (context) {
                const user = await User.findById(context.userId).populate(
                    [
                        { path: 'skills', model: Skills },
                        { path: 'educations', model: Education },
                        { path: 'experiences', model: Experience },
                        { path: 'userInfos', model: UserInfo }
                    ]
                );

                return user
            }
            throw new AuthenticationError('You need to be logged in.')
        },
        me: async (parent, { userId }, context) => {
            if (context) {
                return await User.findOne({ _id: userId }).populate([{ path: 'skills', model: Skills }, { path: 'educations', model: Education }, { path: 'experiences', model: Experience }, { path: 'userInfos', model: UserInfo }]);
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, { username, password }) => {
            const user = await User.findOne({ username });

            if (!user) {
                throw new AuthenticationError('No profile with this username found');
            }

            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) {
                throw new AuthenticationError('Incorrect Password');
            }

            const token = signToken(user);
            return { token, user }
        },

        removeUser: async (parent, args, context) => {
            if (context.user) {
                return User.findOneAndDelete({ _id: context.user._id });
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        addSkills: async (parent, { technicalSkills, languages, softSkills, interests, owner }, context) => {
            if (context) {
                const skills = await Skills.create(
                    {
                       technicalSkills,
                       languages,
                       softSkills,
                       interests,
                       owner
                    }
                );

                await User.findByIdAndUpdate(
                    { _id: skills.owner },
                    { $addToSet: { skills: skills._id } }
                );

                return skills;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        addEducation: async (parent, { school, degree, major, gpa, graduationDate, certifications, owner }, context) => {
            if (context) {
                const education = await Education.create(
                    {
                        school,
                        degree,
                        major,
                        gpa,
                        graduationDate,
                        certifications,
                        owner
                    }
                );
                console.log(education)
                await User.findByIdAndUpdate(
                    { _id: education.owner },
                    { $addToSet: { educations: education._id } }
                );

                return education;
            }

            throw new AuthenticationError('You need to be logged in!')
        },

        addExperience: async (parent, { organization, position, startDate, endDate, location, description, owner }, context) => {
            if (context) {
                const experience = await Experience.create(
                    {
                        organization,
                        position,
                        startDate,
                        endDate,
                        location,
                        description,
                        owner
                    }
                );

                await User.findOneAndUpdate(
                    { _id: experience.owner },
                    { $addToSet: { experiences: experience._id } }
                );

                return experience;
            }
            throw new AuthenticationError('You need to be logged in!')
        },

        addUserInfos: async (parent, { firstName, lastName, address, phoneNumber, email, owner }, context) => {
            if (context) {
                const userInfo = await UserInfo.create(
                    {
                        firstName,
                        lastName,
                        address,
                        phoneNumber,
                        email,
                        owner
                    }
                )

                await User.findByIdAndUpdate(
                    { _id: userInfo.owner },
                    { $addToSet: { userInfos: userInfo._id } }
                )

                return userInfo
            }

            throw new AuthenticationError('You must be logged in to do that!')
        },

        removeEducation: async (parent, { educationId }, context) => {
            if (context.user) {
                const education = await Education.findOneAndDelete({
                    _id: context.user._id
                });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { educations: education._id } }
                );

                return education
            }

            throw new AuthenticationError('You need to be logged in to do that!')
        },

        removeExperience: async (parent, { experienceId }, context) => {
            if (context.user) {
                const experience = await Experience.findOneAndDelete({
                    _id: context.user._id
                });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { experiences: experience._id } }
                );

                return experience
            }

            throw new AuthenticationError('You need to be logged in to do that!')
        }
    }
};

module.exports = resolvers;
