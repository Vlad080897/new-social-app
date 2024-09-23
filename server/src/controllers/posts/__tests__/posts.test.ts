import supertest from "supertest";
import bcrypt from "bcrypt";

import { app } from "../../../server";
import { connectTestDb, disconnectDb } from "../../../mockDb";
import { Post } from "../../../models/Post";
import { AUTH, POSTS } from "../../../consts/endpoints";
import { User } from "../../../models/User";
import mongoose from "mongoose";

const request = supertest(app);

let token: string;
let userId: mongoose.Types.ObjectId;

describe("posts controller", () => {
  beforeAll(async () => {
    await connectTestDb();

    const user1 = new User({
      username: "User One",
      email: "user1@example.com",
      password: bcrypt.hashSync("password", 10),
      first_name: "User",
      last_name: "One",
    });
    const user2 = new User({
      username: "User One",
      email: "user2@example.com",
      password: "password",
      first_name: "User",
      last_name: "Two",
    });

    await user1.save();
    userId = user1._id;

    await user2.save();

    const post1 = new Post({
      content: "post1",
      created_at: new Date(),
      user: user1._id,
    });

    const post2 = new Post({
      content: "post2",
      created_at: new Date(),
      user: user2._id,
    });

    await post1.save();
    await post2.save();

    const res = await request.post(`${AUTH}/login`).send({
      email: "user1@example.com",
      password: "password",
    });

    token = res.body.access_token;
  });

  afterAll(async () => {
    await disconnectDb();
  });

  test("should send all posts", async () => {
    const res = await request
      .get(`${POSTS}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].user).toBeDefined();
    expect(res.body[0].user.username).toBe("User One");
    expect(Object.keys(res.body[0].user).length).toBe(2);
  });

  test("should send a post", async () => {
    const post = await Post.findOne({ content: "post1" });

    const res = await request
      .get(`${POSTS}/${post?._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  test("should send an error if post does not exist", async () => {
    const res = await request
      .get(
        // some random id that does not exist in db
        `${POSTS}/60f4b5b3c3b6d3f6e8c4b8b1 
      `
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No such post exists");
  });

  test("should create a post", async () => {
    const res = await request
      .post(`${POSTS}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "post3",
        user: userId,
      });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe("post3");
    expect(res.body.user).toBe(userId.toString());
    expect(res.body.created_at).toBeDefined();
  });

  test("should delete a post", async () => {
    const post = await Post.findOne({ content: "post2" });

    const res = await request
      .delete(`${POSTS}/${post?._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post deleted successfully");
  });

  test("should send an error if post to delete does not exist", async () => {
    const res = await request
      .delete(
        // some random id that does not exist in db
        `${POSTS}/60f4b5b3c3b6d3f6e8c4b8b1
      `
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No such post exists");
  });

  test("should update a post", async () => {
    const post = await Post.findOne({ content: "post1" });

    const res = await request
      .patch(`${POSTS}/${post?._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "post1 updated",
        user: userId,
      });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe("post1 updated");
    expect(res.body.user).toBe(userId.toString());
    expect(res.body.updated_at).toBeDefined();
  });

  test("should send an error if post to update does not exist", async () => {
    const res = await request
      .patch(
        // some random id that does not exist in db
        `${POSTS}/60f4b5b3c3b6d3f6e8c4b8b1
      `
      )
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "post1 updated",
        user: userId,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No such post exists");
  });

  test("should send an error if payload is invalid", async () => {
    const post = await Post.findOne({ content: "post1" });

    const res = await request
      .patch(`${POSTS}/${post?._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: 123,
        user: userId,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('"content" must be a string');
  });

  test("should send an error if payload has extra fields", async () => {
    const post = await Post.findOne({ content: "post1" });

    const res = await request
      .patch(`${POSTS}/${post?._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "post1 updated",
        user: userId,
        extra: "extra field",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('"extra" is not allowed');
  });

  test("should send an error if content field is missing", async () => {
    const post = await Post.findOne({ content: "post1" });

    const res = await request
      .patch(`${POSTS}/${post?._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        user: userId,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('"content" is required');
  });
});
