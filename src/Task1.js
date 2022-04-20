// @ts-check
const { Component } = require("./Component");

/*

Задание:

Создать 2 канваса 600x600 и 600x50, нарисовать в большем 5 закрашенных 5-и конечных звезд.
Красного, синего, зеленого, желтого и черного цветов и по клику мышкой на цветной звезде -
закрашивать маленький канвас - соответствующим цветом.
При клике на белую (не закрашенную) область большого канваса - маленький канвас - закрашивать белым.

Комментарий:

На практике кликабельность элементов в канвасе реализуется через рисование хит-канваса. Яркий пример Konva.js.
Но можно вычислять положение и через полигоны. Для сложных объектов это потребует больше операций (point-in-polygon problem).

Если же требуется сделать своего рода калорпикер по изображению, то целесообразно сделать проверку пикселя
под курсором. В нашем случае может возникнуть проблема со сглаживанием (субпиксельный рендеринг).
Когда на краях фигур появятся пиксели, которые имеют промежуточные цвета.
Принимаем эти ограничения, и делаем так.

Колорпикер по палитре, как в пейнте, лучше делать через координаты и перевод в цветовое пространство.

*/

class Task1 extends Component {
  constructor(parent) {
    super(parent);

    this.root.style.display = "flex";
    this.root.style.flexDirection = "column";

    this.ratio = window.devicePixelRatio;

    this.canvasPicker = document.createElement("canvas");
    this.canvasPicker.width = 600 * this.ratio;
    this.canvasPicker.height = 600 * this.ratio;
    this.canvasPicker.style.width = "600px";
    this.canvasPicker.style.height = "600px";
    this.canvasPicker.addEventListener(
      "mousedown",
      this.pickerMouseDownHandler
    );
    this.root.appendChild(this.canvasPicker);

    this.canvasColor = document.createElement("canvas");
    this.canvasColor.width = 600 * this.ratio;
    this.canvasColor.height = 50 * this.ratio;
    this.canvasColor.style.width = "600px";
    this.canvasColor.style.height = "50px";
    this.root.appendChild(this.canvasColor);

    this.color = "white";

    this.renderPicker();
  }

  destroy() {
    super.destroy();

    this.canvasPicker.removeEventListener(
      "mousedown",
      this.pickerMouseDownHandler
    );
  }

  renderPicker() {
    const ctx = this.canvasPicker.getContext("2d");

    ctx.resetTransform();
    ctx.scale(this.ratio, this.ratio);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const start = this.getStarPath(50, 20);

    ctx.translate(70, 70);
    ctx.fillStyle = "red";
    ctx.fill(start);

    ctx.translate(120, 50);
    ctx.fillStyle = "skyblue";
    ctx.fill(start);

    ctx.translate(100, 10);
    ctx.fillStyle = "green";
    ctx.fill(start);

    ctx.translate(20, 130);
    ctx.fillStyle = "orange";
    ctx.fill(start);

    ctx.translate(-200, -40);
    ctx.fillStyle = "black";
    ctx.fill(start);
  }

  /**
   * @param {number} outerRadius
   * @param {number} innerRadius
   * @param {number} x
   * @param {number} y
   */
  getStarPath(outerRadius, innerRadius, x = 0, y = 0) {
    const path = new Path2D();

    path.moveTo(x, y);

    for (let i = 0; i <= 10; i += 1) {
      const radius = i % 2 ? innerRadius : outerRadius;
      const cx = radius * Math.sin((i * Math.PI) / 5);
      const cy = -radius * Math.cos((i * Math.PI) / 5);

      path.lineTo(cx, cy);
    }

    path.closePath();

    return path;
  }

  renderColor() {
    const ctx = this.canvasColor.getContext("2d");

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /**
   * @param {MouseEvent} e
   */
  pickerMouseDownHandler = (e) => {
    const rect = this.canvasPicker.getBoundingClientRect();

    const x = Math.round((e.clientX - rect.left) * this.ratio);
    const y = Math.round((e.clientY - rect.top) * this.ratio);

    const [r, g, b, a] = this.canvasPicker
      .getContext("2d")
      .getImageData(x, y, 1, 1).data;

    // Будем считать наличие прозрачности за промах. Это позволит избежать проблем сглаживания.
    if (a === 255) {
      this.color = `rgb(${r},${g},${b})`;
    } else {
      this.color = "white";
    }

    this.renderColor();
  };
}

module.exports = { Task1 };
