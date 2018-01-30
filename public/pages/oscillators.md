# Oscillators

[Contents](./)

## What are they?

Oscillators are electronic circuits that produce an electronic signal that moves back and forth, or oscillates.

### Kinds of oscillators

There are several kinds of oscillators.  The following types are more well known in the music world:

- sine (plain tone sound)
- square (more shrill)
- sawtooth (very buzzy/distorted)
- triangle (slightly buzzy)

## Implementation

Oscillators are created with the following code (assuming you have an audio context):

```javascript
const oscillatorNode = context.createOscillator();
```

### Frequency

Frequency is a low resolution adjustment of the oscillator's pitch, measured in [hertz](https://en.wikipedia.org/wiki/Hertz) (Hz).  The [human hearing range](https://en.wikipedia.org/wiki/Hearing_range#Humans) extends from 20 to 20,000 Hz.  However, frequencies lower than 20 Hz can be used to create an effect called [low frequency oscillation](https://en.wikipedia.org/wiki/Low-frequency_oscillation). The default value for the `OscillatorNode`'s `frequency` property is 440 Hz (middle A).

You can set the frequency to `value` through the `frequency` [`AudioParam`](./audio-params):

```javascript
oscillatorNode.frequency.setValueAtTime(value, context.currentTime);
```

### Detune

Detune is a high resolution adjustment of the oscillator's pitch, measured in [cents][1].  Cents range from 0-100 in value.  The default value for the `OscillatorNode`'s `detune` property is 0 (no fine tuning of pitch).

[1]: https://en.wikipedia.org/wiki/Cent_(music)

You can set the detune to `value` through the `detune` [`AudioParam`](./audio-params):

```javascript
oscillatorNode.detune.setValueAtTime(value, context.currentTime);
```

### Type

## Demo

<demo-snippet>
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
            Frequency: <span id="frequency-value">440</span> <input type="range" min="0" max="20000" value="440" oninput="changeFrequency(value)">
        </div>
        <div>
            Detune: <span id="detune-value">0</span> <input type="range" min="-100" max="100" value="0" oninput="changeDetune(value)">
        </div>
        <script>
            const context = new AudioContext();
            let oscillatorNode;
            const startTone = function() {
                if(oscillatorNode) endTone();
                oscillatorNode = context.createOscillator();
                oscillatorNode.connect(context.destination);
                oscillatorNode.start();
            }
            const endTone = function() {
                oscillatorNode.stop();
            }
            const changeTo = function(type) {
                oscillatorNode.type = type;
            }
            const changeFrequency = function(frequency) {
                oscillatorNode.frequency.setValueAtTime(frequency, context.currentTime);
            }
            const changeDetune = function(detune) {
                oscillatorNode.detune.setValueAtTime(detune, context.currentTime);
            }
        </script>
    </template>
</demo-snippet>