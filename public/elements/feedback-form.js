import '../styles/styles.js';
import { PolymerElement } from '../node_modules/@polymer/polymer/polymer-element.js';
/**
 * @customElement
 * @polymer
 */
class FeedbackForm extends PolymerElement {
  static get template() {
    return `
    <style include="int-styles">

      :host {
        display: block;
        margin: auto;
        max-width: 400px;
      }

    </style>

    <div class="int-vertical-container">
      <input placeholder="Subject">
      <textarea placeholder="Message"></textarea>
      <button>Submit</button>
    </div>
`;
  }

  static get is() { return 'feedback-form'; }

  static get properties() {
    return {
      slug: {
        type: String,
        value: 'contents',
        computed: `computeSlug(data.slug)`
      }
    };
  }
}

window.customElements.define(FeedbackForm.is, FeedbackForm);
