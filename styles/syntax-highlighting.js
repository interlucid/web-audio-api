const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="syntax-highlighting">

  <template>

    <style>

			code,
			iframe {
				display: inline-block;
				padding: 0.1em 0.15em;
				margin: 0 .1em;
				background: var(--code-bg-color);
				border: 1px solid var(--code-border-color);
				border-radius: .2em;
				font-family: Consolas, Inconsolata, "Liberation Mono", Courier, monospace;
				line-height: 1;
			}

			pre code,
			iframe {
				display: block;
				padding: .5em .8em;
				white-space: pre;
				overflow: auto;
				margin: 0;
        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;
			}

      .token.comment,
      .token.prolog,
      .token.doctype,
      .token.cdata {
        color: #95a0ab;
      }

      .token.punctuation {
        color: #999;
      }

      .namespace {
        opacity: .7;
      }

      .token.property,
      .token.tag,
      .token.boolean,
      .token.number,
      .token.constant,
      .token.symbol,
      .token.deleted {
        color: #fe5c75;
      }

      .token.selector,
      .token.attr-name,
      .token.string,
      .token.char,
      .token.builtin,
      .token.inserted {
        color: #bce864;
      }

      .token.operator,
      .token.entity,
      .token.url,
      .language-css .token.string,
      .style .token.string {
        color: #f2b373;
      }

      .token.atrule,
      .token.attr-value,
      .token.keyword {
        color: #6ecef7;
      }

      .token.function {
        color: #fa77e7;
      }

      .token.regex,
      .token.important,
      .token.variable {
        color: #f5b030;
      }

      .token.important,
      .token.bold {
        font-weight: bold;
      }
      .token.italic {
        font-style: italic;
      }

      .token.entity {
        cursor: help;
      }

    </style>

  </template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
