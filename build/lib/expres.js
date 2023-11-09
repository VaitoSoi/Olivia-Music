"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OliviaExpress = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const node_crypto_1 = require("node:crypto");
class OliviaExpress {
    constructor(olivia) {
        this.olivia = olivia;
        this.app = (0, express_1.default)();
        this.token = (0, node_crypto_1.randomUUID)();
    }
    start(port = 8000) {
        this.olivia.logger.debug('express', `Listening on port ${port}`);
        this.olivia.logger.debug('express', `Token: ${this.token}`);
        this.app.listen(port);
        this.app.get('/', (req, res) => {
            res.status(200).send(`<a href="/api/log?token=${req.query.token || ''}">Get debug.log</a><br><a href="/api/token">Log token to console</a>`);
        });
        this.app.get('/api/log', (req, res) => {
            if (req.query.token != this.token)
                return res.status(401).send("Invalid token");
            else
                res.status(200).send(`<p style="white-space: break-spaces;font-family:monospace">${fs_1.default.readFileSync('./debug.log', 'utf8').replace(/\n/gi, '<br>')}`);
        });
        this.app.get('/api/token', (req, res) => {
            this.olivia.logger.debug('express', `Token: ${this.token}`);
            res.status(200).send('Logged token to your console');
        });
    }
}
exports.OliviaExpress = OliviaExpress;
