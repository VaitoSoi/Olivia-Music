export class ENV {
    public discord: {
        token: string
    } = {
        token: ''
    }

    constructor(env: Record<string, any>) {
        !!env.discord.token ? this.discord.token = env.discord.token : undefined
    }
}