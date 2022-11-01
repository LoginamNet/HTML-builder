const path = require('path');
const {mkdir, readdir, unlink, stat, copyFile} = require('fs/promises');

async function createFolder(pathToFolder) {
    try {
        await mkdir(pathToFolder, { recursive: true });
    } catch (err) {
        console.error(err);
    }
}

async function clearFolder(pathToFolder) {
    try {
        const folderItems = await readdir(pathToFolder);

        folderItems.forEach(async (item) => {
            const pathToFile = path.join(pathToFolder, item);

            await unlink(pathToFile);
        })
    } catch (err) {
        console.error(err);
    }
}

async function copyFiles(pathToSourceFolder, pathToDestFolder) {
    try {
        const sourcefolderItems = await readdir(pathToSourceFolder);

        sourcefolderItems.forEach(async (item) => {
            const pathToSourceFile = path.join(pathToSourceFolder, item);
            const pathToDestFile = path.join(pathToDestFolder, item);
            const fileStats = await stat(pathToSourceFile);

            if (fileStats.isFile()) {
                await copyFile(pathToSourceFile, pathToDestFile);
                console.log(`Файл ${item} был скопирован`);
            }
        })
    } catch (err) {
        console.error(err);
    }
}

async function copyFolder() {
    try {
        
        const pathToInitFolder = path.join(__dirname, 'files');
        const pathToDestFolder = path.join(__dirname, 'copy-files');

        createFolder(pathToDestFolder);
        clearFolder(pathToDestFolder);
        copyFiles(pathToInitFolder, pathToDestFolder);


    } catch (err) {
        console.error(err);
    }
}

copyFolder();