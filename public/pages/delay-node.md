# DelayNode

## What is it?

`DelayNode` is an effects node that delays the playback of its input.

## Implementation

`DelayNode` is one of the simplest nodes to use.  Once created, it needs a source to connect to it and then it needs to be connected to a destination.

```javascript
const delayNode = context.createDelay();
oscillatorNode.connect(delayNode);
delayNode.connect(context.destination);
```

### Delay Time

The amount of delay time that can be set ranges from `0` to the maximum time that was decided when the `DelayNode` was constructed.  For example, to set a delay of `.7` seconds:

```javascript
delayNode.delay.setValueAtTime(.7, gainNodeContext.currentTime);
```

## Demo

<demo-snippet>
    <template>
        <button onclick="startAudio()">Start</button>
        <button onclick="endAudio()">Stop</button>
        <div>
            Delay: <input type="range" min="0" max="100" value="50" oninput="changeDelay(value)">
        </div>
        <script>
            const delayNodeContext = new AudioContext();
            let oscillatorNode;
            const delayNode = delayNodeContext.createDelay();
            delayNode.delayTime.setValueAtTime(.5, delayNodeContext.currentTime);
            const startAudio = function() {
                // allow the user to play sound
                delayNodeContext.resume();
                if(oscillatorNode) oscillatorNode.stop();
                // create an oscillator node
                oscillatorNode = delayNodeContext.createOscillator();
                // connect the oscillator node to the delay node
                oscillatorNode.connect(delayNode);
                // connect the delay node to the destination
                delayNode.connect(delayNodeContext.destination);
                // start the oscillator
                oscillatorNode.start();
            }
            const endAudio = function() {
                oscillatorNode.stop();
            }
            const changeDelay = (delay) => {
                delayNode.delayTime.setValueAtTime(delay / 100, delayNodeContext.currentTime);
            }
        </script>
    </template>
</demo-snippet>