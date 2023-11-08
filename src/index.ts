import { Olivia } from "./lib";
import { config } from 'dotenv'

config({ path: './.env' })
const bot = new Olivia({ discord: { token: process.env.TOKEN || '' } })
void bot.run()

process.on('SIGINT', async () => {
    await bot.destroy()
    process.exit(0)
})