# DynamicsCompressorNode

## What is it?

`DynamicsCompressorNode` compresses its sound input.  Compression reduces the volume of louder parts of a signal.  This is useful for making audio signals that vary in volume sound more uniform.  For example, if you have a vocal track in a song, it may be hard to hear some of the quieter words.

If the resulting signal is too quiet compared to other signals, you can add some gain to it (usually as part of the compressor itself).

## Implementation

`DynamicsCompressorNode` can be created as follows (assuming an [`AudioContext`](audio-context) is defined):

```javascript
const dynamicsCompressorNode = context.createDynamicsCompressor();
```

It needs to be connected to a source and a destination.

### Threshold

The `threshold` property holds a decibel level that decides at what point in gain (loudness) compression will start to take affect.  Audio at a decibel level below the threshold will not be compressed, but audio at a decibel level above the threshold will be compressed.

The `threshold` property ranges from `0` to `100` dB.  The default value is `-24` dB.

It can be set to `-40` dB as follows:

```javascript
dynamicsCompressorNode.threshold.value = -40;
```

### Knee

The `knee` property holds a decibel value that decides how much the signal will smoothly transition from uncompressed audio (below the threshold) to the compressed audio.  If the knee is set to 0, the transition will be hard, with no transition between compressed and uncompressed signal.  The higher the value, the more extreme the signal will be for the compression to be noticed.

The `knee` property ranges from `0` to `40` dB.  The default value is `30` dB.

It can be set to `35` dB as follows:

```javascript
dynamicsCompressorNode.knee.value = 35;
```

### Ratio

The `ratio` property holds a value that determines how much the audio above the threshold will be compressed.  It is a ratio of volume reduction in dB needed for every 1 dB of change in the signal.  A 1:1 ratio means that the audio will not be compressed at all, and an ∞:1 ratio means that the audio will be compressed so much that the signal will never exceed the threshold value.

Generally it's a good idea to start compressing audio with a lower ratio, such as 3:1, then increase the ratio only as needed.  Individual instruments or voices generally benefit from higher ratios, and mixes generally benefit from lower ratios.

The `ratio` property ranges from `1` to `20` dB.  The default value is `12` dB.

To set a 3:1 ratio:

```javascript
dynamicsCompressorNode.ratio.value = 3;
```

### Reduction

The `reduction` property can be used to monitor how much gain reduction is being applied by the compressor.  It can be easier to tell how much compression is being applied when monitoring the `reduction` property compared to simply listening to the output signal.

It can be accessed as follows:

```javascript
console.log(dynamicsCompressorNode.reduction)
```

### Attack

The `attack` property determines how quickly the compressor reacts to increases in gain in the input signal.  Specifically, if the gain increases suddenly, the `attack` property holds the number of seconds it will take for the compressor node to reduce the gain by 10 dB.

Generally it's a good idea to start with slower attack times, like 50-75 ms (0.05-0.075 seconds).  A very quick attack can dull otherwise interesting sounds.

The `attack` property ranges from `0` to `1` seconds.  The default value is `0.003` seconds.

To set an attack of `0.05` seconds:

```javascript
dynamicsCompressorNode.attack.value = 0.05
```

### Release

The `release` property is very similar to the attack property, except that instead of controlling how soon the compressor node reacts to increases in gain, it determines how soon the compressor node reacts to _decreases_ in gain.  Put in other words, it represents how soon the amount of compression is reduced once it is no longer needed.

Generally faster release times are recommended for quick sounds and percussive instruments.  Slower release times are recommended for more flowing instruments like strings.  A slower release can also prevent a pumping effect on bass.

<!-- 
## Demo

_Like the song?  Download the album for free [here](https://interlucid.bandcamp.com/album/acquisition)._

<audio-demo>
    <template>
        <p><em>Workable demo coming soon...</em></p>
        <audio src="/sounds/songs/options.m4a" controls controlsList="nodownload" onplay="visualize()"></audio>
        <div>
            Fast Fourier Transform Size (density): <input type="range" min="5" max="15" value="10" oninput="changeFFTSize(value)">
        </div>
        <script>
            const context = new AudioContext();
            let mediaElementAudioSourceNode;
            // create a new media source node using the <audio> element
            const audioNode = document.querySelector('audio');
            mediaElementAudioSourceNode = context.createMediaElementSource(audioNode);
            // create an IIR filter node
            const analyserNode = context.createAnalyser();
            analyserNode.minDecibels = -150;
            // connect the media source to the IIR filter
            mediaElementAudioSourceNode.connect(analyserNode);
            // connect the IIR filter to the destination
            analyserNode.connect(context.destination);
            // define the length of result buffers
            const changeFFTSize = (fftSize) => {
                analyserNode.fftSize = Math.pow(2, fftSize);
                bufferLength = analyserNode.frequencyBinCount;
                waveformArray = new Uint8Array(bufferLength);
                frequenciesArray = new Uint8Array(bufferLength);
            }
            const changeMinDecibels = (minDecibels) => {
                if(minDecibels < analyserNode.maxDecibels) analyserNode.minDecibels = minDecibels;
            }
            const changeMaxDecibels = (maxDecibels) => {
                if(maxDecibels > analyserNode.minDecibels) analyserNode.maxDecibels = maxDecibels;
            }
            const changeSmoothingTimeConstant = (smoothingTimeConstant) => {
                analyserNode.smoothingTimeConstant = smoothingTimeConstant / 100;
            }
        </script>
    </template>
</audio-demo> -->