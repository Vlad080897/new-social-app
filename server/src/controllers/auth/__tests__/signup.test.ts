import supertest from "supertest";
import { User } from "../../../models/User";
import { app } from "../../../server";
import { AUTH } from "../../../consts/endpoints";
import mongoDb from "../../../service/db.service";

const currentUser = {
  email: "test@gmail.com",
  password: "password",
  username: "test",
  last_name: "test",
  first_name: "test",
};

const request = supertest(app);

describe("signup controller", () => {
  beforeAll(async () => {
    await mongoDb.connectTestDb();

    const user = {
      ...currentUser,
    };

    const createdUser = await User.create(user);
    await createdUser.save();
  });

  afterAll(async () => {
    await mongoDb.close();
  });

  test("should not create user if user already exists", async () => {
    const res = await request.post(`${AUTH}/signup`).send({
      ...currentUser,
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "User already exists",
    });
  });

  test("should create user if user does not exist", async () => {
    const res = await request.post(`${AUTH}/signup`).send({
      ...currentUser,
      email: "test2@gmail.com",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      email: "test2@gmail.com",
    });
  });

  test("should return 400 if some data is missing", async () => {
    const res = await request.post(`${AUTH}/signup`).send({
      email: "test3@gmail.com",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeTruthy();
  });
});
