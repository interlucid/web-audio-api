import '../styles/styles.js';
import '../styles/syntax-highlighting.js';
import { PolymerElement } from '../node_modules/@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 */
class AudioDemo extends PolymerElement {
  static get template() {
    return `
        <style is="custom-style" include="int-styles syntax-highlighting">
        
            :host {
                display: block;
                position: relative;
            }

            iframe {
                width: 100%;
                box-sizing: border-box;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                margin-bottom: 0;
                border-bottom: 0;
            }

            pre {
                margin-top: 0;
            }

            code {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                max-height: 80vh;
            }

			input[type=range] {
				-webkit-appearance: none;
				background: transparent;
				width: 100%;
			}

			input[type=range]::-webkit-slider-thumb {
				-webkit-appearance: none;
				height: 2em;
				width: 2em;
				border-radius: 5em;
				margin-top: -.7em;
				background: white;
			}

			input[type=range]::-moz-range-thumb {
				height: 2em;
				width: 2em;
				border-radius: 5em;
				margin-top: -.7em;
				background: white;
			}

			input[type=range]::-webkit-slider-runnable-track {
				height: .5em;
				margin: .7em .3em;
				border-radius: 5em;
				background: grey;
			}

			input[type=range]::-moz-range-track {
				height: .5em;
				width: 100%;
				margin: .7em .3em;
				border-radius: 5em;
				background: grey;
			}

            markdown-element {
                position: relative;
            }

            #copy-button {
                position: absolute;
                bottom: 1em;
                right: 1em;
            }

        </style>

        
        <markdown-element markdown="[[markdown]]">
            <div slot="markdown-html"></div>
        </markdown-element>
        <button id="copy-button" on-click="copyToClipboard">Copy</button>
`;
  }

  static get is() { return 'audio-demo'; }

  static get properties() {
      return {
          markdown: {
              type: String
          },
          text: {
              type: String
          }
      };
  }

  connectedCallback() {
      super.connectedCallback();
      // get text from the template inside the element
      const templateText = this.querySelector('template').innerHTML;
      // create an iframe
      const iframe = document.createElement('iframe');
      // insert into the document
      this.shadowRoot.insertBefore(iframe, this.shadowRoot.querySelector('markdown-element'));
      const iframeDoc = iframe.contentWindow.document;
      // write styles and template contents to iframe (only add styles if accessible in the shadow DOM)
      const styleEl = this.shadowRoot.querySelector('style');
      iframe.contentWindow.document.write(`
          ${styleEl ? this.shadowRoot.querySelector('style').outerHTML : ''}
          ${templateText}
      `);
      // set the iframe height to 0, then a custom height depending on the size of the elements
      iframe.height = 0;
      iframe.height = iframeDoc.body.scrollHeight + 20;
      // compensate for whitespace offset, weird ="" HTML, and whitespace
      this.text = templateText.replace(/\n\s{8}/g, '\n').replace(/=""/g, '').trim();
      // set the markdown, wrapping the code in an HTML code block
      this.markdown = '```html\n' + this.text + '\n```';
  }

  copyToClipboard() {
      const textarea = document.createElement('textarea');
      textarea.textContent = this.text;
      document.body.appendChild(textarea);
      textarea.select()
      document.execCommand('copy');
      document.body.removeChild(textarea);
  }
}

window.customElements.define(AudioDemo.is, AudioDemo);
