require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const passport = require("./config/passport");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const User = require("./models/User");

async function createApp() {
  const app = express();

  app.use(cors());

  if (process.env.NODE_ENV !== "test") {
    await connectDB();
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.split(" ")[1];

      if (!token) return { user: null };

      try {
        const secret =
          process.env.NODE_ENV === "test"
            ? process.env.JWT_SECRET_TEST
            : process.env.JWT_SECRET;

        const decoded = jwt.verify(token, secret);
        return { user: decoded };
      } catch (err) {
        console.log("JWT Verification Error:", err.message);
        return { user: null };
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());

  app.use("/auth", require("./routes/authRoutes"));
  app.use("/api/tasks", require("./routes/taskRoutes"));

  return app;
}

module.exports = createApp;

const startServer = async () => {
  try {
    const app = await createApp();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};
if (require.main === module) {
  startServer();
}
