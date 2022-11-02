const path = require('path');
const {mkdir, readdir, unlink, stat, copyFile, writeFile, readFile, appendFile} = require('fs/promises');

async function createFile(pathToFile) {
    try {
        await writeFile(pathToFile, '');
    } catch (err) {
        console.error(err);
    }
}

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

async function createHtmlBundle(pathToTemplate, pathToHtmlBundleFile, pathToComponentsFolder) {
    try {
        createFile(pathToHtmlBundleFile);

        const componentsfolderItems = await readdir(pathToComponentsFolder);
        let htmlData = await readFile(pathToTemplate, 'utf-8');

        for (let item of componentsfolderItems) {
            const pathToFile = path.join(pathToComponentsFolder, item);
            const fileExpLength =  path.extname(pathToFile).length;
            const fileBaseLenth = path.basename(pathToFile).length;
            const fileName = path.basename(pathToFile).slice(0, fileBaseLenth - fileExpLength);
            
            const replacer = await readFile(pathToFile, 'utf-8');

            htmlData = htmlData.replace(`{{${fileName}}}`, replacer);
        }

        await writeFile(pathToHtmlBundleFile, htmlData);
        console.log('Файл index.html был скомпилирован');

    } catch (error) {
        console.log(error.message)
    }

}

async function appendStyles(pathToStyleFile, pathToBundleFile) {
    try {
        let data = await readFile(pathToStyleFile, 'utf8');
        await appendFile(pathToBundleFile, `${data}\n`);
    } catch (err) {
        console.error(err);
    }
}

async function createStylesBundle(pathToStyleBundleFile, pathToStylesFolder) {
    try {
        createFile(pathToStyleBundleFile);

        const stylefolderItems = await readdir(pathToStylesFolder);

        stylefolderItems.forEach(async (item) => {
            const pathToStyleFile = path.join(pathToStylesFolder, item);

            const fileStats = await stat(pathToStyleFile);
            const fileExp = path.extname(pathToStyleFile);

            if (fileStats.isFile() && fileExp === '.css') {
                await appendStyles(pathToStyleFile, pathToStyleBundleFile);
                console.log(`Стили из файла ${item} были добавлены в файл style.css`);
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

    try {

        const pathToProjectFolder = path.join(__dirname, 'project-dist');

        const pathToTemplate = path.join(__dirname, 'template.html');
        const pathToComponentsFolder = path.join(__dirname, 'components');
        const pathToHtmlBundleFile = path.join(pathToProjectFolder, 'index.html');

        const pathToAssetsFolder = path.join(__dirname, 'assets');
        const pathToCopyAssetsFolder = path.join(pathToProjectFolder, 'assets');

        const pathToStylesFolder = path.join(__dirname, 'styles'); 
        const pathToStyleBundleFile = path.join(pathToProjectFolder, 'style.css');

        createFolder(pathToProjectFolder);
        await clearFolder(pathToProjectFolder);

        await copyAssets(pathToAssetsFolder, pathToCopyAssetsFolder);
        await createStylesBundle(pathToStyleBundleFile, pathToStylesFolder);
        await createHtmlBundle(pathToTemplate, pathToHtmlBundleFile, pathToComponentsFolder);

        console.log(`\nСборка завершена!`);

    } catch (err) {
        console.error(err);
    }
    
}

bundleProject();