import { Olivia } from ".";
import express from 'express'
import fs from 'fs'
import { randomUUID } from 'node:crypto'
import { Server } from 'node:http'

export class OliviaExpress {
    public app: express.Express = express()
    public server?: Server;
    private token: string = randomUUID()

    constructor(private olivia: Olivia) { }

    public start(port: number = 8000) {
        this.olivia.logger.debug('express', `Listening on port ${port}`)
        this.olivia.logger.debug('express', `Token: ${this.token}`)

        this.server = this.app.listen(port)
        // this.app.

        this.app.get('/', (req, res) => {
            res.status(200).send(`<a href="/api/log?token=${req.query.token || ''}">Get debug.log</a><br><a href="/api/token">Log token to console</a>`)
        })
        this.app.get('/api/log', (req, res) => {
            if (req.query.token != this.token) return res.status(401).send("Invalid token")
            else res.status(200).send(`<p style="white-space: break-spaces;font-family:monospace">${fs.readFileSync('./debug.log', 'utf8').replace(/\n/gi, '<br>')}`)
        })
        this.app.get('/api/token', (req, res) => {
            this.olivia.logger.debug('express', `Token: ${this.token}`)
            res.status(200).send('Logged token to your console');
        })
    }
}