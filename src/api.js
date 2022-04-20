// @ts-check

/**
 * @exports
 * @typedef User
 * @property {number} id
 * @property {string} name
 * @property {string} phone
 */

const api = {
  usersData: {
    nextId: 6,
    list: [
      { id: 1, name: "Kelly, Mr. James", phone: "+3-893-434-5389" },
      { id: 2, name: "Wirz, Mr. Albert", phone: "+475-4325-23-53" },
      { id: 3, name: "Hirvonen, Mrs. Alexander", phone: "+79008002030" },
      { id: 4, name: "Connolly, Miss. Kate", phone: "123456789" },
      { id: 5, name: "Davies, Mr. John Samuel", phone: "1-23-45" },
    ],
  },

  /**
   * @returns {Promise<User[]>}
   */
  async getUserList() {
    await new Promise((done) => setTimeout(done, 500));

    return this.usersData.list.map((user) => ({ ...user }));
  },

  /**
   * @param {User} user
   * @returns {Promise<User>}
   */
  async createUser(user) {
    await new Promise((done) => setTimeout(done, 500));

    if (
      this.usersData.list.some(
        (other) =>
          other.phone.replace(/[^0-9]/g, "") ===
          user.phone.replace(/[^0-9]/g, "")
      )
    ) {
      throw new Error("Phone number already exists");
    }

    const newUser = { ...user, id: this.usersData.nextId++ };

    this.usersData.list.push(newUser);

    return { ...newUser };
  },

  /**
   * @param {number} id
   * @param {Partial<User>} changes
   */
  async updateUser(id, changes) {
    await new Promise((done) => setTimeout(done, 500));

    const user = this.usersData.list.find((user) => user.id === id);

    if (!user) throw new Error("User not found");

    delete changes.id;

    Object.assign(user, changes);
  },

  /**
   * @param {number} id
   */
  async removeUser(id) {
    await new Promise((done) => setTimeout(done, 500));

    const userIndex = this.usersData.list.findIndex((user) => user.id === id);

    if (userIndex === -1) throw new Error("User not found");

    this.usersData.list.splice(userIndex, 1);
  },
};

module.exports = { api };
