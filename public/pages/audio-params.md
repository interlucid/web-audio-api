# AudioParam

## What is it?

`AudioParam` is an interface for the values of an `AudioNode` property.  Often, in order to change properties, you will have to call a function of the corresponding `AudioParam`.

## Implementation

One of the most common functions you might need to call on `AudioParam` is `setValueAtTime()`.  For example, to immediately set the value of `oscillatorNode`'s `detune` property to `50`:

```javascript
oscillatorNode.detune.setValueAtTime(50, context.currentTime);
```

Because of the unreliability of functions like `setTimeout()`, you should always use `setValueAtTime()` when handling timing of audio API modules.

### Set value at time
