import '../styles/styles.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 */
class FeedbackForm extends PolymerElement {
    static get template() {
        return html`
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

window.customElements.define('feedback-form', FeedbackForm);
