import dayjs from 'dayjs'
import fs from 'node:fs'
import path from 'node:path'

type LoggerLevel =
    | 'info'
    | 'debug'
    | 'warn'
    | 'error'
type LoggerModule =
    | 'discord'
    | 'player'
    | 'express'
    | 'main'
    | 'global'
type LoggerMode =
    | 'console'
    | 'file'
interface LoggerConfig {
    mode?: LoggerMode[] | null
}

export class Logger {
    public fileStream?: fs.WriteStream

    constructor(public filePath?: string) {
        if (!!filePath) this.openFile(filePath)
    }

    public openFile(file: string) {
        if (!fs.existsSync(file)) {
            const fileDirectories = file.split('/').slice(1, -1)
            let createdDir = '.'
            for (let index in fileDirectories) {
                createdDir = path.join(createdDir, fileDirectories[index])
                fs.mkdirSync(createdDir)
            }
        }

        return this.fileStream = fs.createWriteStream(file, { encoding: 'utf-8' })
    }

    public log(level: LoggerLevel, module: LoggerModule, message: string, config?: LoggerConfig) {
        const log = message.split('\n').map(message => `[${dayjs().format("DD/MM/YYYY HH:mm:ss")}] [${level.toUpperCase()}] [${module.toUpperCase()}] ${message}`).join('\n')
        
        if (!config || (config && (config.mode == null || config.mode.includes('console')))) console.log(log)
        if (this.fileStream && (!config || (config && (config.mode == null || config.mode.includes('file'))))) this.fileStream.write(`${log}\n`)
    }

    public info(module: LoggerModule, info: string, config?: LoggerConfig) {
        return this.log('info', module, info, config)
    }
    public debug(module: LoggerModule, debug: string, config?: LoggerConfig) {
        return this.log('debug', module, debug, config)
    }
    public warn(module: LoggerModule, warn: string, config?: LoggerConfig) {
        return this.log('warn', module, warn, config)
    }
    public error(module: LoggerModule, error: string | Error, config?: LoggerConfig) {
        return this.log('error', module, error instanceof Error ? `${error.name}: ${error.message}` : error, config)
    }
}