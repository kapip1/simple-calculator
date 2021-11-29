import { colorVariables } from './colorVariables.js';
class Calculator {
    #htmlElements = {
        keys: document.querySelectorAll('.keyboard__button'),
        toggleTheme: document.querySelector('.toggleMode__slider-input'),
        screen: document.querySelector('.calculator__screen'),
        operationScreen: document.querySelector('.calculator__operation'),
    };

    #operationString = '0';
    #operationArray = [];

    init() {
        this.#addEventsOnKeys();
        this.#updateScreen();
    }

    #addEventsOnKeys() {
        this.#htmlElements.keys.forEach((key) => {
            const keyType = key.textContent.toLowerCase();

            if (parseInt(keyType, 10) || keyType === '0') {
                key.addEventListener('click', () => this.#handleKeyClick(key));
                return;
            }
            if (keyType === 'del') {
                key.addEventListener('click', () => this.#handleKeyDel());
                return;
            }
            if (keyType === 'reset') {
                key.addEventListener('click', () => this.#handleKeyReset());
                return;
            }
            if (keyType === '.') {
                key.addEventListener('click', () => this.#handleDotClick(key));
                return;
            }
            key.addEventListener('click', () => this.#handleOperation(keyType));
        });

        this.#htmlElements.toggleTheme.addEventListener('change', (e) =>
            this.#handleThemeChange(e)
        );
    }
    #handleThemeChange(e) {
        const themeNumber = Number(e.target.value) + 1;

        switch (themeNumber) {
            case 1:
                this.#changeTheme('dark');
                break;
            case 2:
                this.#changeTheme('light');
                break;
            case 3:
                this.#changeTheme('night');
                break;
        }
    }
    #changeTheme(type) {
        let root = document.documentElement;
        for (let property in colorVariables[type]) {
            root.style.setProperty(
                `--${property}`,
                colorVariables[type][property]
            );
        }
    }

    #updateScreen() {
        this.#htmlElements.screen.textContent = this.#operationString;
    }
    #updateOperation(key) {
        this.#operationString = this.#operationString + key;
    }
    #updateOperationScreen() {
        this.#htmlElements.operationScreen.innerHTML = this.#operationArray
            .map((operation) => {
                return `<span>${operation}</span>`;
            })
            .join(' ');
    }

    #handleKeyClick(key) {
        if (this.#operationString.length > 19) return;
        if (this.#operationString === '0') {
            this.#operationString = '';
        }
        this.#updateOperation(key.textContent);
        this.#updateScreen();
    }
    #handleKeyReset() {
        this.#operationString = '0';
        this.#operationArray.length = 0;
        this.#updateScreen();
        this.#updateOperationScreen();
    }
    #handleDotClick(key) {
        if (!this.#operationString.includes('.')) {
            this.#updateOperation(key.textContent);
            this.#updateScreen();
        }
    }
    #handleKeyDel() {
        const operationArr = this.#operationString.split('');
        operationArr.splice(operationArr.length - 1, 1);
        const compiledString = operationArr.join('');
        this.#operationString = compiledString;
        if (!this.#operationString.length) {
            this.#operationString = '0';
        }
        this.#updateScreen();
    }
    #handleEqual() {
        let total = eval(this.#operationArray.join(''));
        this.#operationString = '';
        this.#operationArray.length = 0;
        this.#updateOperation(total);
        this.#updateScreen();
        this.#updateOperationScreen();
    }
    #handleOperation(operation) {
        this.#operationArray.push(this.#operationString);
        this.#operationString = '0';
        this.#updateScreen();
        this.#updateOperationScreen();
        switch (operation) {
            case '-':
                this.#operationArray.push('-');
                this.#updateOperationScreen();
                break;
            case '+':
                this.#operationArray.push('+');
                this.#updateOperationScreen();
                break;
            case '/':
                this.#operationArray.push('/');
                this.#updateOperationScreen();
                break;
            case 'x':
                this.#operationArray.push('*');
                this.#updateOperationScreen();
                break;
            case '=':
                this.#handleEqual();
                break;
            default:
                throw Error('key error');
        }
    }
}

window.onload = function () {
    const calculator = new Calculator();
    calculator.init();
};
