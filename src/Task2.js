// @ts-check
const { api, User } = require("./api");
const { Component } = require("./Component");
const { Editor } = require("./Editor");
const { UserRow } = require("./UserRow");

/*

Задание:

Single Page Application (SPA) приложение для редактирования списка пользователей:
a. Одна страница, таблица с полями: имя, телефон. Кнопки: общая - добавить, для каждой строки данных - редактировать, стереть.
b. Под таблицей поля для ввода имени и телефона.
c. При нажатии кнопки добавить - в таблицу добавляется пользователь с данными из заполненных полей. Валидация: имя не пустое,
  телефон состоит только из цифр, тире (возможен “+” как первый символ). Если валидация не пройдена - где то рядом появляется сообщение об ошибке.
d. Редактирование - поля в списке превращаются в текстовые и появляется кнопка для сохранения изменений (или же кнопка для
  начала редактирования превращается в кнопку сохранения). Валидация такая же, как и при добавлении.
e. Удаление - удаляет строку.
f. Начальные данные: 4-5 пользователей.
g. Связи с сервером нет, но должны быть placeholders. Т.е. Там, где должна быть свзяль с сервером (AJAX) что-то должно быть (может, закомментированное).

Комментарий:

Фейк-апи будет эмулировать работу сервера и базы данных.

Для минимального удобства сделаем компоненты в виде классов.
Можно было бы mvc или mvvm, но это сильно больше кода. Тут бы готовый фреймворк использовать.

Будем аккуратны с подпиской на события, так как это верный способ течь памяти.

Местами буем грязно залезать в представление компонентов. Опять же, экономии места ради.

Очень хочется в TypeScript, Coffee не владею, так что используем местами JSDoc.
Это помогает IDE помогать нам.

Придерживаемся концепции оптимистичного интерфейса. В случае проблем, пытаемся откатиться.

Для сообщений об ошибках будем использовать обычные алерты.

Валидация реализована на уровне формы редактирования. Выполнена в минималистичном виде.
На уровне фейк-апи сделана проверка уникальности номера (только при добавлении).

Чувство прекрасного имеется, но выдумывать, когда есть куча css-фреймворков не хочется.
Так что дизайн крайне аскетичен.

*/

class Task2 extends Component {
  constructor(parent) {
    super(parent);

    /**
     * @type {User[]}
     */
    this._list = [];
    this._loading = false;
    /**
     * @type {User | undefined}
     */
    this._editing = undefined;

    /**
     * @type {UserRow[]}
     */
    this.rows = [];

    this.root.classList.add("Task2");

    this.addButton = document.createElement("button");
    this.addButton.textContent = "Add";
    this.addButton.addEventListener("click", this.addUserClickHandler);
    this.root.appendChild(this.addButton);

    this.loadingPlaceholder = document.createElement("div");
    this.loadingPlaceholder.textContent = "Loading...";
    this.loadingPlaceholder.style.display = "none";
    this.root.appendChild(this.loadingPlaceholder);

    this.table = document.createElement("table");
    this.root.appendChild(this.table);

    this.editor = new Editor(this.root, this.editorActionHandler);
    this.editor.visible = false;

    this.fetchUserList();
  }

  destroy() {
    super.destroy();

    this.editor.destroy();

    for (const row of this.rows) {
      row.destroy();
    }

    this.addButton.removeEventListener("click", this.addUserClickHandler);
  }

  get loading() {
    return this._loading;
  }
  set loading(next) {
    this._loading = next;

    this.loadingPlaceholder.style.display = next ? "block" : "none";
  }

  get list() {
    return this._list;
  }
  set list(next) {
    this._list = next;

    this.renderTable();
  }

  get editing() {
    return this._editing;
  }
  set editing(next) {
    this._editing = next;

    this.editor.visible = Boolean(next);

    if (next) {
      this.editor.name = next.name;
      this.editor.phone = next.phone;
      this.editor.action = next.id !== 0 ? "Save" : "Create";
    }
  }

  renderTable() {
    // Здесь не будем мудрствовать лукаво, и просто перерисуем все.

    this.table.deleteTHead();

    for (const row of this.rows) {
      row.destroy();
    }

    const head = this.table.createTHead().insertRow();

    const nameHead = head.insertCell();
    const phoneHead = head.insertCell();
    const actionsHead = head.insertCell();

    nameHead.textContent = "Name";
    phoneHead.textContent = "Phone number";
    actionsHead.textContent = "Actions";

    for (const user of this.list) {
      const row = new UserRow(
        user,
        this.table.insertRow(),
        this.editUserHandler,
        this.removeUserHandler
      );

      this.rows.push(row);
    }
  }

  fetchUserList() {
    this.loading = true;

    api
      .getUserList()
      .then((list) => {
        this.list = list;
      })
      .catch((e) => alert(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => {
        this.loading = false;
      });
  }

  editorActionHandler = () => {
    if (!this.editing) return;

    const prev = { ...this.editing };

    this.editing.name = this.editor.name;
    this.editing.phone = this.editor.phone;

    if (this.editing.id === 0) {
      // Создаем пользователя

      Object.assign(prev, this.editing);

      const user = { ...this.editing };
      const row = new UserRow(
        user,
        this.table.insertRow(),
        this.editUserHandler,
        this.removeUserHandler
      );

      row.root.style.opacity = "50%";
      row.root.style.pointerEvents = "none";
      this.rows.push(row);

      this.editing = undefined;

      api
        .createUser(user)
        .then((created) => {
          Object.assign(user, created);
          row.refresh();

          row.root.style.opacity = "";
          row.root.style.pointerEvents = "";
        })
        .catch((e) => {
          alert(e instanceof Error ? e.message : "Unknown error");

          row.destroy();

          const rowIndex = this.rows.indexOf(row);

          if (rowIndex !== -1) this.rows.splice(rowIndex, 1);

          this.editing = prev;
        });
    } else {
      // Обновляем

      const user = this.editing;
      const row = this.rows.find((item) => item.user === user);

      row.refresh();

      row.root.style.opacity = "50%";
      row.root.style.pointerEvents = "none";

      this.editing = undefined;

      api
        .updateUser(user.id, user)
        .catch((e) => {
          alert(e instanceof Error ? e.message : "Unknown error");

          Object.assign(user, prev);
          row.refresh();
        })
        .finally(() => {
          row.root.style.opacity = "";
          row.root.style.pointerEvents = "";
        });
    }
  };

  addUserClickHandler = () => {
    this.editing = {
      id: 0,
      name: "",
      phone: "",
    };
  };

  /**
   * @param {User} user
   */
  editUserHandler = (user) => {
    this.editing = user;
  };

  /**
   * @param {User} user
   */
  removeUserHandler = (user) => {
    const row = this.rows.find((row) => row.user.id === user.id);

    if (!row) return;

    if (this.editing?.id === user.id) {
      this.editing = undefined;
    }

    row.root.style.display = "none";

    api
      .removeUser(user.id)
      .then(() => {
        row.destroy();

        const rowIndex = this.rows.indexOf(row);

        if (rowIndex !== -1) this.rows.splice(rowIndex, 1);
      })
      .catch((e) => {
        alert(e instanceof Error ? e.message : "Unknown error");

        row.root.style.display = "table-row";
      });
  };
}

module.exports = { Task2 };
