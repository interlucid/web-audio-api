const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="int-styles">

	<template>

		<style>

			:root {
				--bg-color: #222;
				--code-bg-color: #333;
				--code-border-color: #666;
			}

			html {
				font-family: "Helvetica Neue", "Helvetica", "Source Sans Pro", sans-serif;
				margin: 0;
				background-color: var(--bg-color);
				color: #ddd;
			}

			body {
				margin: 0;
			}
			
			:host {
				font-size: 1.1em;
				
				--demo-snippet-demo: {
					background: none;
					font-family: "Helvetica Neue", "Helvetica", "Source Sans Pro", sans-serif;
				};

				--demo-snippet-code: {
					background: none;
					font-size: 1.1em;
					font-family: Consolas, Inconsolata, "Liberation Mono", Courier, monospace;
				};
			}

			* {
				line-height: 1.4em;
				word-wrap: break-word;
			}

			[hidden] {
				display: none !important;
			}

			a {
				color: #5cbef1;
				text-decoration: none;
			}

			a:hover {
				text-decoration: underline;
			}

			a:visited {
				color: #aa80ff;
			}

			paper-tabs {
				--paper-tabs-selection-bar-color: white;
			}

			.int-vertical-container > * {
				display: block;
				width: 100%;
			}

			.int-vertical-container > * + * {
				margin-top: .7em;
			}

			.int-page {
				max-width: 800px;
				margin: 1em auto;
			}

			button,
			.int-button,
			demo-snippet button {
				font-size: 1em;
				text-align: center;
				display: inline-block;
				padding: 10px 20px;
				text-transform: uppercase;
				color: #eee;
				background-color: #000;
				border-radius: .2em;
				border: solid #eee 1px;
				cursor: pointer;
				text-decoration: none;
			}

			button:hover,
			.int-button:hover,
			demo-snippet button:hover {
				background-color: #555;
				text-decoration: none;
			}

			.int-button:active {
				background-color: #eee;
				color: #000;
			}

			.int-button:visited {
				color: inherit;
			}

			.int-button[disabled] {
				color: #777;
				border-color: #777;
				cursor: default;
			}

			.int-button[disabled]:hover {
				background-color: #000;
			}

			.int-button--block {
				display: block;
			}

			footer {
				padding: 1em;
				text-align: center;
				color: #7d7d7d;
			}

			/* add some space to IDs to offset header */

			:target:before {
				display: block;
				content: " ";
				padding-top: 50px;
			}

			:target {
				margin-top: -20px;
			}

			h1 {
				font-size: 4.4em;
				font-weight: 100;
			}

			h2 {
				font-weight: 200;
				font-size: 2.7em;
			}

			h3 {
				font-weight: 500;
				font-size: 1.6em;
				letter-spacing: .04em;
				color: #999;
				text-transform: uppercase;
			}

			h4 {
				font-weight: 300;
				font-size: 1.3em;
			}

			p,
			li,
			input,
			textarea,
			pre {
				font-size: 1em;
				font-weight: 400;
				letter-spacing: .02em;
			}

			input,
			textarea {
				resize: none;
				box-sizing: border-box;
				padding: .4em;
				border-radius: .2em;
				background-color: inherit;
				color: white;
				border: solid grey .05em;
			}

			input:focus,
			textarea:focus {
				outline: none;
				border-color: white;
			}

			img {
				width: 100%;
				height: 100px;
			}

			h1,
			h2,
			h3,
			h4,
			p {
				margin: 0;
			}


			/* TODO: replace this obnoxious thing with :matches or equivalent once implemented */
			/* See http://caniuse.com/#search=%3Amatches */

			p + * {
				margin-top: 1em;
			}

			* + h2 {
				margin-top: .7em;
			}

			* + h3,
			* + h4 {
				margin-top: 1.5em;
			}

			h1 + *,
			h2 + *,
			h3 + *,
			h4 + * {
				margin-top: .5em;
			}

		</style>

	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
