# IIRFilterNode

## What is it?

`IIRFilterNode` is a customizeable filter node.  It allows you to use your own parameters to construct it.  You can use it if the [BiquadFilterNode](biquad-filter-node) doesn't meet your needs (it only has a few presets).

## Implementation

An `IIRFilterNode` is created with the following code (assuming you have an [`AudioContext`](./audio-context)):

```javascript
const iirFilterNode = audioContext.createIIRFilter([1], [1]);
```

`IIRFilterNode` needs a source and a destination.  You can connect a [MediaElementAudioSourceNode](media-element-audio-source-node) with the following code:

```javascript
mediaElementAudioSourceNode.connect(iirFilterNode);
```

The IIR filter then needs to be connected to a destination, which in this case is the final audio destination (sound output):

```javascript
iirFilterNode.connect(audioContext.destination);
```

### Get Frequency Response

If you want some additional information about the settings of the IIRFilterNode, you can call the `getFrequencyResponse()` function to store the magnitude and phase of the filter at various frequencies.  The function takes three parameters:

- a `Float32Array` of frequencies (in Hertz) that you want to run through the filter function
- a `Float32Array` that will store the corresponding magnitude of the frequency response of each frequency value
- a `Float32Array` that will store the corresponding phase response of each frequency value

```javascript
// create the arrays (they need to be of type Float32Array)
const frequencyArray = new Float32Array(5);
frequencyArray[0] = 100;
frequencyArray[1] = 500;
frequencyArray[2] = 1000;
frequencyArray[3] = 5000;
frequencyArray[4] = 10000;
// these are empty since they're for holding values
const magnitudeResponseOutput = new Float32Array(5);
const phaseResponseOutput = new Float32Array(5);
// call the function
iirFilterNode.getFrequencyResponse(
    frequencyArray,
    magnitudeResponseOutput,
    phaseResponseOutput
)
// print arrays that now have values in them
console.log(magnitudeResponseOutput, phaseResponseOutput);
```

## Demo

<audio-demo>
    <template>
        <audio src="/sounds/songs/options.m4a" controls controlsList="nodownload"></audio>
        <ul id="results"></ul>
        <script>
            const context = new AudioContext();
            let mediaElementAudioSourceNode;
            // create a new media source node using the <audio> element
            mediaElementAudioSourceNode = context.createMediaElementSource(document.querySelector('audio'));
            // create an IIR filter node
            const iirFilterNode = context.createIIRFilter(
                [0.1, 0.2, 0.3, 0.4, 0.5],
                [0.5, 0.4, 0.3, 0.2, 0.1]);
            // connect the media source to the IIR filter
            mediaElementAudioSourceNode.connect(iirFilterNode);
            // connect the IIR filter to the destination
            iirFilterNode.connect(context.destination);
            const frequencyArray = new Float32Array(5);
            frequencyArray[0] = 100;
            frequencyArray[1] = 500;
            frequencyArray[2] = 1000;
            frequencyArray[3] = 5000;
            frequencyArray[4] = 10000;
            const magnitudeResponseOutput = new Float32Array(5);
            const phaseResponseOutput = new Float32Array(5);
            iirFilterNode.getFrequencyResponse(
                frequencyArray,
                magnitudeResponseOutput,
                phaseResponseOutput
            )
            let results = '';
            for(let i = 0; i < frequencyArray.length; i++) {
                results += '<li>Magnitude Response: ' + magnitudeResponseOutput[i] + ', Phase Response: ' + phaseResponseOutput[i] + '</li>';
            }
            document.querySelector('#results').innerHTML = results;
        </script>
    </template>
</audio-demo>
