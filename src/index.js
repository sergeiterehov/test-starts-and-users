const { Component } = require("./Component");
const { Task1 } = require("./Task1");
const { Task2 } = require("./Task2");
require("./index.css");

const root = document.getElementById("root");

class Navigation extends Component {
  constructor(parent) {
    super(parent);

    this.root.classList.add("Navigation");

    this.task1Button = document.createElement("button");
    this.task1Button.textContent = "Task 1";
    this.task1Button.addEventListener("click", this.task1ButtonClickHandler);
    this.root.appendChild(this.task1Button);

    this.task2Button = document.createElement("button");
    this.task2Button.textContent = "Task 2";
    this.task2Button.addEventListener("click", this.task2ButtonClickHandler);
    this.root.appendChild(this.task2Button);

    /**
     * @type {Component}
     */
    this.task = new Task1(this.root);
  }

  destroy() {
    super.destroy();

    this.task.destroy();

    this.task1Button.removeEventListener("click", this.task1ButtonClickHandler);
    this.task2Button.removeEventListener("click", this.task2ButtonClickHandler);
  }

  task1ButtonClickHandler = () => {
    if (this.task instanceof Task1) return;

    this.task.destroy();
    this.task = new Task1(this.root);
  };

  task2ButtonClickHandler = () => {
    if (this.task instanceof Task2) return;

    this.task.destroy();
    this.task = new Task2(this.root);
  };
}

const navigation = new Navigation(root);
