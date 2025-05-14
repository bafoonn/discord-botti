import { Client } from "discord.js"
import { setupClient } from "./client"
import { setupCommands } from "./commands"

async function main() {
    console.group('Starting application')
    const client = new Client({ intents: ['GuildMessages', 'Guilds'] })
    await setupClient(client)
    await setupCommands(client)
    console.groupEnd()
}

main()