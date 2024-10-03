module.exports = {
  async up(db, client) {
    await db.collection("users").dropIndex("username_text");
  },

  async down(db, client) {
    await db.collection("users").createIndex({ username: "text" });
  },
};
