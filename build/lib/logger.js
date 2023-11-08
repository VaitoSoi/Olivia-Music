"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
class Logger {
    constructor(filePath) {
        this.filePath = filePath;
        if (!!filePath)
            this.openFile(filePath);
    }
    openFile(file) {
        if (!node_fs_1.default.existsSync(file)) {
            const fileDirectories = file.split('/').slice(1, -1);
            let createdDir = '.';
            for (let index in fileDirectories) {
                createdDir = node_path_1.default.join(createdDir, fileDirectories[index]);
                node_fs_1.default.mkdirSync(createdDir);
            }
        }
        return this.fileStream = node_fs_1.default.createWriteStream(file, { encoding: 'utf-8' });
    }
    log(level, module, message, config) {
        const log = message.split('\n').map(message => `${(0, dayjs_1.default)().format("DD/MM/YYYY HH:mm:ss")} [${level.toUpperCase()}] [${module.toUpperCase()}] ${message}`).join('\n');
        if (!config || (config && (config.mode == null || config.mode.includes('console'))))
            console.log(log);
        if (this.fileStream && (!config || (config && (config.mode == null || config.mode.includes('file')))))
            this.fileStream.write(`${log}\n`);
    }
    info(module, info, config) {
        return this.log('info', module, info, config);
    }
    debug(module, debug, config) {
        return this.log('debug', module, debug, config);
    }
    warn(module, warn, config) {
        return this.log('warn', module, warn, config);
    }
    error(module, error, config) {
        return this.log('error', module, error instanceof Error ? `${error.name}: ${error.message}` : error, config);
    }
}
exports.Logger = Logger;
