const path = require('path');
const {readdir, stat} = require('fs/promises')

const pathToFolder = path.join(__dirname, 'secret-folder');

async function readFiles() {
    const folderItems = await readdir(pathToFolder);

    console.log(folderItems);

    folderItems.forEach(async (item) => {
        const pathToFile = path.join(pathToFolder, item);
        const fileStats = await stat(pathToFile);

        if (fileStats.isFile()) {
            const fileExpLength =  path.extname(pathToFile).length;
            const fileBaseLenth = path.basename(pathToFile).length;

            const fileName = path.basename(pathToFile).slice(0, fileBaseLenth - fileExpLength);
            const fileExp = path.extname(pathToFile).slice(-fileExpLength + 1);
            const fileSize = Math.round(fileStats.size / 1024 * 100) / 100;
            console.log(`${fileName} - ${fileExp} - ${fileSize}kb`);
        }
    })

}

readFiles();