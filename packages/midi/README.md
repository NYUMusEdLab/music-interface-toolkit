# @musedlab/midi

This package contains functions for working with MIDI data in javascript.

## toBytes

```
toBytes(value: number, length: number): Uint8Array
```

Encode a numeric value as a specified number of unsigned bytes. The value is
assumed to be a non-negative integer small enough to be properly represented by
the number of bytes specified.

| Parameter | Type   |                                     |
| --------- | ------ | ----------------------------------- |
| `value`   | number | The value to encode                 |
| `length`  | number | The number of bytes to encode it in |

**Return** Uint8Array &mdash; An array of bytes, starting with the most
significant byte
