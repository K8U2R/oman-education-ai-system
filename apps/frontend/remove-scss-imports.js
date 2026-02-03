const fs = require('fs');
const path = require('path');

function getAllTsxFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllTsxFiles(filePath, fileList);
        } else if (file.endsWith('.tsx')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

const presentationDir = path.join(process.cwd(), 'src', 'presentation');
const tsxFiles = getAllTsxFiles(presentationDir);

let count = 0;

tsxFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        const original = content;

        // Remove SCSS imports
        content = content.replace(/import\s+['"]\.\/[^'"]+\.scss['"];?\s*\n?/g, '');
        content = content.replace(/import\s+['"]\.\/[^'"]+\.module\.scss['"];?\s*\n?/g, '');

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            count++;
        }
    } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
    }
});

console.log(`\n✅ Removed SCSS imports from ${count} files`);
