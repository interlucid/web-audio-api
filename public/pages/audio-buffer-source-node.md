# AudioBufferSourceNode

## What is it?

`AudioBufferSourceNode` is a source [`AudioNode`](audio-node) that plays back a recorded sound.

## Implementation

Getting a sound from a file on the system to a playable `AudioBufferSourceNode` is rather involved.  First, assuming you have an [`AudioContext`](audio-context), create the node with the following code:

```javascript
let audioBufferSourceNode = audioContext.createBufferSource();
```

### Buffer

`AudioBufferSourceNode` contains a buffer where the information for the sound to be played is stored.  One way to import data to that buffer is by using files (as opposed to generating some kind of waveform).

Storing file data in the buffer requires that the file be fetched with AJAX and converted to an [`AudioBuffer`](audio-buffer).  This can be done with either native JavaScript or a library, but the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is concise and effective:

```javascript
// fetch the file from the server and return a response object to the next .then()
fetch('/sounds/drums/' + soundName + '.wav')
    // retrieve and return an ArrayBuffer to the next .then()
    .then(response => response.arrayBuffer())
    .then(buffer => {
        // decode the ArrayBuffer as an AudioBuffer
        audioContext.decodeAudioData(buffer, decoded => {
            // store the resulting AudioBuffer
            audioBufferSourceNode.buffer = decoded;
        });
    });
```

`fetch` returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) which should resolve to a response.  Inside the callback function (`.then()`) the response object is first converted to an `ArrayBuffer` and then to an `AudioBuffer`.  Then it is added to the `AudioBufferSourceNode`'s `buffer` property.

Once these steps have been carried out, the `AudioBufferSourceNode` can be started.

```javascript
audioBufferSourceNode.start();
```

It will play until the end of the buffer or until its `stop()` function is called.

## Demo

<demo-snippet>
    <template>
        <div>
            <button onclick="playDrums(0)">Hi-hat</button>
            <button onclick="playDrums(1)">Kick</button>
            <button onclick="playDrums(2)">Snare</button>
        </div>
        <script>
            const audioBufferSourceNodeContext = new AudioContext()
            const drumKitSoundNames = [
                'hi-hat',
                'kick',
                'snare'
            ];
            const drumKitBuffers = [];
            // loop through the sounds we want to import
            for(let soundName of drumKitSoundNames) {
                // fetch them from the file system
                fetch('/sounds/drums/' + soundName + '.wav')
                    // when we get the asynchronous response, convert to an ArrayBuffer
                    .then(response => response.arrayBuffer())
                    .then(buffer => {
                        // decode the ArrayBuffer as an AudioBuffer
                        audioBufferSourceNodeContext.decodeAudioData(buffer, decoded => {
                            // push the resulting sound to an array
                            drumKitBuffers.push(decoded);
                        });
                    });
            }
            const playDrums = (index) => {
                // allow the user to play sound
                audioBufferSourceNodeContext.resume();
                // create a new AudioBufferSourceNode
                let audioBufferSourceNode = audioBufferSourceNodeContext.createBufferSource();
                // set the buffer to the appropriate index
                audioBufferSourceNode.buffer = drumKitBuffers[index];
                // connect the buffer node to the destination
                audioBufferSourceNode.connect(audioBufferSourceNodeContext.destination);
                // start playing the sound
                audioBufferSourceNode.start();
            }
        </script>
    </template>
</demo-snippet>