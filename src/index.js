import "@babel/polyfill";

import {ApolloServer} from "apollo-server-express";
import config from "./graphql";
import express from "express";
import http from 'http';


const PORT = process.env['PORT'] || 4000;
const app = express();

const server = new ApolloServer(config);
server.applyMiddleware({app});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});
