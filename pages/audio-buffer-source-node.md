# AudioBufferSourceNode

## What is it?

`AudioBufferSourceNode` is a source [`AudioNode`](audio-node) that plays back a recorded sound.

## Demo

<audio-demo>
    <template>
        <div>
            <button onclick="playDrums(0)">Hi-hat</button>
            <button onclick="playDrums(1)">Kick</button>
            <button onclick="playDrums(2)">Snare</button>
            <button onclick="stop()">Stop</button>
        </div>
        <div>
            Playback rate: <input type="range" min="-100" max="100" value="0" oninput="changePlaybackRate(value)">
        </div>
        <div>
            Detune: <input type="range" min="-100" max="100" value="0" oninput="changeDetune(value)">
        </div>
        <div>
            <button onclick="toggleLoop()">Toggle Loop</button>
        </div>
        <div>
            Loop start: <input type="range" min="0" max="100" value="0" oninput="changeLoopStart(value)">
        </div>
        <div>
            Loop end: <input type="range" min="0" max="1000" value="0" oninput="changeLoopEnd(value)">
        </div>
        <script>
            const audioBufferSourceNodeContext = new AudioContext();
            const drumKitSoundNames = [
                'hi-hat',
                'kick',
                'snare'
            ];
            const settings = {
                detune: 0,
                loop: false,
                loopStart: 0,
                loopEnd: 100,
                playbackRate: 1
            }
            const drumKitBuffers = [];
            // loop through the sounds we want to import
            for(let soundName of drumKitSoundNames) {
                // fetch them from the file system
                fetch('./sounds/drums/' + soundName + '.wav')
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
            let audioBufferSourceNode;
            const playDrums = (index) => {
                // allow the user to play sound
                audioBufferSourceNodeContext.resume();
                if(audioBufferSourceNode) audioBufferSourceNode.stop();
                // create a new AudioBufferSourceNode
                audioBufferSourceNode = audioBufferSourceNodeContext.createBufferSource();
                // set the buffer to the appropriate index
                audioBufferSourceNode.buffer = drumKitBuffers[index];
                // connect the buffer node to the destination
                audioBufferSourceNode.connect(audioBufferSourceNodeContext.destination);
                // set the detune value
                audioBufferSourceNode.detune.setValueAtTime(settings.detune, audioBufferSourceNodeContext.currentTime);
                // set whether or not the node loops
                audioBufferSourceNode.loop = settings.loop;
                // set loop start and end
                audioBufferSourceNode.loopStart = settings.loopStart;
                audioBufferSourceNode.loopEnd = settings.loopEnd;
                // set playback rate
                audioBufferSourceNode.playbackRate.setValueAtTime(settings.playbackRate, audioBufferSourceNodeContext.currentTime);
                // start playing the sound
                audioBufferSourceNode.start();
            }
            const stop = () => {
                if(audioBufferSourceNode) audioBufferSourceNode.stop();
            }
            const changePlaybackRate = (playbackRate) => {
                settings.playbackRate = Math.pow(10, playbackRate / 100);
                audioBufferSourceNode.playbackRate.setValueAtTime(settings.playbackRate, audioBufferSourceNodeContext.currentTime);
            }
            const changeDetune = (detune) => {
                settings.detune = detune;
                audioBufferSourceNode.detune.setValueAtTime(detune, audioBufferSourceNodeContext.currentTime);
            }
            const toggleLoop = () => {
                settings.loop = !settings.loop;
                audioBufferSourceNode.loop = settings.loop;
            }
            const changeLoopStart = (loopStart) => {
                settings.loopStart = loopStart / 1000;
                audioBufferSourceNode.loopStart = loopStart;
            }
            const changeLoopEnd = (loopEnd) => {
                settings.loopEnd = loopEnd / 1000;
                audioBufferSourceNode.loopEnd = loopEnd;
            }
        </script>
    </template>
</audio-demo>

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

It will play until the end of the buffer or until its `stop()` function is called.  As with the [`OscillatorNode`](oscillator-node), a new node must be instantiated every time a sound is to be started.

### Playback Rate

The `playbackRate` property controls the low resolution adjustment of the sound buffer pitch and speed as a multiplier of the original clip length in seconds.  The default value is 1 (the clip plays at the original speed).

You can set the detune by calling the `setValueAtTime()` function on the `playbackRate` [`AudioParam`](./audio-params).  For example, to set the `playbackRate` to `2` (so the loop plays twice as fast):


```javascript
audioBufferSourceNode.playbackRate.setValueAtTime(2, context.currentTime);
```

### Detune

The `detune` property controls the high resolution adjustment of the sound buffer pitch (and speed), measured in [cents][1].  100 cents is equal to one [semitone](https://en.wikipedia.org/wiki/Semitone).  The default value is `0`.

[1]: https://en.wikipedia.org/wiki/Cent_(music)

You can set the detune by calling the `setValueAtTime()` function on the `detune` [`AudioParam`](./audio-params).  For example, to set the detune to `50` (halfway to the next semi-tone):

```javascript
audioBufferSourceNode.detune.setValueAtTime(50, context.currentTime);
```

### Loop

The `loop` property is a boolean that determines whether or not the sound buffer plays again after it completes.  It is `false` by default.  To set to `true`:

```javascript
audioBufferSourceNode.loop = true;
```

### Loop Start

The `loopStart` property determines how many seconds into the sound loops will begin to play.  To set loops to start playing `1` second into the sound buffer:

```javascript
audioBufferSourceNode.loopStart = 1;
```

### Loop End

The `loopEnd` property determines how many seconds into the sound loops will stop playing.  To set loops to stop playing `2` seconds into the sound buffer:

```javascript
audioBufferSourceNode.loopEnd = 2;
```
