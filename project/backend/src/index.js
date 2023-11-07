// Path: backend\src\index.js
const express = require("express");
const {ApolloServer} = require("apollo-server-express");
const {PubSub} = require("graphql-subscriptions");
const {execute, subscribe} = require("graphql");
const {SubscriptionServer} = require("subscriptions-transport-ws");
const cors = require("cors");
const {typeDefs} = require("./graphql/typeDefs");
const {resolvers} = require("./graphql/resolvers");
const errorHandler = require("./utils/errorHandler");
const connectDB = require("./utils/connectDB");
const http = require("http");
const PORT = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
const {graphqlUploadExpress} = require("graphql-upload");
const rateLimit = require("express-rate-limit");
const { startEventSubscriber } = require("./utils/rabbitMQSubscriber");

const app = express();

app.use(express.static(__dirname + "/public"));

const corsOptions = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10000, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after an hour",
});

app.use("/graphql", apiLimiter);

app.use(graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10}));

app.use(errorHandler);

app.use(cookieParser());

app.use((req, res, next) => {
    const token = req.cookies.authToken;
    if (token) {
        req.token = token;
    }
    next();
});


async function startServer() {
    try {
        await connectDB();
    } catch (err) {
        logger.error("Error connecting to MongoDB:", err);
    }

    const pubSub = new PubSub();

    const apolloServer = new ApolloServer({
        typeDefs, resolvers, introspection: true, context: ({req, res, connection}) => {
            if (connection) {
                return {...connection.context, pubSub};
            } else {
                // TODO: Test solution with cookies
                const token = req.headers.authorization || "";
                req.token = token;
                return {req, res, pubSub, token};
            }
        }, uploads: false,
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({app});

    const httpServer = http.createServer(app);

    SubscriptionServer.create({
        schema: apolloServer.schema, execute, subscribe,
    }, {
        server: httpServer, path: apolloServer.graphqlPath,
    },);

    // Start the RabbitMQ subscriber
    await startEventSubscriber();

    httpServer.listen(PORT, () => {
        logger.debug(`Server is running at http://localhost:${PORT}${apolloServer.graphqlPath}`,);
        logger.debug(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`,);
    });
}

(async () => {
    try {
        await startServer();
    } catch (err) {
        logger.error("Error starting the backend:", err);
    }
})();
