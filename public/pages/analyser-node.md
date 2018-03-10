# AnalyserNode

## What is it?

`AnalyserNode` provides information on frequency and time-domain (waveform) of its input.  It is useful for creating visualizations that correspond to the input.

### Fast Fourier Transform

This element makes use of an algorithm called the [Fast Fourier Transform](https://en.wikipedia.org/wiki/Fast_Fourier_transform).  This algorithm can be used to produce a frequency represenation of a signal from a time representation of a signal (which is the kind we usually encounter).  In this case, this means not only can we create a waveform visualization of an audio source, we can also create a frequency visualization.

## Demo

_Like the song?  Download the album for free [here](https://interlucid.bandcamp.com/album/acquisition)._

<audio-demo>
    <template>
        <audio src="/sounds/songs/options.m4a" controls controlsList="nodownload" onplay="visualize()"></audio>
        <div>
            Fast Fourier Transform Size (density): <input type="range" min="5" max="15" value="10" oninput="changeFFTSize(value)">
        </div>
        <div>
            Min Decibels (bar variation): <input type="range" min="-200" max="200" value="-100" oninput="changeMinDecibels(value)">
        </div>
        <div>
            Max Decibels (bar height): <input type="range" min="-200" max="200" value="-30" oninput="changeMaxDecibels(value)">
        </div>
        <div>
            Smoothing Time Constant (bar jitter): <input type="range" min="0" max="100" value="80" oninput="changeSmoothingTimeConstant(value)">
        </div>
        <canvas id="waveform" width="700" height="150"></canvas>
        <canvas id="frequencies" width="700" height="150"></canvas>
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
            let bufferLength = analyserNode.frequencyBinCount;
            const WIDTH = 700;
            const HEIGHT = 150;
            let waveformArray = new Uint8Array(bufferLength);
            const waveformCanvas = document.querySelector('#waveform');
            const wfCanvasContext = waveformCanvas.getContext('2d');
            let frequenciesArray = new Uint8Array(bufferLength);
            const frequenciesCanvas = document.querySelector('#frequencies');
            const fCanvasContext = frequenciesCanvas.getContext('2d');
            const visualize = () => {
                // only animate while playing (reduces CPU load)
                if(!audioNode.paused) requestAnimationFrame(visualize);
                // time domain visualization
                analyserNode.getByteTimeDomainData(waveformArray);
                wfCanvasContext.clearRect(0, 0, WIDTH, HEIGHT);
                wfCanvasContext.lineWidth = 2;
                wfCanvasContext.strokeStyle = '#fff';
                wfCanvasContext.beginPath();
                const sliceWidth = WIDTH * 1.0 / bufferLength;
                let x = 0;
                for(let i = 0; i < bufferLength; i++) {
                    const v = waveformArray[i] / 128.0;
                    const y = v * HEIGHT / 2;
                    if(i === 0) {
                        wfCanvasContext.moveTo(x, y);
                    } else {
                        wfCanvasContext.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
                wfCanvasContext.lineTo(waveformCanvas.width, waveformCanvas.height/2);
                wfCanvasContext.stroke();
                // frequencies visualization
                analyserNode.getByteFrequencyData(frequenciesArray);
                fCanvasContext.clearRect(0, 0, WIDTH, HEIGHT);
                const barWidth = (WIDTH / bufferLength) * 2.5;
                let barHeight;
                let x2 = 0;
                for(let i = 0; i < bufferLength; i++) {
                    barHeight = frequenciesArray[i] / 2;
                    fCanvasContext.fillStyle = `rgb(${Math.min(barHeight + 150, 255)}, ${Math.min(barHeight + 150, 255)}, ${Math.min(barHeight + 150, 255)})`;
                    fCanvasContext.fillRect(x2, HEIGHT - barHeight, barWidth, barHeight);
                    x2 += barWidth + 1;
                }
            };
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
</audio-demo>

## Implementation

`AnalyserNode` can be created as follows (assuming an [`AudioContext`](audio-context) is defined):

```javascript
const analyserNode = context.createAnalyser();
```

It needs to be connected to a source and a destination if the audio needs to be heard.

### Fast Fourier Transform Size

The `fftSize` property of `AnalyserNode` sets the size of the frequency domain for the Fast Fourier Transform algorithm.  In simpler words, the result of the transform will extend over a range of values, and `fftSize` decides how large that range will be.

`fftSize` must be a power of 2 between 2<sup>5</sup> and 2<sup>15</sup> inclusive.  By default it is 2<sup>11</sup> (2048).

It can be set to `1024` as follows:

```javascript
analyserNode.fftSize = 1024;
```

### Frequency Binary Count

The `frequencyBinCount` property is a read only value that is always half of `fftSize`.  It repesents the number of values that the `getByteFrequencyData()` and `getFloatFrequencyData()` will copy into a provided array.

This property is an estimation of the resolution of the visualization as it represents how many pieces of data will be produced by analyzing functions.

Since it is read only, `frequencyBinCount` can only be accessed:

```javascript
let count = analyserNode.frequencyBinCount;
```

### Minimum Decibels

The `minDecibels` property sets the minimum value of the results generated by `getByteFrequencyData()`.  There aren't strict limits on it besides it needing to be less than `maxDecibels`, but it's not very meaningful outside of the range `-200` (extremely quiet) to `200` (extremely loud).  By default it is `-100`.

To set it to `-90`:

```javascript
analyserNode.minDecibels = -90;
```

### Maximum Decibels

The `maxDecibels` property sets the minimum value of the results generated by `getByteFrequencyData()`.  There aren't strict limits on it besides it needing to be more than `minDecibels`, but it's not very meaningful outside of the range `-200` (extremely quiet) to `200` (extremely loud).  By default it is `-30`.

To set it to `-50`:

```javascript
analyserNode.maxDecibels = -50;
```

### Smoothing Time Constant

The `smoothingTimeConstant` property sets the amount of smoothing that occurs between animation frames.  The amount of smoothing ranges from `0` to `1`, where `0` is not smoothed at all and `1` is smoothed so much the result never changes.  It is `.8` by default.

To set it to `.5`:

```javascript
analyserNode.smoothingTimeConstant = .5;
```
