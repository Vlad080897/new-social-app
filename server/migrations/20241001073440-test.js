module.exports = {
  async up(db, client) {
    const users = [
      {
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        email: "john.doe@gmail.com",
        password:
          "$2b$10$EdD6oe7.UdFDbnlhdJjmgOC7w7NSW0yKHNA1w3b/h8YVRXKhk.jV2",
      },
      {
        first_name: "Jane",
        last_name: "Smith",
        username: "janesmith",
        email: "jane.smith@gmail.com",
        password:
          "$2b$10$EdD6oe7.UdFDbnlhdJjmgOC7w7NSW0yKHNA1w3b/h8YVRXKhk.jV2",
      },
      {
        first_name: "Michael",
        last_name: "Johnson",
        username: "michaeljohnson",
        email: "michael.johnson@gmail.com",
        password:
          "$2b$10$EdD6oe7.UdFDbnlhdJjmgOC7w7NSW0yKHNA1w3b/h8YVRXKhk.jV2",
      },
      {
        first_name: "Emily",
        last_name: "Davis",
        username: "emilydavis",
        email: "emily.davis@gmail.com",
        password:
          "$2b$10$EdD6oe7.UdFDbnlhdJjmgOC7w7NSW0yKHNA1w3b/h8YVRXKhk.jV2",
      },
    ];

    await db.collection("users").insertMany(users);
  },

  async down(db, client) {
    const usernames = ["johndoe", "janesmith", "michaeljohnson", "emilydavis"];
    await db.collection("users").deleteMany({ username: { $in: usernames } });
  },
};
