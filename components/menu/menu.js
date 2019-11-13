import setCurrentColor from '../palette/palette.js';

const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu__item');

// I dont know, why eslint that said. I use this vars in function (closure)

// eslint-disable-next-line no-unused-vars
let tool = 'pencil';

//input
const input = document.createElement('input');
input.type = 'color';
input.style.cssText = 'position: absolute; display: block; width: 100%; height: 100%';
Array.from(menuItems).filter(el => el.id === 'choose')[0].append(input);

// functions
function setTool(id) {
    tool = id;
    setStorageTool(id);
}

function setStorageTool(tool) {
    localStorage.setItem('tool', tool);
}

function getStorageTool() {
    let checkTool = localStorage.getItem('tool');
    if (checkTool) {
        document.getElementById(checkTool).classList.add('active');
    } else {
        setTool('pencil');
        document.getElementById('pencil').classList.add('active');
    }
}

function hoistToLi({ target }) {
    const li = target.closest('.menu__item');
    if (li && li.id !== 'choose') {
        removeActiveClass();
        setActiveClass(target);
        setTool(target.id);
    }
}

function removeActiveClass() {
    menuItems.forEach(el => el.classList.remove('active'));
}

function setActiveClass(target) {
    target.classList.add('active');
}

function searchMenu__item(id) {
    return document.getElementById(id);
}

function serviceHotKeys(id) {
    const target = searchMenu__item(id);
    if (id === 'choose') {
        input.click();
    } else {
        setTool(id);
        removeActiveClass();
        setActiveClass(target);
    }
}

function hotKeys(e) {
    if (e.shiftKey) {
        switch (e.code) {
            case 'KeyP': serviceHotKeys('pencil'); break;
            case 'KeyB': serviceHotKeys('bucket'); break;
            case 'KeyC': serviceHotKeys('choose'); break;
            case 'KeyD': serviceHotKeys('picker'); break;
            default: break;
        }
    }
}

input.addEventListener('change', () => {
    setCurrentColor(input.value);
    document.querySelector('.current-color span').click();
});

menu.addEventListener('click', (e) => {
    hoistToLi(e);
})

document.addEventListener('keydown', (e) => {
    hotKeys(e);
})

export default getStorageTool;
