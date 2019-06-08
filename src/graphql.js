import {gql} from 'apollo-server/dist/index'
import {RedisPubSub} from "graphql-redis-subscriptions/dist/index";
import {config, context} from 'pbl-lib'

const options = {
    host: config.redisUrl,
    port: 6379
};
const pubSub = new RedisPubSub();

const typeDefs = gql`
    type Notification {
        content: String!
    }

    type Query {
        _empty: String
    }

    type Mutation {
        pushNotification(receiver: ID!, content: String!): Notification!
    }

    type Subscription {
        newNotification: Notification
    }
`;

const resolvers = {
    Query: {
        _empty: () => {
        }
    },
    Mutation: {
        pushNotification: (root, {receiver, content}) => {
            console.log('push', receiver, content);
            const newNotification = {content};
            pubSub.publish(receiver, {newNotification});
            return newNotification
        }
    },
    Subscription: {
        newNotification: {
            subscribe: (root, args, {username}) => {
                console.log('received subscription', username);
                return pubSub.asyncIterator(username)
            }
        }
    }
};

export default {
    typeDefs,
    resolvers,
    context: (ctx) => {
        // console.log(ctx, context(ctx), ctx.payload.context);
        return context(ctx)
    },
}
