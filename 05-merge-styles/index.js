const path = require('path');
const {writeFile, readFile, appendFile, readdir, stat} = require('fs/promises');
const { constants } = require('buffer');


async function createFile() {
    try {
        await writeFile(path.join('05-merge-styles/project-dist', 'bundle.css'), '');
    } catch (err) {
        console.error(err);
    }
}

async function readData(pathToStyleFile, pathToBundleFile) {
    try {
        let data = await readFile(pathToStyleFile, 'utf8');
        await appendFile(pathToBundleFile, `${data}\n`);
    } catch (err) {
        console.error(err);
    }
}

async function createBundle() {
    try {
        createFile();

        const pathToStyleFolder = path.join(__dirname, 'styles'); 
        const pathToBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
        const stylefolderItems = await readdir(pathToStyleFolder);

        stylefolderItems.forEach(async (item) => {
            const pathToStyleFile = path.join(pathToStyleFolder, item);

            const fileStats = await stat(pathToStyleFile);
            const fileExp = path.extname(pathToStyleFile);

            if(fileStats.isFile() && fileExp === '.css') {
                console.log(pathToStyleFile);
                await readData(pathToStyleFile, pathToBundleFile);
            }
        })
    } catch (err) {
        console.error(err);
    }
}

createBundle();