# GainNode

## What is it?

`GainNode` is an effects node that modifies the volume of its input.

## Demo

<audio-demo>
    <template>
        <button onclick="startAudio()">Start</button>
        <button onclick="endAudio()">Stop</button>
        <div>
            Gain: <input type="range" min="0" max="100" value="50" oninput="changeGain(value)">
        </div>
        <script>
            const gainNodeContext = new AudioContext();
            let oscillatorNode;
            const gainNode = gainNodeContext.createGain();
            const startAudio = function() {
                // allow the user to play sound
                gainNodeContext.resume();
                if(oscillatorNode) oscillatorNode.stop();
                // create an oscillator node
                oscillatorNode = gainNodeContext.createOscillator();
                // connect the oscillator node to the gain node
                oscillatorNode.connect(gainNode);
                // connect the gain node to the destination
                gainNode.connect(gainNodeContext.destination);
                // start the oscillator
                oscillatorNode.start();
            }
            const endAudio = function() {
                oscillatorNode.stop();
            }
            const changeGain = (gain) => {
                gainNode.gain.setValueAtTime(gain / 100, gainNodeContext.currentTime);
            }
        </script>
    </template>
</audio-demo>

## Implementation

`GainNode` is one of the simplest nodes to use.  Once created, it needs a source to connect to it and then it needs to be connected to a destination.

```javascript
const gainNode = context.createGain();
oscillatorNode.connect(gainNode);
gainNode.connect(context.destination);
```

### Gain

The amount of gain that can be set is from `0` to `1`.  For example, to set a gain level of `.7`:

```javascript
gainNode.gain.setValueAtTime(.7, gainNodeContext.currentTime);
```
