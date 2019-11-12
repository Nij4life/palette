import getStorageTool from './components/menu/menu.js';
import CanvasClass from './components/canvas/canvas.js';

getStorageTool();
const canvas = document.getElementById('canvas');
const instanceCanvas = new CanvasClass(canvas);

// временно. кнопка очистки local
const button = document.createElement('button');
button.style.cssText = 'position: absolute; top: 10%; right: 0'
button.textContent = 'Clear localStorage. Click and refresh page';
document.body.append(button);
button.onclick = () => {
    localStorage.clear();
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', (e) => {

    instanceCanvas.toggleMouseDown();
    instanceCanvas.actionSwitch(e);
});

canvas.addEventListener('mouseup', () => {
    instanceCanvas.setDefault();
});

canvas.addEventListener('mousemove', (e) => {
    instanceCanvas.actionSwitch(e);
})

canvas.addEventListener('mouseleave', () => {
    instanceCanvas.setDefault();
});

window.addEventListener('load', () => {
    const url = localStorage.getItem('canvas');
    const ctx = canvas.getContext('2d');

    if (url) {
      const img = new Image();

      img.src = url;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    } else {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  });

  // on unload save canvas
  window.addEventListener('unload', () => {
    localStorage.setItem('canvas', canvas.toDataURL());
  });
