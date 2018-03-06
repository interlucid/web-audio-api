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
dynamicsCompressorNode.threshold = -40;
```

### Knee

The `knee` property holds a decibel value that decides how much the signal will smoothly transition from uncompressed audio (below the threshold) to the compressed audio

The `threshold` property ranges from `0` to `100` dB.  The default value is `-24` dB.

It can be set to `-40` dB as follows:

```javascript
dynamicsCompressorNode.threshold = -40;
```

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
                for(var i = 0; i < bufferLength; i++) {
                    barHeight = frequenciesArray[i] / 2;
                    fCanvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ', ' + (barHeight + 100) + ', ' + (barHeight + 100) + ')';
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