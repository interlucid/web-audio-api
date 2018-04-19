# BiquadFilterNode

## What is it?

`BiquadFilterNode` is an effects node that encapsulates several low order filter functions.

## Demo

<audio-demo>
    <template>
        <button onclick="startAudio()">Start</button>
        <button onclick="endAudio()">Stop</button>
        <div>
            <button onclick="changeTo('lowpass')">Lowpass</button>
            <button onclick="changeTo('highpass')">Highpass</button>
            <button onclick="changeTo('bandpass')">Bandpass</button>
            <button onclick="changeTo('lowshelf')">Lowshelf</button>
            <button onclick="changeTo('highshelf')">Highshelf</button>
            <button onclick="changeTo('peaking')">Peaking</button>
            <button onclick="changeTo('notch')">Notch</button>
            <button onclick="changeTo('allpass')">Allpass</button>
        </div>
        <div>
            Frequency: <input type="range" min="33" max="140" value="84" oninput="changeFrequency(value)">
        </div>
        <div>
            Detune: <input type="range" min="-100" max="100" value="0" oninput="changeDetune(value)">
        </div>
        <div>
            Q (quality): <input type="range" min="-40" max="30" value="0" oninput="changeQ(value)">
        </div>
        <div>
            Gain: <input type="range" min="-40" max="40" value="0" oninput="changeGain(value)">
        </div>
        <script>
            const biquadFilterNodeContext = new AudioContext();
            let audioBufferSourceNode;
            const biquadFilterNode = biquadFilterNodeContext.createBiquadFilter();
            const startAudio = function() {
                // allow the user to play sound
                biquadFilterNodeContext.resume();
                if(audioBufferSourceNode) audioBufferSourceNode.stop();
                // create an audio buffer source node
                audioBufferSourceNode = biquadFilterNodeContext.createBufferSource();
                // fill the buffer with white noise (random values between -1.0 and 1.0)
                arrayBuffer = biquadFilterNodeContext.createBuffer(2, biquadFilterNodeContext.sampleRate * 3, biquadFilterNodeContext.sampleRate);
                for (let channel = 0; channel < arrayBuffer.numberOfChannels; channel++) {
                    let nowBuffering = arrayBuffer.getChannelData(channel);
                    for (let i = 0; i < arrayBuffer.length; i++) {
                        nowBuffering[i] = Math.random() * 2 - 1;
                    }
                }
                audioBufferSourceNode.buffer = arrayBuffer;
                audioBufferSourceNode.loop = true;
                // connect the audio buffer source node to the gain node
                audioBufferSourceNode.connect(biquadFilterNode);
                // connect the gain node to the destination
                biquadFilterNode.connect(biquadFilterNodeContext.destination);
                // start the oscillator
                audioBufferSourceNode.start();
            }
            const endAudio = function() {
                audioBufferSourceNode.stop();
            }
            const changeTo = function(type) {
                biquadFilterNode.type = type;
            }
            const changeFrequency = (frequency) => {
                // this helps us perceive the sound as being linear
                biquadFilterNode.frequency.setValueAtTime(Math.pow(2, frequency / 10), biquadFilterNodeContext.currentTime);
            }
            const changeDetune = (detune) => {
                biquadFilterNode.detune.setValueAtTime(detune, biquadFilterNodeContext.currentTime);
            }
            const changeQ = (Q) => {
                biquadFilterNode.Q.setValueAtTime(Math.pow(10, Q / 10), biquadFilterNodeContext.currentTime);
            }
            const changeGain = (gain) => {
                biquadFilterNode.gain.setValueAtTime(gain, biquadFilterNodeContext.currentTime);
            }
        </script>
    </template>
</audio-demo>

## Implementation

`BiquadFilterNode` has a number of properties that can be customized.  As with other effects nodes, it needs to be created.  Then a source needs to connect to it and it needs to be connected to a destination.

```javascript
const biquadFilterNode = context.createBiquadFilter();
oscillatorNode.connect(biquadFilterNode);
biquadFilterNode.connect(context.destination);
```

### Type

There are several different types of filters that can be applied using the `BiquadFilterNode`.  The first few have to do with sounds that get cut out of the mix by the filter, leaving the rest of the sounds to pass through:

- `lowpass`: allows only sounds below the `frequency` value to be heard (the low values pass through)
- `highpass`: allows only sounds above the `frequency` value to be heard (the high values pass through)
- `bandpass`: allows only sounds within a certain distance from the `frequency` value to be heard (only values in that band pass through)
- `notch`: allows only sounds that are at least a certain distance away from the `frequency` value to be heard (essentially the opposite of `bandpass`; there is a notch cut out of the sounds)

For these types, the `Q` parameter adjusts how intense or narrow the cutoff frequency is.  Low `Q` values are more mellow and high `Q` values are more harsh.  `gain` is not used with these filter types.

The next three types have to do with changing the gain of a certain selection of sounds:

- `lowshelf`: modifies the gain of sounds below the `frequency` value
- `highshelf`: modifies the gain of sounds above the `frequency` value
- `peaking`: modifies the gain of sounds within a certain distance of the `frequency` value

These three types make use of the `gain` value to either increase or decrease the volume of the selected sounds.  `Q` is not used with `lowshelf` or `highshelf` but is used to control the width (harshness) or `peaking` band.

There is one more type which doesn't fit in with the others:

- `allpass`: no one really knows what it does, so they use [super scientific words to describe it](http://en.wikipedia.org/wiki/All-pass_filter) thinking no one will catch on

If I ever figure out how it works and can explain it in a simple way, I'll let you know.

### Frequency

The frequency in the current filtering algorithm measured in Hertz.  This is similar to the frequency property on [OscillatorNode](oscillator-node) in that it is a broad adjustment, but instead of changing pitch, it is changing the amount of the effect being applied.

To set the frequency to 440 Hz:

```javascript
biquadFilterNode.frequency.setValueAtTime(440, biquadFilterNodeContext.currentTime);
```

### Detune

The detune in the current filtering algorithm measured in cents.  This is similar to the detune property on [OscillatorNode](oscillator-node) in that it is a fine adjustment, but instead of changing pitch, it is changing the amount of the effect being applied.

To set the amount of detune to 50 cents:

```javascript
biquadFilterNode.detune.setValueAtTime(50, biquadFilterNodeContext.currentTime);
```

### Q

The Q (quality) adjustment of the current filtering algorithm.  There is no unit for Q, but the values range from .0001 to 1,000.

To set the value of Q to 10:

```javascript
biquadFilterNode.Q.setValueAtTime(10, biquadFilterNodeContext.currentTime);
```

### Gain

The filter gain is only used on a few modes (low shelf, high shelf, and peaking).  It controls how much of the filter effect is applied while these modes are selected.  The values range from -40 to 40 decibels.

To set the gain to 10 dB:

```javascript
biquadFilterNode.gain.setValueAtTime(10, biquadFilterNodeContext.currentTime);
```
