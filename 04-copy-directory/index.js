const path = require('path');
const {mkdir, readdir, unlink, stat, copyFile} = require('fs/promises');



async function copyFiles() {
    try {
        
    const pathToInitFolder = path.join(__dirname, 'files');
    const pathToDestFolder = path.join(__dirname, 'copy-files');

    await mkdir(pathToDestFolder, { recursive: true });

    const destFolderItems = await readdir(pathToDestFolder);

    destFolderItems.forEach(async (item) => {
        const pathToDestFile = path.join(pathToDestFolder, item);

        await unlink(pathToDestFile);
    })


    const initFolderItems = await readdir(pathToInitFolder);

    console.log(initFolderItems);

    initFolderItems.forEach(async (item) => {

        const pathToInitFile = path.join(pathToInitFolder, item);
        const pathToDestFile = path.join(pathToDestFolder, item);
        const fileStats = await stat(pathToInitFile);

        if (fileStats.isFile()) {
            console.log(item);
            await copyFile(pathToInitFile, pathToDestFile);
        }
    })


    } catch (err) {
        console.error(err);
    }




}

copyFiles()