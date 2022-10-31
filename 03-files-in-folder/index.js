const path = require('path');
const {readdir, stat} = require('fs/promises')

const pathToFolder = path.join(__dirname, 'secret-folder');

async function readFiles() {
    const folderItems = await readdir(pathToFolder);

    console.log(folderItems);

    folderItems.forEach(async (item) => {
        const pathToFile = path.join(pathToFolder, item);
        const fileStats = await stat(pathToFile);
        console.log(pathToFile, fileStats);
    })

}

readFiles();