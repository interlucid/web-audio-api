# ConvolverNode

## What is it?

`ConvolverNode` is an effects node that performs a linear [convolution](https://en.wikipedia.org/wiki/Convolution) on the input node.  A convolution in this case takes two audio buffers and performs an operation to produce a third audio buffer which is sent to the output.  This is useful to create effects like [reverb](https://en.wikipedia.org/wiki/Reverberation).

## Implementation

You can create a `ConvolverNode` using its constructor (not an `AudioContext` function!).  Once created, it needs a source to connect to it and then it needs to be connected to a destination.

```javascript
const convolverNode = new ConvolverNode(context);
oscillatorNode.connect(convolverNode);
convolverNode.connect(context.destination);
```

### Buffer

The buffer on a `ConvolverNode` holds the audio used to convolve the input.  In the case of reverb, this kind of audio is called an [impulse response](https://en.wikipedia.org/wiki/Impulse_response).

Storing file data in the buffer requires that the file be fetched with AJAX and converted to an [`AudioBuffer`](audio-buffer).  This can be done with either native JavaScript or a library, but the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is concise and effective:

```javascript
// fetch the file from the server and return a response object to the next .then()
fetch('/sounds/impulse-responses/' + soundName + '.wav')
    // retrieve and return an ArrayBuffer to the next .then()
    .then(response => response.arrayBuffer())
    .then(buffer => {
        // decode the ArrayBuffer as an AudioBuffer
        audioContext.decodeAudioData(buffer, decoded => {
            // store the resulting AudioBuffer
            convolverNode.buffer = decoded;
        });
    });
```

### Normalize

The `normalize` property is a boolean value that decided whether the `ConvolverNode` will attempt to normalize the output sound when using different convolving buffers.  It defaults to `true`, but you can set it to `false` as follows:

```javascript
convolverNode.normalize = false;
```

## Demo

<demo-snippet>
    <template>
        <div>
            <button onclick="startAudio()">Start</button>
            <button onclick="endAudio()">Stop</button>
        </div>
        <div>
            <button onclick="toggleReverb()">Toggle Reverb</button>
            <button onclick="toggleNormalize()">Toggle Normalize</button>
        </div>
        <script>
            const convolverNodeContext = new AudioContext();
            let oscillatorNode;
            let reverb = true;
            let impulseResponse;
            const convolverNode = new ConvolverNode(convolverNodeContext);
            // fetch the file from the server and return a response object to the next .then()
            fetch('/sounds/impulse-responses/stpatricks.wav')
                // retrieve and return an ArrayBuffer to the next .then()
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    // decode the ArrayBuffer as an AudioBuffer
                    convolverNodeContext.decodeAudioData(buffer, decoded => {
                        // store the resulting AudioBuffer
                        convolverNode.buffer = decoded;
                        impulseResponse = decoded;
                    });
                });
            const startAudio = function() {
                // allow the user to play sound
                convolverNodeContext.resume();
                if(oscillatorNode) oscillatorNode.stop();
                // create an oscillator node
                oscillatorNode = convolverNodeContext.createOscillator();
                if(reverb) {
                    // connect the oscillator node to the convolver node
                    oscillatorNode.connect(convolverNode);
                    // connect the convolver node to the destination
                    convolverNode.connect(convolverNodeContext.destination);
                } else {
                    oscillatorNode.connect(convolverNodeContext.destination)
                }
                // start the oscillator
                oscillatorNode.start();
            }
            const endAudio = function() {
                oscillatorNode.stop();
            }
            const toggleReverb = () => {
                reverb = !reverb;
            }
            const toggleNormalize = () => {
                convolverNode.normalize = !convolverNode.normalize;
                convolverNode.buffer = impulseResponse;
            }
        </script>
    </template>
</demo-snippet>