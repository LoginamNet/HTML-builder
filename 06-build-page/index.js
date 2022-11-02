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
            const fileStats = await stat(pathToFile);

            if (fileStats.isFile()) {
                await unlink(pathToFile);
            }
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

async function copyAssets(pathToInitFolder, pathToDestFolder) {
    try {

        createFolder(pathToDestFolder);

        const soureFolders = await readdir(pathToInitFolder);

        soureFolders.forEach(async (item) => {
            const pathToSourceFolder = path.join(pathToInitFolder, item);
            const pathToCopyFolder = path.join(pathToDestFolder, item);

            createFolder(pathToCopyFolder);
            await clearFolder(pathToCopyFolder);
            await copyFiles(pathToSourceFolder, pathToCopyFolder);
        })


    } catch (err) {
        console.error(err);
    }
}


async function bundleProject() {

    const pathToInitFolder = path.join(__dirname, 'assets');
    const pathToProjectFolder = path.join(__dirname, 'project-dist');
    const pathToAssetsFolder = path.join(__dirname, 'assets');
    const pathToCopyAssetsFolder = path.join(pathToProjectFolder, 'assets');

    createFolder(pathToProjectFolder);
    clearFolder(pathToProjectFolder);

    copyAssets(pathToAssetsFolder, pathToCopyAssetsFolder);



}

bundleProject();