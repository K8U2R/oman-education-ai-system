
import { resolve } from 'path';

// Load directly from backend dependencies to avoid root install requirement
const tsConfigPaths = require(resolve(__dirname, '../backend/node_modules/tsconfig-paths'));
const tsConfig = require(resolve(__dirname, '../backend/tsconfig.json'));

const baseUrl = resolve(__dirname, '../backend');

tsConfigPaths.register({
    baseUrl,
    paths: tsConfig.compilerOptions.paths
});
