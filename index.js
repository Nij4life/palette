import MenuActions from './js/menuActions.js';
import CanvasClass from './js/canvas.js';
import PaletteClass from './js/palette.js';

const menuBlock = document.querySelector('.menu-actions');
const Menu = new MenuActions();

const paletteBlock = document.querySelector('.palette');
const Palette = new PaletteClass();

const canvas = document.getElementById('canvas');
const InstanceCanvas = new CanvasClass(canvas);

function linkForPalette() {
    return Palette;
}

// временно. кнопка очистки localStorage для проверок и тестов
(function clearLocalStorage() {
    const button = document.createElement('button');
    button.style.cssText = 'position: absolute; top: 10%; right: 0'
    button.textContent = 'Clear localStorage. Click and refresh page';
    document.body.append(button);
    button.onclick = () => {
        localStorage.clear();
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        Menu.removeActiveClass();
        Menu.activeTool = null;
    }
})();

// listeners for canvas
canvas.addEventListener('mousedown', (e) => {
    InstanceCanvas.toggleMouseDown();
    InstanceCanvas.actionSwitch(e, Menu.activeTool, Palette.currentColorDiv, linkForPalette());
});

canvas.addEventListener('mouseup', () => {
    InstanceCanvas.setDefault();
});

canvas.addEventListener('mousemove', (e) => {
    InstanceCanvas.actionSwitch(e, Menu.activeTool, Palette.currentColorDiv);
})

canvas.addEventListener('mouseleave', () => {
    InstanceCanvas.setDefault();
});

// listeners for palette
paletteBlock.addEventListener('click', e => Palette.handlePalette(e));
/* paletteBlock.addEventListener('click', Palette.handlePalette);   <<<<, попробовал сделать так и напаролся на this!  почему ??? */

// Listeners for Menu
menuBlock.addEventListener('click', (e) => {
    Menu.handleMenuAction(e.target);
});

// Listeners for window
window.addEventListener('keydown', (e) => {
    Menu.handleHotKeys(e);
});

window.addEventListener('load', () => {
    Menu.getStorage();
    InstanceCanvas.getStorage();
});

window.onbeforeunload = () => {
    Menu.setStorage();
    InstanceCanvas.setStorage();
};

/* Не придумал ток как правильно обработать случай, если 1ый раз рисовать, то не добавляет в previous-colors. Как правильно? */
