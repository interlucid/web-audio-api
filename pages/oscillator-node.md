# OscillatorNode

## What is it?

`OscillatorNode` is a source [`AudioNode`](audio-node) that generates a signal like physical oscillators.  `OscillatorNode` has several settings that can change how it sounds without even using effect.

### Oscillators

Physical oscillators are electronic circuits that produce a signal that moves back and forth, or oscillates.  We hear this signal and interpret it as sound.

## Demo

<audio-demo>
    <template>
        <div>
            <button onclick="startTone()">Start</button>
            <button onclick="endTone()">Stop</button>
        </div>
        <div>
            <button onclick="changeTo('sine')">Sine</button>
            <button onclick="changeTo('square')">Square</button>
            <button onclick="changeTo('sawtooth')">Sawtooth</button>
            <button onclick="changeTo('triangle')">Triangle</button>
        </div>
        <div>
            Frequency: <input type="range" min="330" max="1450" value="840" oninput="changeFrequency(value)">
        </div>
        <div>
            Detune: <input type="range" min="-100" max="100" value="0" oninput="changeDetune(value)">
        </div>
        <script>
            const context = new AudioContext();
            let oscillatorNode;
            const startTone = () => {
                // stop the previous oscillator from playing
                if(oscillatorNode) oscillatorNode.stop();
                // create a new oscillator node (the old node is discarded)
                oscillatorNode = context.createOscillator();
                // connect it to the destination
                oscillatorNode.connect(context.destination);
                // start the oscillator
                oscillatorNode.start();
            }
            const endTone = () => {
                // stop the oscillator
                oscillatorNode.stop();
            }
            const changeTo = (type) => {
                oscillatorNode.type = type;
            }
            const changeFrequency = (frequency) => {
                // this helps us perceive the sound as being linear
                oscillatorNode.frequency.setValueAtTime(Math.pow(2, frequency / 100), context.currentTime);
            }
            const changeDetune = (detune) => {
                oscillatorNode.detune.setValueAtTime(detune, context.currentTime);
            }
        </script>
    </template>
</audio-demo>

## Implementation

An `OscillatorNode` is created with the following code (assuming you have an [`AudioContext`](./audio-context)):

```javascript
const oscillatorNode = audioContext.createOscillator();
```

The oscillator then needs to be connected to the next node in the chain.  In this case, we can simply connect it to the final audio destination (sound output):

```javascript
oscillatorNode.connect(audioContext.destination);
```

Once connected to the destination, it can be started and stopped only once:

```javascript
oscillatorNode.start();
// insert timer or user input
oscillatorNode.stop();
```

Once an `OscillatorNode` has been stopped, it needs to be reinstantiated with the `createOscillator()` function.  The old `OscillatorNode` will be garbage collected.

### Type

There are several kinds of oscillators.  Oscillator type is defined by the waveform the generated sound makes.  The following waveform types are more well known in the music world and are already implemented in the Web Audio API:

- `sine` (plain tone sound)
- `square` (more shrill)
- `sawtooth` (very buzzy/distorted)
- `triangle` (slightly buzzy)

You can set the oscillator by assigning the `type` property on an `OscillatorNode`.  For example, to use a `sawtooth` oscillator:

```javascript
oscillatorNode.type = 'sawtooth';
```

### Frequency

Frequency is a low resolution adjustment of the oscillator's pitch, measured in [hertz](https://en.wikipedia.org/wiki/Hertz) (Hz).  The [human hearing range](https://en.wikipedia.org/wiki/Hearing_range#Humans) extends from 20 to 20,000 Hz.  However, frequencies lower than 20 Hz can be used to modulate other oscillators creating an effect called [low frequency oscillation](https://en.wikipedia.org/wiki/Low-frequency_oscillation). The default value for the `OscillatorNode`'s `frequency` property is 440 Hz (middle A).

You can set the frequency by calling the `setValueAtTime()` function on the `frequency` [`AudioParam`](./audio-params).  For example, to set the frequency to `220` (an octave lower than middle A):

```javascript
oscillatorNode.frequency.setValueAtTime(220, context.currentTime);
```

### Detune

Detune is a high resolution adjustment of the oscillator's pitch, measured in [cents][1].  100 cents is equal to one [semitone](https://en.wikipedia.org/wiki/Semitone).  The default value for the `OscillatorNode`'s `detune` property is 0 (no fine tuning of pitch).

[1]: https://en.wikipedia.org/wiki/Cent_(music)

You can set the detune by calling the `setValueAtTime()` function on the `detune` [`AudioParam`](./audio-params).  For example, to set the detune to `50` (halfway to the next semi-tone):

```javascript
oscillatorNode.detune.setValueAtTime(50, context.currentTime);
```
