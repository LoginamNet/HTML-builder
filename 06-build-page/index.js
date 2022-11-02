const fs = require('fs');
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

async function createHtmlBundle(pathToHtmlBundleFile, pathToComponentsFolder) {
    try {
        createFile(pathToHtmlBundleFile);

        const componentsfolderItems = await readdir(pathToComponentsFolder);
        let htmlData = await readFile(path.join(__dirname, 'template.html'), 'utf-8');

        /* componentsfolderItems.forEach(async (item) => {

            const pathToFile = path.join(pathToComponentsFolder, item);
            const fileExpLength =  path.extname(pathToFile).length;
            const fileBaseLenth = path.basename(pathToFile).length;
            const fileName = path.basename(pathToFile).slice(0, fileBaseLenth - fileExpLength);
            
            const replacer = await readFile(pathToFile, 'utf-8');

            htmlData = htmlData.replace(`{{${fileName}}}`, replacer);
            console.log(htmlData)
            
        }) */

        for (let item of componentsfolderItems) {
            const pathToFile = path.join(pathToComponentsFolder, item);
            const fileExpLength =  path.extname(pathToFile).length;
            const fileBaseLenth = path.basename(pathToFile).length;
            const fileName = path.basename(pathToFile).slice(0, fileBaseLenth - fileExpLength);
            
            const replacer = await readFile(pathToFile, 'utf-8');

            htmlData = htmlData.replace(`{{${fileName}}}`, replacer);
        }



        await writeFile(pathToHtmlBundleFile, htmlData);



        /* let str = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
        const component1 = await fs.promises.readFile(path.join(__dirname, 'components', 'header.html'), 'utf-8');
        str = str.replace(`{{header}}`, component1);
        const component2 = await fs.promises.readFile(path.join(__dirname, 'components', 'articles.html'), 'utf-8');
        str = str.replace(`{{articles}}`, component2);
        const component3 = await fs.promises.readFile(path.join(__dirname, 'components', 'footer.html'), 'utf-8');
        str = str.replace(`{{footer}}`, component3);

        const writeStr = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
        writeStr.write(str); */

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

    const pathToProjectFolder = path.join(__dirname, 'project-dist');

    const pathToComponentsFolder = path.join(__dirname, 'components');
    const pathToHtmlBundleFile = path.join(pathToProjectFolder, 'index.html');

    const pathToAssetsFolder = path.join(__dirname, 'assets');
    const pathToCopyAssetsFolder = path.join(pathToProjectFolder, 'assets');

    const pathToStylesFolder = path.join(__dirname, 'styles'); 
    const pathToStyleBundleFile = path.join(pathToProjectFolder, 'style.css');

    createFolder(pathToProjectFolder);
    await clearFolder(pathToProjectFolder);

    copyAssets(pathToAssetsFolder, pathToCopyAssetsFolder);
    createStylesBundle(pathToStyleBundleFile, pathToStylesFolder);
    createHtmlBundle(pathToHtmlBundleFile, pathToComponentsFolder);



}

bundleProject();