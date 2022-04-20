// @ts-check
const { Component } = require("./Component");

class Editor extends Component {
  /**
   * @param {HTMLElement} parent
   * @param {() => void} onAction
   */
  constructor(parent, onAction) {
    super(parent);

    this._name = "";
    this._phone = "";
    this._action = "Save";
    this._visible = true;

    this.onAction = onAction;

    this.root.classList.add("Editor");

    this.form = document.createElement("form");
    this.form.addEventListener("submit", this.submitFormHandler);
    this.root.appendChild(this.form);

    this.nameField = this.createFieldSet("Name");
    this.nameField.input.addEventListener("input", this.nameInputHandler);
    this.form.appendChild(this.nameField.field);

    this.phoneField = this.createFieldSet("Phone");
    this.phoneField.input.addEventListener("input", this.phoneInputHandler);
    this.form.appendChild(this.phoneField.field);

    this.actionButton = document.createElement("input");
    this.actionButton.type = "submit";
    this.actionButton.value = this._action;
    this.form.appendChild(this.actionButton);
  }

  destroy() {
    super.destroy();

    this.form.removeEventListener("submit", this.submitFormHandler);
    this.nameField.input.removeEventListener("input", this.nameInputHandler);
    this.phoneField.input.removeEventListener("input", this.phoneInputHandler);
  }

  get visible() {
    return this._visible;
  }
  set visible(next) {
    this._visible = next;

    this.root.style.display = next ? "block" : "none";
  }

  get name() {
    return this._name;
  }
  set name(next) {
    this._name = next;
    this.nameField.input.value = next;
    this.validate();
  }

  get phone() {
    return this._phone;
  }
  set phone(next) {
    this._phone = next;
    this.phoneField.input.value = next;
    this.validate();
  }

  get action() {
    return this._action;
  }
  set action(next) {
    this._action = next;
    this.actionButton.value = next;
  }

  validate() {
    let nameError = "";
    let phoneError = "";

    if (!this.name.trim().length) {
      nameError = "Expected name";
    } else if (this.name.trim().length < 3) {
      nameError = "Expected more symbols";
    }

    if (!this.phone.trim().length) {
      phoneError = "Expected phone number";
    } else if (this.phone.trim().length < 5) {
      phoneError = "Expected more symbols";
    } else if (!/^\+?[0-9]+(-[0-9]+)*$/.test(this.phone)) {
      phoneError =
        "Phone number should contain only numbers, dash and may start with plus";
    }

    this.nameField.error.textContent = nameError;
    this.phoneField.error.textContent = phoneError;

    const valid = !nameError && !phoneError;

    this.actionButton.style.opacity = valid ? "" : "50%";
    this.actionButton.style.pointerEvents = valid ? "" : "none";

    return valid;
  }

  /**
   * @private
   * @param {string} legend
   */
  createFieldSet(legend = "Name") {
    const fieldset = {
      field: document.createElement("fieldset"),
      legend: document.createElement("legend"),
      input: document.createElement("input"),
      error: document.createElement("div"),
    };

    fieldset.legend.textContent = legend;
    fieldset.field.appendChild(fieldset.legend);
    fieldset.field.appendChild(fieldset.input);
    fieldset.field.appendChild(fieldset.error);

    return fieldset;
  }

  /**
   * @param {SubmitEvent} e
   */
  submitFormHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.validate()) return;

    this.onAction();
  };

  /**
   * @param {Event} e
   */
  nameInputHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.name = this.nameField.input.value;
  };

  /**
   * @param {Event} e
   */
  phoneInputHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.phone = this.phoneField.input.value;
  };
}

module.exports = { Editor };
