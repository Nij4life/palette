const palette = document.querySelector('.palette');

function setCurrentColor(color) {
    document.querySelector('.current-color span').style.background = color;
}

function useLocalStorage() {
    if (localStorage.getItem('color')) {
        setCurrentColor(localStorage.getItem('color'));
    } else {
        const current = document.querySelector('.current-color span');
        const color = getColor(current);
        setCurrentColor(color);
        setStorageColor(color);
    }

    if (localStorage.getItem('previousColor')) {
        const previousColor = [];
        previousColor.push(...JSON.parse(localStorage.getItem('previousColor')));
        previousColor.map(color => createPreviousColor(color));
    }
}
useLocalStorage();

function setStorageColor(color) {
    localStorage.setItem('color', color);
}

function setStorageColors(color) {
    let previousColor = [];
    if (localStorage.getItem('previousColor')) {
        previousColor.push(...JSON.parse(localStorage.getItem('previousColor')));
    }
    previousColor.push(color);
    localStorage.setItem('previousColor', JSON.stringify(previousColor));
}

function removeLocalStorage(removeColor) {
    let previousColor = [];
    if (localStorage.getItem('previousColor')) {
        previousColor.push(...JSON.parse(localStorage.getItem('previousColor')));
    }
    if (previousColor.length > 3) {
        const index = previousColor.indexOf(removeColor);
        previousColor.splice(index, 1);
        localStorage.setItem('previousColor', JSON.stringify(previousColor));
    }
}

function getPreviousColors() {
    return Array.from(document.querySelectorAll('.previous-colors span'));
}

function hasColor(color) {
    const previousColors = getPreviousColors();
    color = color.slice(0, -6);
    color += ')';
    return (previousColors) ? previousColors.some(el => el.style.background === color) : false;

}

// возможно переписать еще rgb в rgba
function getColor(target) {
    const color = getComputedStyle(target).backgroundColor.replace(')', ', 255)');
    return color;
}

function checkSpan(target) {
    return (target.classList.contains('colors__item')) ? true : false;
}

function limitPreviousColor() {
    const previousColors = getPreviousColors();
    if (previousColors.length > 3) {
        const removeColor = document.querySelector('.previous-colors').firstElementChild.nextElementSibling;
        removeLocalStorage(removeColor.style.background);
        removeColor.remove()
    }
}

function createPreviousColor(color) {
    const span = document.createElement('span');
    span.classList.add('colors__item');
    span.style.background = color;
    document.querySelector('.previous-colors').append(span);
}

function addPreviousColor({ target }) {
    if (!checkSpan(target)) return;

    const color = getColor(target);
    setCurrentColor(color);
    setStorageColor(color);

    if (hasColor(color)) {
        return;
    } else {
        createPreviousColor(color);
        limitPreviousColor();
        setStorageColors(color);
    }
}

palette.addEventListener('click', (e) => {
    addPreviousColor(e);
})

export default setCurrentColor;
