import '@polymer/polymer/polymer-element.js';
import 'commonmark/dist/commonmark.js';
import 'prismjs/prism.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="markdown-element">

    <template>

        <style>

            :host {
                display: block;
            }
        
        </style>

        <slot name="markdown-html">
            <div id="content"></div>
        </slot>

    </template>

    
    

    
</dom-module>`;

document.head.appendChild($_documentContainer.content);
