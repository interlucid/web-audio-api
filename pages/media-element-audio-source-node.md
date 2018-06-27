# MediaElementAudioSourceNode

## What is it?

`MediaElementAudioSourceNode` is a source [`AudioNode`](audio-node) that takes as input an audio element on the page.  It doesn't have controls to play or pause a sound.  It needs to be used in conjuction with other `AudioNode`s in order to be useful.

## Implementation

Assuming you have an [`AudioContext`](audio-context), create the node with the following code:

```javascript
let mediaElementAudioSourceNode = audioContext.createMediaElementSource();
```

Then you can connect the node to a destination:

```javascript
mediaElementAudioSourceNode.connect(context.destination);
```

To see an example of this node used in conjuction with another node, check out the [IIRFilterNode](iir-filter-node).

## Demo

_Like the song?  Download the album for free [here](https://interlucid.bandcamp.com/album/acquisition)._

<audio-demo>
    <template>
        <audio src="./sounds/songs/options.m4a" controls controlsList="nodownload"></audio>
        <script>
            const context = new AudioContext();
            let mediaElementAudioSourceNode;
            // create a new mediaElementAudioSource node using the audio element
            mediaElementAudioSourceNode = context.createMediaElementSource(document.querySelector('audio'));
            // connect it to the destination
            mediaElementAudioSourceNode.connect(context.destination);
        </script>
    </template>
</audio-demo>