const path = require('path');
const fs = require('fs');

const pathToText = path.join(__dirname, 'text.txt');
const text = fs.createWriteStream(pathToText);

function textInput() {

    process.stdout.write(`Введите любой текст: `);

    process.stdin.on('data', (data) => {

        if (data.toString().trim() === `exit`) {
            process.stdout.write(`Вы вышли из режима ввода`);
            process.exit();
        } else {
            text.write(data.toString());
            process.stdout.write(`Ваш текст "${data.toString().trim()}" был записан в файл text.txt\n`);
            process.stdout.write(`Введите любой текст: `);
        }
    })

}

textInput();