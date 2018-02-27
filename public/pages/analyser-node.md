# AnalyserNode

## What is it?

AnalyserNode provides information on frequency and time-domain (waveform) of its input.  It is useful for creating visualizations that correspond to the input.

### Fast Fourier Transform

This element makes use of an algorithm called the [Fast Fourier Transform](https://en.wikipedia.org/wiki/Fast_Fourier_transform).  This algorithm can be used to produce a frequency represenation of a signal from a time representation of a signal (which is the kind we usually encounter).  In this case, this means not only can we create a waveform visualization of an audio source, we can also create a frequency visualization.

## Implementation

`AnalyserNode` can be created as follows (assuming an [`AudioContext`](audio-context) is defined):

```javascript
const analyserNode = context.createAnalyser();
```

It needs to be connected to a source and a destination if the audio needs to be heard.

### Fast Fourier Transform Size

The `fftSize` property of `AnalyserNode` sets the size of the frequency domain for the Fast Fourier Transform algorithm.  In simpler words, the result of the transform will extend over a range of values, and `fftSize` decides how large that range will be.

`fftSize` must be a power of 2 between 2<sup>5</sup> and 2<sup>15</sup> inclusive.  By default it is 2<sup>11</sup> (2048).

It can be set as follows:

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

The `minDecibels` property 

### Maximum Decibels



## Demo

<audio-demo>
    <template>
        <audio src="/sounds/songs/options.m4a" controls controlsList="nodownload"></audio>
        <canvas id="waveform" width="700" height="100"></canvas>
        <canvas id="frequencies" width="700" height="100"></canvas>
        <script>
            const context = new AudioContext();
            let mediaElementAudioSourceNode;
            // create a new media source node using the <audio> element
            mediaElementAudioSourceNode = context.createMediaElementSource(document.querySelector('audio'));
            // create an IIR filter node
            const analyserNode = context.createAnalyser();
            // connect the media source to the IIR filter
            mediaElementAudioSourceNode.connect(analyserNode);
            // connect the IIR filter to the destination
            analyserNode.connect(context.destination);
            // define the length of result buffers
            analyserNode.fftSize = 2048;
            let bufferLength = analyserNode.frequencyBinCount;
            const WIDTH = 700;
            const HEIGHT = 100;
            const waveformArray = new Uint8Array(bufferLength);
            const waveformCanvas = document.querySelector('#waveform');
            const wfCanvasContext = waveformCanvas.getContext('2d');
            const frequenciesArray = new Uint8Array(bufferLength);
            const frequenciesCanvas = document.querySelector('#frequencies');
            const fCanvasContext = frequenciesCanvas.getContext('2d');
            const visualize = () => {
                drawWaveFormVisual = requestAnimationFrame(visualize);
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
                analyserNode.getByteFrequencyData(frequenciesArray);
                fCanvasContext.clearRect(0, 0, WIDTH, HEIGHT);
                const barWidth = (WIDTH / bufferLength) * 2.5;
                let barHeight;
                let x2 = 0;
                for(var i = 0; i < bufferLength; i++) {
                    barHeight = frequenciesArray[i] / 2;
                    fCanvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ', ' + (barHeight + 100) + ', ' + (barHeight + 100) + ')';
                    fCanvasContext.fillRect(x2, HEIGHT - barHeight / 2, barWidth, barHeight);
                    x2 += barWidth + 1;
                }
            };
            visualize();
        </script>
    </template>
</audio-demo>