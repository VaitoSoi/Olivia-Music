import { Olivia } from "./lib";
import { config } from 'dotenv'

config({ path: './.env' })
const bot = new Olivia({ discord: { token: 'MTExODM4MTg0NDU2ODczNTc2NQ.GCRsWZ.IQr8LzCZsYLKhYNZpjzjlIHxQA2DNm_gbAA_WU' } })
void bot.run()

process.on('SIGINT', async () => {
    await bot.destroy()
    process.exit(0)
})