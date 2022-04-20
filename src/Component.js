// @ts-check
/**
 * @class
 * @template {HTMLElement} [T=HTMLDivElement]
 * @constructor
 * @public
 */
class Component {
  /**
   * @param {HTMLElement} parent
   * @param {T} root
   */
  constructor(parent, root = undefined) {
    /**
     * @type {HTMLElement}
     */
    this.parent = parent;

    if (!root) {
      // @ts-ignore
      root = document.createElement("div");
    }

    if (root.parentElement !== parent) {
      parent.appendChild(root);
    }

    /**
     * @type {T}
     */
    this.root = root;
  }

  destroy() {
    this.root.remove();
  }
}

module.exports = { Component };
