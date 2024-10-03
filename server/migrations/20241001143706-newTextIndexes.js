module.exports = {
  async up(db, client) {
    await db.collection("users").createIndex(
      { username: "text", first_name: "text", last_name: "text" },
      {
        weights: {
          username: 10,
          first_name: 5,
          last_name: 5,
        },
      }
    );
  },

  async down(db, client) {
    await db
      .collection("users")
      .dropIndex("username_text_first_name_text_last_name_text");
  },
};
