import fs from "fs"

export function constructPage(page, options = {}){
    const header = readPage('./public/components/Header.html');
    const footer = readPage('./public/components/Footer.html');

     return header
            .replace('$$DOCUMENT_TITLE$$', options.documentTitle || 'StudyRoom')
         + page 
         + footer;
}

export function readPage(path){
    return fs.readFileSync(path).toString();
}