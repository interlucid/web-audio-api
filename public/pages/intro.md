# Web Audio API Tutorial

![waveform](/images/waveform.png)

**Note: Chrome is recommended for audio demos**

## What is it?

The Web Audio API allows users to control audio in browsers. Previously, audio could be embedded in browsers, but more complex controls that modify audio (such as reverb, delay, or other effects that might be used in DAWs) were only available through the use of plugins. This API allows developers to exercise native control over audio in the browser.

### Features

- **modular routing**: the web audio API is manipulated throught the use of modular nodes, which can easily be added, removed, and rearranged
- **native to the browser**: all web audio API functionality is intended to be native to the browser (for now, it is implemented most fully in Chrome)

## Workflow

1.  Create an audio context
2.  Create audio sources inside the context
3.  Create effects nodes
4.  Choose a final destination for the audio
5.  Connect the sources to effects and the effects to the destination

## Context

All web audio API functionality must exist inside an [`AudioContext`](audio-context). A single `AudioContext` can contain many [`AudioNode`](audio-node) objects but each `AudioNode` can only exist inside a single `AudioContext`.

To begin, create a context:

```js
const context = new AudioContext();
```

## Nodes

Nodes are an essential feature of the web audio API.  Each sound requires the use of several nodes, each with different purposes.

### Source Nodes

Sources are the beginning of the audio API chain.  Sources can be oscillators ([`OscillatorNode`](oscillator-node)) or samples ([`AudioBufferSourceNode`](audio-buffer-source-node)).  Each of these nodes can only be used once.  After use, the node must be discarded and replaced if another sound is required.

Example using an oscillator node:

```js
const oscillatorNode = context.createOscillator();
// nodes contain a reference to their context
console.log(oscillatorNode.context)
// number of inputs is 0 for source nodes
console.log(oscillatorNode.numberOfInputs)
```

### Effects Nodes

Add effects nodes to modify the sound of the input.

```js
const gainNode = new GainNode(context);
const connectedNode = oscillatorNode.connect(gainNode);
```

### Destination Nodes

Connect the last node so far to the destination (usually sound output):

```js
connectedNode.connect(context.destination);
```

Now a sound is read to be played.

## Demo

Here is a simple demo that uses a context, oscillator, and destination.  Notice how a new oscillator node is created each time the start button is clicked:

<demo-snippet>
    <template>
        <button onclick="startAudio()">Start</button>
        <button onclick="endAudio()">Stop</button>
        <script>
            const context = new AudioContext();
            let oscillatorAudioNode;
            const startAudio = function() {
                // allow the user to play sound
                context.resume();
                if(oscillatorAudioNode) oscillatorAudioNode.stop();
                // create an oscillator node
                oscillatorAudioNode = context.createOscillator();
                // connect it to the destination
                oscillatorAudioNode.connect(context.destination);
                // start the oscillator
                oscillatorAudioNode.start();
            }
            const endAudio = function() {
                oscillatorAudioNode.stop();
            }
        </script>
    </template>
</demo-snippet>