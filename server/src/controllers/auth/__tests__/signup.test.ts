import supertest from "supertest";
import { connectTestDb, disconnectDb } from "../../../mockDb";
import { User } from "../../../models/User";
import { app, server } from "../../../server";

// @ts-ignore
const request = supertest(global.httpServer);

describe("signup controller", () => {
  beforeAll(async () => {
    await connectTestDb();

    const user = {
      email: "test@gmail.com",
      password: "password",
      username: "test",
      last_name: "test",
      first_name: "test",
    };

    const createdUser = await User.create(user);
    await createdUser.save();
  });

  afterAll(async () => {
    await disconnectDb();
    server.close();
  });

  test("should not create user if user already exists", () => {

  });
});
