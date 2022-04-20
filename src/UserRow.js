// @ts-check
const { Component } = require("./Component");
const { User } = require("./api");

class UserRow extends Component {
  /**
   * @param {User} user
   * @param {HTMLTableRowElement} row
   * @param {(user: User) => void} onEdit
   * @param {(user: User) => void} onRemove
   */
  constructor(user, row, onEdit, onRemove) {
    super(row.parentElement, row);

    this.onEdit = onEdit;
    this.onRemove = onRemove;

    this.user = user;

    this.nameCell = row.insertCell();
    this.phoneCell = row.insertCell();
    this.actionsCell = row.insertCell();

    this.nameCell.textContent = user.name;
    this.phoneCell.textContent = user.phone;

    this.editAction = document.createElement("button");

    this.editAction.textContent = "Edit";
    this.editAction.addEventListener("click", this.editClickHandler);
    this.actionsCell.appendChild(this.editAction);

    this.removeAction = document.createElement("button");

    this.removeAction.textContent = "Remove";
    this.removeAction.addEventListener("click", this.removeClickHandler);
    this.actionsCell.appendChild(this.removeAction);
  }

  destroy() {
    super.destroy();

    this.editAction.removeEventListener("click", this.editClickHandler);
    this.removeAction.removeEventListener("click", this.removeClickHandler);
  }

  refresh() {
    this.nameCell.textContent = this.user.name;
    this.phoneCell.textContent = this.user.phone;
  }

  editClickHandler = () => {
    this.onEdit(this.user);
  };

  removeClickHandler = () => {
    this.onRemove(this.user);
  };
}

module.exports = { UserRow };
