// import getInstanceLocalStorage from './localStorage.js';
// import {ACTIVE, TOOL, CHOOSE, COLOR, PICKER, BUCKET, PENCIL} from './variables.js';

class PaletteClass {
    constructor() {
        this.currentColorDiv = document.querySelector('.current-color .colors-item');
        this.previousColorsWrap = document.querySelector('.previous-colors');
        this.previousColorsCollection = document.querySelector('.previous-colors').getElementsByClassName('colors-item');
    }

    setCurrentColorDivBackground(color) {
        this.currentColorDiv.style.background = color;
    }

    getColor(target) {
        return getComputedStyle(target).backgroundColor.replace(')', ', 255)');
    }

    checkDivColor(target) {
        return (target.classList.contains('colors-item')) ? true : false;
    }

    hasColor() {
        if (this.previousColorsCollection.length === 0) {
            return false;
        } else {
            for(let el of this.previousColorsCollection) {
               if (el.style.background === this.currentColorDiv.style.background) return true;
            }
            return false;
        }
    }

    limitPreviousColor() {
        if (this.previousColorsCollection.length > 3) {
            this.previousColorsWrap.lastElementChild.remove();
        }
    }

    createPreviousColor() {
        const div = document.createElement('div');
        div.classList.add('colors-item');
        div.style.background = getComputedStyle(this.currentColorDiv).backgroundColor;
        this.previousColorsWrap.prepend(div);
    }

    handlePalette({target}) {
        if (!this.checkDivColor(target)) return;

        this.setCurrentColorDivBackground(this.getColor(target));

        if (this.hasColor()) {
            return;
        } else {
            this.createPreviousColor();
            this.limitPreviousColor();
        }
    }
}

export default PaletteClass;
