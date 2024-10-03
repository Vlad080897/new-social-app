module.exports = {
  async up(db, _) {
    await db.collection("users").createIndex({ username: "text" });
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
  },

  async down(db, _) {
    await db.collection("users").dropIndex("username_text");
    await db.collection("users").dropIndex("username_1");
  },
};
