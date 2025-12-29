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

  // await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");

      if (!token) return {};

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TEST);
        const user = await User.findById(decoded.id);
        return { user };
      } catch {
        return {};
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

if (require.main === module) {
  (async () => {
    const app = await createApp();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })().catch((err) => console.error("Server failed to start:", err));
}
