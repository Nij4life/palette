import getInstanceLocalStorage from './localStorage.js';
import {ACTIVE, TOOL, CHOOSE, COLOR, PICKER, BUCKET, PENCIL} from './variables.js';

const LocalStorageInstance = getInstanceLocalStorage();

class MenuActions {
    constructor() {
        this.activeTool = this.getStorage();
        this.menuItems = document.querySelectorAll('.canvas-action');
        this.createInputElement();
    }

    createInputElement() {
        this.inputElement = document.createElement('input');
        this.inputElement.type = COLOR;
        Array.from(this.menuItems).filter(el => el.id === CHOOSE)[0].append(this.inputElement);
    }

    removeActiveClass() {
        this.menuItems.forEach(el => el.classList.remove(ACTIVE));
    }

    setActiveClass(target) {
        target.classList.add(ACTIVE);
    }

    setActiveTool(tool) {
        this.activeTool = tool;
    }

    changeActiveTool(target) {
        this.removeActiveClass();
        this.setActiveClass(target);
        this.setActiveTool(target.id);
    }

    setStorage() {
        LocalStorageInstance.setData(TOOL, this.activeTool);
    }

    getStorage() {
        const tool = LocalStorageInstance.getDataByType(TOOL);
        // не понимаю, почему простая проверка if (tool) не проходит! Или же ошибка на методах типо this.removeActiveClass();
        if (tool === BUCKET || tool === PICKER) {
            this.setActiveClass(document.getElementById(tool));
            return tool;
        } else {
            this.setActiveClass(document.getElementById(PENCIL));
            return this.activeTool = PENCIL;
        }
    }

    handleMenuAction(target) {
        const li = target.closest('.canvas-action');
        if (!li || li.id === CHOOSE) return;
        this.changeActiveTool(target);
    }


    serviceHotKeys(id) {
        const target = document.getElementById(id)
        if (id === CHOOSE) {
            this.inputElement.click();
        } else {
            this.changeActiveTool(target)
        }
    }

    handleHotKeys(e) {
        if (e.shiftKey) {
            switch (e.code) {
                case 'KeyP': this.serviceHotKeys(PENCIL); break;
                case 'KeyB': this.serviceHotKeys(BUCKET); break;
                case 'KeyC': this.serviceHotKeys(CHOOSE); break;
                case 'KeyD': this.serviceHotKeys(PICKER); break;
            }
        }
    }
}

export default MenuActions;
