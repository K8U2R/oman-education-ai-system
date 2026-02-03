
import * as sass from 'sass';
import path from 'path';
import fs from 'fs';

const scssFile = path.resolve('src/styles/test-compilation.scss');
const variablesFile = path.resolve('src/styles/abstracts/_variables.scss');

// Create a dummy SCSS file that imports variables
const testScssContent = `
@use 'src/styles/abstracts/variables' as v;
.test {
  color: v.$primary-500;
  padding: v.$spacing-4;
}
`;

// Ensure directory exists
if (!fs.existsSync(path.dirname(scssFile))) {
    fs.mkdirSync(path.dirname(scssFile), { recursive: true });
}

fs.writeFileSync(scssFile, testScssContent);

console.log(`Compiling ${scssFile}...`);

try {
    const result = sass.compile(scssFile, {
        loadPaths: [path.resolve('.')],
        style: 'expanded'
    });

    console.log('✅ Compilation Successful!');
    console.log('--- CSS Output ---');
    console.log(result.css);

    // Clean up
    fs.unlinkSync(scssFile);

} catch (error) {
    console.error('❌ Compilation Failed:');
    console.error(error.message);
}
