import { PENCIL, BUCKET, PICKER } from './variables.js';
import getInstanceLocalStorage from './localStorage.js';

const LocalStorageInstance = getInstanceLocalStorage();

class CanvasClass {
    constructor(canvas, scale = 16) {
        this.canvas = canvas;
        this.scale = scale;
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = this.canvas.getContext('2d');

        this.tool = PENCIL;
        this.color = new ImageData(new Uint8ClampedArray([0, 128, 0, 255]), 1, 1);

        this.startPosition = null;
        this.isMouseDown = false;
    }

    toggleMouseDown() {
        this.isMouseDown = !this.isMouseDown;
    }

    getStorage() {
        const url = LocalStorageInstance.getDataByType('canvas');

        if (url) {
            const img = new Image();

            img.src = url;
            img.onload = () => this.context.drawImage(img, 0, 0);

        } else {
            this.context.fillStyle = 'white';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    setStorage() {
        LocalStorageInstance.setData('canvas', this.canvas.toDataURL());
    }

    setColor(color) {
        this.color = this.imageRgbaToData(color);
    }

    imageDataToRgba(color) {
        return `rgba(${color.data[0]}, ${color.data[1]}, ${color.data[2]}, ${color.data[3]})`;
    }

    imageRgbaToData(color) {
        return new ImageData(new Uint8ClampedArray(color.match(/\d+/g)), 1, 1);
    }

    getPixelPosition({ offsetX, offsetY }) {
        const x = Math.floor(offsetX / this.scale);
        const y = Math.floor(offsetY / this.scale);
        return { x, y };
    }

    getPixelColor({ x, y }) {
        return this.context.getImageData(x, y, 1, 1);
    }

    setPixelColor({ x, y }, imageData) {
        this.context.putImageData(imageData, x, y);
    }

    isEqualColor(imageDataA, imageDataB) {
        for (let i = 0; i < imageDataA.data.length; i += 1) {
            if (imageDataA.data[i] !== imageDataB.data[i]) return false;
        }
        return true;
    }

    bresenhamDraw(startPosition, endPosition) {
        // Translate coordinates
        let xs = startPosition.x;
        let ys = startPosition.y;
        const xe = endPosition.x;
        const ye = endPosition.y;

        // Define differences and error check
        const dx = Math.abs(xe - xs);
        const dy = Math.abs(ye - ys);
        const sx = (xs < xe) ? 1 : -1;
        const sy = (ys < ye) ? 1 : -1;
        let err = dx - dy;

        while (!((xs === xe) && (ys === ye))) {
            const e2 = 2 * err;
            const position = { x: xs, y: ys };

            this.setPixelColor(position, this.color);

            if (e2 > -dy) {
                err -= dy; xs += sx;
            }

            if (e2 < dx) {
                err += dx; ys += sy;
            }
        }
    }

    draw(e, currentColor) {
        const newPosition = this.getPixelPosition(e);

        if (!this.startPosition) this.startPosition = newPosition;

        if (this.startPosition.x === newPosition.x && this.startPosition.y === newPosition.y) {
            this.setColor(currentColor);
            this.setPixelColor(this.startPosition, this.color);
        } else {
            this.bresenhamDraw(this.startPosition, newPosition);
            this.startPosition = newPosition;
        }
    }

    floodFill(x, y, startColor, replaceColor) {
        if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) return;

        const tempColor = this.getPixelColor({ x, y });

        if (this.isEqualColor(tempColor, startColor)
            && !this.isEqualColor(tempColor, replaceColor)) {

            this.setPixelColor({ x, y }, replaceColor);
            this.floodFill(x + 1, y, startColor, replaceColor);
            this.floodFill(x, y + 1, startColor, replaceColor);
            this.floodFill(x - 1, y, startColor, replaceColor);
            this.floodFill(x, y - 1, startColor, replaceColor);
        }
    }

    bucket(e, currentColor) {
        const position = this.getPixelPosition(e);
        const color = this.getPixelColor(position);
        this.setColor(currentColor);
        this.floodFill(position.x, position.y, color, this.color);
    }

    pickColor(e, Palette) {
        if (e.type === 'mousemove') return;

        const position = this.getPixelPosition(e);
        this.color = this.getPixelColor(position);

        const currentColor = this.imageDataToRgba(this.color);
        Palette.setCurrentColorDivBackground(currentColor);
        if (Palette.hasColor()) {
            return;
        } else {
            Palette.createPreviousColor();
            Palette.limitPreviousColor();
        }
    }

    setDefault() {
        this.isMouseDown = false;
        this.startPosition = null;
    }

    getColorFromDiv(currentColor) {
        return getComputedStyle(currentColor).backgroundColor.replace(')', ', 255)');
    }

    actionSwitch(e, activeTool, currentColor, Palette) {
        if (this.isMouseDown) {
            switch (activeTool) {
                case PENCIL: this.draw(e, this.getColorFromDiv(currentColor)); break;
                case BUCKET: this.bucket(e, this.getColorFromDiv(currentColor)); break;
                case PICKER: this.pickColor(e, Palette); break;
                default: break;
            }
        }
    }
}

export default CanvasClass;
