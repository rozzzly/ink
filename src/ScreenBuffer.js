import * as stringWidth from 'string-width';
import * as ansiEscapes from 'ansi-escapes';

/**
 * The fastest way to generate a blank string is to pre-cache a huge string then
 * use `.substring(0, DESIRED_LENGTH - 1)` to grab a chunk of it
 *
 * @see https://jsperf.com/const-vs-join/7
 *
 * If a user hits some issue because his screen is > 1024 columns
 *      1. wtf
 *      2. PR support yourself
 *      3. seriously wtf?! do you have a 16K monitor and 12pt font?
 *      4. explain your use case/circumstances in your PR plzz
 */
const BLANK_LINE = ' '.repeat(1024);

const LINE_BREAK_REGEX = /\r?\n/g;

class ScreenBuffer {
    /**
     * @public
     * @type {number} width num of columns in this buffer
     */
    width;
    /**
     * @public
     * @type {number} height num of rows in this buffer
     */
    height;

    /**
     * @public
     * @type {string[]} lines an array of all the lines in the screen
     */
    lines;

    /**
     * Creates a new ScreenBuffer
     * @public
     * @constructor
     * @param {number} width num of cols in this buffer
     * @param {number} height num of rows in this buffer
     */
    constructor(width, height) {
        this.height = height;
        this.width = width;

        this.lines = [];

        const line = BLANK_LINE.substring(0, width - 1);
        for (let i = 0; i < height; i++) {
            // safe to push the same instance of line because strings are immutable
            this.lines.push(line);
        }
    }

    /**
     * Creates a new ScreenBuffer with content identical to
     * the given one but safe for mutation
     *
     * @public
     * @returns {ScreenBuffer}
     */
    clone() {
        const nScreenBuffer = new ScreenBuffer(this.width, this.height);
        nScreenBuffer.lines = [
            // again, this is safe because a new array is being created
            // and although its' items are being copied, those items
            // are strings and therefore are immutable
            ...this.lines
        ];
        return nScreenBuffer;
    }

    /**
     * Verifies that the buffer is valid.
     * A valid buffer contains `ScreenBuffer.height` lines each of which have a width
     * of `ScreenBuffer.width` and do not contain newlines (\r\n OR \n).
     *
     * NOTE: the _width_ of the lines is checked, NOT the `.length`
     * @see [string-width](https://www.npmjs.com/package/string-width)
     *
     * TODO: See if I ever actually use this method before creating its` counterpart
     *
     * @public
     * @returns {boolean} true when buffer is valid (see above) false otherwise
     */
    verify() {
        if (this.lines.length !== this.height) {
            return false;
        } else  {
            for (let i = 0; i < this.height; i++) {
                if (stringWidth(this.lines[i]) !== this.width || LINE_BREAK_REGEX.test(this.lines[i])) {
                    return false;
                }
            }
            return true;
        }
    }

    /**
     * Returns an array of (0-based) line indexes that are different between `this` and `other`
     * Returns false when buffers are identical
     * Returns true when buffers have different dimensions
     * @public
     * @param {ScreenBuffer} other the ScreenBuffer to diff against
     * @return {number[]|boolean} indexes of different lines / true if buffers have different dimensions / false when buffers are identical
     */
    diffLines(other) {
        if (this.width !== other.width || this.height !== other.height || this.lines.length !== other.lines.length) {
            return true;
        } else {
            const diff = [];
            for (let i = 0; i < this.height; i++) {
                if (this.lines[i] !== other.lines[i]) {
                    diff.push(i);
                }
            }
            return (diff.length) ? diff : false;
        }
    }

    _diffType(diff) {
        // some how determine fastest way to write the update?
        let isClose = false;
        const zoneSize = Math.floor(this.height / 4);

    }

    writeDiff(stream, diffedLines) {
        // write ansi sequence to position cursor
        // then the changes lines
        // then flush
        //
        //
        // and some how do it... smart?
    }

}
