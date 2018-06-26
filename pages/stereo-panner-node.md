# StereoPannerNode

## What is it?

`StereoPannerNode` is an effects node changes how much of the input is sent to the right and left channels of the output (usually right and left speakers).

## Demo

<audio-demo>
    <template>
        <button onclick="startAudio()">Start</button>
        <button onclick="endAudio()">Stop</button>
        <div>
            Pan: <input type="range" min="-100" max="100" value="0" oninput="changeGain(value)">
        </div>
        <script>
            const context = new AudioContext();
            let oscillatorNode;
            const stereoPannerNode = new StereoPannerNode(context);
            const startAudio = function() {
                // allow the user to play sound
                context.resume();
                if(oscillatorNode) oscillatorNode.stop();
                // create an oscillator node
                oscillatorNode = context.createOscillator();
                // connect the oscillator node to the panner node
                oscillatorNode.connect(stereoPannerNode);
                // connect the panner node to the destination
                stereoPannerNode.connect(context.destination);
                // start the oscillator
                oscillatorNode.start();
            }
            const endAudio = function() {
                oscillatorNode.stop();
            }
            const changeGain = (pan) => {
                stereoPannerNode.pan.setValueAtTime(pan / 100, context.currentTime);
            }
        </script>
    </template>
</audio-demo>

## Implementation

`StereoPannerNode` is reasonably simple to use.  Once created, it needs a source to connect to it and then it needs to be connected to a destination.

```javascript
const stereoPannerNode = new StereoPannerNode(context);
oscillatorNode.connect(stereoPannerNode);
stereoPannerNode.connect(context.destination);
```

### Pan

The amount of pan that can be set is from `-1` (all the way to the left) to `1` (all the way to the right).  For example, to set a pan level of `.8`:

```javascript
stereoPannerNode.pan.setValueAtTime(.8, context.currentTime);
```
