import { describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import createApp from "../server.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Task from "../models/task.js";
import jwt from "jsonwebtoken";

let app;
let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST);

  app = await createApp();

  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
  });
  userId = user._id;

  token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_TEST,
    { expiresIn: "15m" }
  );

  await Task.create({
    title: "Task 1",
    description: "Test using Vitest",
    userId,
  });
},20000);

afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.disconnect();
});

describe("REST API Tests", () => {
  it("GET /api/tasks should return tasks for logged-in user", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Task 1");
  });

  it("GET /api/tasks should return 401 without token", async () => {
    await request(app).get("/api/tasks").expect(401);
  });

  it("POST /api/tasks should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Task 2", description: "Desc 2" })
      .expect(201);

    expect(res.body.title).toBe("Task 2");
    expect(res.body.userId).toBe(userId.toString());
  });
});

describe("GraphQL Tests", () => {
  it("Query myTask returns user tasks", async () => {
    const query = {
      query: `
              query {
                myTask {
                  title
                  description
                }
              }
            `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(query)
      .expect(200);

    expect(res.body.data.myTask.length).toBeGreaterThan(0);
    expect(res.body.data.myTask[0].title).toBeDefined();
  });

  it("Mutation createTask creates a task", async () => {
    const mutation = {
      query: `
                mutation {
                  createTask(title: "GraphQL Task", description: "GraphQL Desc") {
                    title
                    description
                    userId
                  }
                }
              `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(mutation)
      .expect(200);

    expect(res.body.data.createTask.title).toBe("GraphQL Task");
    expect(res.body.data.createTask.userId).toBe(userId.toString());
  });
});
