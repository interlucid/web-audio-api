# DynamicsCompressorNode

## What is it?

`DynamicsCompressorNode` compresses its sound input.  Compression reduces the volume of louder parts of a signal.  This is useful for making audio signals that vary in volume sound more uniform.  For example, if you have a vocal track in a song, it may be hard to hear some of the quieter words.

If the resulting signal is too quiet compared to other signals, you can add some gain to it (usually as part of the compressor itself).

## Demo

_Like the song?  Download the album for free [here](https://interlucid.bandcamp.com/album/acquisition)._

<audio-demo>
    <template>
        <audio src="./sounds/songs/options.m4a" controls controlsList="nodownload"></audio>
        <button onclick="toggleCompression()">Turn compression <span id="compression">off</span></button>
        <br>
        Threshold (<span id="threshold">-24</span> dB):
        <input type="range" min="-100" max="0" value="-24" oninput="changeThreshold(value)">
        Knee (<span id="knee">30</span> dB): 
        <input type="range" min="0" max="40" value="30" oninput="changeKnee(value)">
        Ratio (<span id="ratio">12</span>:1):
        <input type="range" min="1" max="20" value="12" oninput="changeRatio(value)">
        Attack (<span id="attack">0.003</span> s):
        <input type="range" min="0" max="1000" value="3" oninput="changeAttack(value)">
        Release (<span id="release">0.250</span> s):
        <input type="range" min="0" max="1000" value="250" oninput="changeRelease(value)">
        Reduction (<span id="reduction"></span> dB):
        <div id="meter" style="background-color: cyan; height: 1em;"></div>
        <script>
            const context = new AudioContext();
            let mediaElementAudioSourceNode;
            // create a new media source node using the <audio> element
            const audioNode = document.querySelector('audio');
            mediaElementAudioSourceNode = context.createMediaElementSource(audioNode);
            // create a dynamics compressor node
            const dynamicsCompressorNode = context.createDynamicsCompressor()
            // connect the media source to the threshold
            mediaElementAudioSourceNode.connect(dynamicsCompressorNode);
            // connect the compressor node to the destination
            dynamicsCompressorNode.connect(context.destination);
            let compressionIsOn = true;
            // toggle compression
            const toggleCompression = () => {
                mediaElementAudioSourceNode.disconnect();
                mediaElementAudioSourceNode.connect(compressionIsOn ? context.destination : dynamicsCompressorNode);
                document.querySelector('#compression').innerText = compressionIsOn ? 'on' : 'off';
                compressionIsOn = !compressionIsOn;
            }
            // change threshold
            const changeThreshold = (threshold) => {
                dynamicsCompressorNode.threshold.setValueAtTime(threshold, context.currentTime)
                document.querySelector('#threshold').innerText = threshold;
            }
            // change knee
            const changeKnee = (knee) => {
                dynamicsCompressorNode.knee.setValueAtTime(knee, context.currentTime)
                document.querySelector('#knee').innerText = knee;
            }
            // change ratio
            const changeRatio = (ratio) => {
                dynamicsCompressorNode.ratio.setValueAtTime(ratio, context.currentTime)
                document.querySelector('#ratio').innerText = ratio;
            }
            // change attack
            const changeAttack = (attack) => {
                dynamicsCompressorNode.attack.setValueAtTime(attack / 1000, context.currentTime)
                document.querySelector('#attack').innerText = attack / 1000;
            }
            // change release
            const changeRelease = (release) => {
                dynamicsCompressorNode.release.setValueAtTime(release / 1000, context.currentTime)
                document.querySelector('#release').innerText = release / 1000;
            }
            // display feedback on reduction
            window.setInterval(() => {
                document.querySelector('#meter').style.width = `${Math.min(Math.abs(dynamicsCompressorNode.reduction) * 5, 100)}%`;
                document.querySelector('#reduction').innerText = parseInt(dynamicsCompressorNode.reduction);
            }, 10)
        </script>
    </template>
</audio-demo>

## Implementation

`DynamicsCompressorNode` can be created as follows (assuming an [`AudioContext`](audio-context) is defined):

```javascript
const dynamicsCompressorNode = context.createDynamicsCompressor();
```

It needs to be connected to a source and a destination.

### Threshold

The `threshold` property holds a decibel level that decides at what point in gain (loudness) compression will start to take affect.  Audio at a decibel level below the threshold will not be compressed, but audio at a decibel level above the threshold will be compressed.

The `threshold` property ranges from `-100` to `0` dB.  The default value is `-24` dB.

It can be set to `-40` dB as follows:

```javascript
dynamicsCompressorNode.threshold.setValueAtTime(-40, context.currentTime);
```

### Knee

The `knee` property holds a decibel value that decides how much the signal will smoothly transition from uncompressed audio (below the threshold) to the compressed audio.  If the knee is set to 0, the transition will be hard, with no transition between compressed and uncompressed signal.  The higher the value, the more extreme the signal will be for the compression to be noticed.

The `knee` property ranges from `0` to `40` dB.  The default value is `30` dB.

It can be set to `35` dB as follows:

```javascript
dynamicsCompressorNode.knee.setValueAtTime(35, context.currentTime);
```

### Ratio

The `ratio` property holds a value that determines how much the audio above the threshold will be compressed.  It is a ratio of volume reduction in dB needed for every 1 dB of change in the signal.  A 1:1 ratio means that the audio will not be compressed at all, and an ∞:1 ratio means that the audio will be compressed so much that the signal will never exceed the threshold value.

Generally it's a good idea to start compressing audio with a lower ratio, such as 3:1, then increase the ratio only as needed.  Individual instruments or voices generally benefit from higher ratios, and mixes generally benefit from lower ratios.

The `ratio` property ranges from `1` to `20`.  The default value is `12`.

To set a 3:1 ratio:

```javascript
dynamicsCompressorNode.ratio.setValueAtTime(3, context.currentTime);
```

### Reduction

The `reduction` property can be used to monitor how much gain reduction is being applied by the compressor.  It can be easier to tell how much compression is being applied when monitoring the `reduction` property compared to simply listening to the output signal.

The amount of reduction will be between -20 and 0 dB.

It can be accessed as follows:

```javascript
console.log(dynamicsCompressorNode.reduction);
```

### Attack

The `attack` property determines how quickly the compressor reacts to increases in gain in the input signal.  Specifically, if the gain increases suddenly, the `attack` property holds the number of seconds it will take for the compressor node to reduce the gain by 10 dB.

Generally it's a good idea to start with slower attack times, like 50-75 ms (0.05-0.075 seconds).  A very quick attack can dull otherwise interesting sounds.

The `attack` property ranges from `0` to `1` seconds.  The default value is `0.003` seconds.

To set an attack of `0.05` seconds:

```javascript
dynamicsCompressorNode.attack.setValueAtTime(0.05, context.currentTime);
```

### Release

The `release` property is very similar to the attack property, except that instead of controlling how soon the compressor node reacts to increases in gain, it determines how soon the compressor node reacts to _decreases_ in gain.  Put in other words, it represents how soon the amount of compression is reduced once it is no longer needed.

Generally faster release times are recommended for quick sounds and percussive instruments.  Slower release times are recommended for more flowing instruments like strings.  A slower release can also prevent a pumping effect on bass.

The `release` property ranges from `0` to `1` seconds.  The default value is `0.25` seconds.

To set a release of `0.1` seconds:

```javascript
dynamicsCompressorNode.release.setValueAtTime(0.1, context.currentTime);
```
