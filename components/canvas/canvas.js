class CanvasClass {
    constructor(canvas, scale = 16) {
        this.canvas = canvas;
        this.scale = scale;
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = this.canvas.getContext('2d');

        this.tool = this.getStorageTool();
        this.color = this.getStorageColor();

        this.startPosition = null;
        this.isMouseDown = false;
    }

    toggleMouseDown() {
        this.isMouseDown = !this.isMouseDown;
    }

    getStorageTool() {
        const tool = localStorage.getItem('tool');
        return (tool) ? tool : 'pencil';
    }

    getStorageColor() {
        const color = localStorage.getItem('color');
        if (color) {
            return this.imageRgbaToData(color);
        } else {
            return new ImageData(new Uint8ClampedArray([0, 128, 0, 255]), 1, 1);
        }
    }

    setTool() {
        return this.tool = localStorage.getItem('tool');
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

            this.setColor(localStorage.getItem('color'));
            this.setPixelColor(position, this.color);

            if (e2 > -dy) {
                err -= dy; xs += sx;
            }

            if (e2 < dx) {
                err += dx; ys += sy;
            }
        }
    }

    draw(e) {
        const newPosition = this.getPixelPosition(e);

        if (!this.startPosition) this.startPosition = newPosition;

        if (this.startPosition.x === newPosition.x && this.startPosition.y === newPosition.y) {
            this.setColor(localStorage.getItem('color'));
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
            this.setColor(localStorage.getItem('color'));
            this.setPixelColor({ x, y }, replaceColor);
            this.floodFill(x + 1, y, startColor, replaceColor);
            this.floodFill(x, y + 1, startColor, replaceColor);
            this.floodFill(x - 1, y, startColor, replaceColor);
            this.floodFill(x, y - 1, startColor, replaceColor);
        }
    }

    bucket(e) {
        const position = this.getPixelPosition(e);
        const color = this.getPixelColor(position);
        this.setColor(localStorage.getItem('color'));
        this.floodFill(position.x, position.y, color, this.color);
    }

    pickColor(e) {
        const position = this.getPixelPosition(e);
        this.color = this.getPixelColor(position);
        localStorage.setItem('color', this.imageDataToRgba(this.color));

        const currentColor = this.imageDataToRgba(this.color);
        const current = document.querySelector('.current-color span');
        current.style.background = currentColor;
    }

    setDefault() {
        this.isMouseDown = false;
        this.startPosition = null;
    }

    actionSwitch(e) {
        if (this.isMouseDown) {
            switch (this.setTool()) {
                case 'pencil': this.draw(e); break;
                case 'bucket': this.bucket(e); break;
                case 'picker': this.pickColor(e); break;
                default: break;
            }
        }
    }
}

export default CanvasClass;
