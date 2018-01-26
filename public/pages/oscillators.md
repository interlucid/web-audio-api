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

```html
const oscillatorNode = context.createOscillator();
```

### Frequency

Frequency is a low resolution adjustment of the oscillator's pitch, measured in [hertz](https://en.wikipedia.org/wiki/Hertz).  The default frequency on `OscillatorNode`s is 440 Hz (middle A).

You can set the frequency with the following parameter:

### Detune

### Type

## Demo

<demo-snippet>
    <template>
        <button class="int-button" onclick="startTone()">Start</button>
        <button class="int-button" onclick="endTone()">Stop</button>
        <br>
        <button class="int-button" onclick="changeTo('sine')">Sine</button>
        <button class="int-button" onclick="changeTo('square')">Square</button>
        <button class="int-button" onclick="changeTo('sawtooth')">Sawtooth</button>
        <button class="int-button" onclick="changeTo('triangle')">Triangle</button>
        <script>
            const context = new AudioContext();
            let oscillatorNode;
            const startTone = function() {
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
        </script>
    </template>
</demo-snippet>