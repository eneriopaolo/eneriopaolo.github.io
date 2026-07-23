/**
 * js/typing.js
 * ------------------------------------------------------------------
 * A small, dependency-free typewriter effect. Cycles through a list
 * of strings: types each one out, pauses, backspaces, then moves to
 * the next — looping infinitely.
 *
 * Usage:
 *   new TypingEffect(el, ["Software Engineer", "Machine Learning Specialist"]);
 * ------------------------------------------------------------------
 */
export class TypingEffect {
  /**
   * @param {HTMLElement} el
   * @param {string[]} words
   * @param {object} [options]
   * @param {number} [options.typeSpeed=70]
   * @param {number} [options.deleteSpeed=40]
   * @param {number} [options.pause=1400]
   */
  constructor(el, words, options = {}) {
    this.el = el;
    this.words = words;
    this.typeSpeed = options.typeSpeed ?? 60;
    this.deleteSpeed = options.deleteSpeed ?? 30;
    this.pause = options.pause ?? 1400;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (this.reducedMotion) {
      this.el.textContent = this.words[0] ?? "";
      return;
    }

    this._tick = this._tick.bind(this);
    this._tick();
  }

  _tick() {
    const currentWord = this.words[this.wordIndex];
    const isDeleting = this.mode === "deleting";

    if (!isDeleting) {
      this.charIndex++;
      this.el.textContent = currentWord.slice(0, this.charIndex);

      if (this.charIndex === currentWord.length) {
        this.mode = "deleting";
        setTimeout(this._tick, this.pause);
        return;
      }
      setTimeout(this._tick, this.typeSpeed);
      return;
    }

    this.charIndex--;
    this.el.textContent = currentWord.slice(0, this.charIndex);

    if (this.charIndex === 0) {
      this.mode = "typing";
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      setTimeout(this._tick, this.typeSpeed);
      return;
    }
    setTimeout(this._tick, this.deleteSpeed);
  }
}
