class LocalStorage {
    setData(type, data) {
        localStorage.setItem(type, data);
    }

    getDataByType(type) {
        return localStorage.getItem(type);
    }
}

const instance = new LocalStorage();

export default function getInstanceLocalStorage() {
    return instance;
  }
