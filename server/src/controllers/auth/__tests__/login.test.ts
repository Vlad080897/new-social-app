import supertest from "supertest";
import { connectTestDb, disconnectDb } from "../../../mockDb";
import { app } from "../../../server";
import { AUTH } from "../../../consts/endpoints";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";

const request = supertest(app);

describe("login controller", () => {
  beforeAll(async () => {
    await connectTestDb();

    const hashedPassword = await bcrypt.hash("password", 10);

    const user = {
      email: "test@gmail.com",
      password: hashedPassword,
      username: "test",
      last_name: "test",
      first_name: "test",
    };

    (await User.create(user)).save();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  test("should login user with correct credentials", async () => {
    const res = await request.post(`${AUTH}/login`).send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });

  test("should set correct cookie", async () => {
    const res = await request.post(`${AUTH}/login`).send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(res.headers["set-cookie"][0]).toContain("refresh_token");
    expect(res.headers["set-cookie"][0]).toContain("HttpOnly");
    expect(res.headers["set-cookie"][0]).toContain("Max-Age=1800");
  });

  test("should not login user with incorrect credentials", async () => {
    const response = await request.post(`${AUTH}/login`).send({
      email: "",
      password: "wrongpassword",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Invalid email or password",
    });
  });
});
