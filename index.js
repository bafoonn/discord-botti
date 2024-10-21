const { Client } = require('discord.js');
const { setupClient } = require('./src/client');
const { setupCommands } = require('./src/commands');

async function main() {
    console.group('Starting application')
    const client = new Client({ intents: ['GuildMessages', 'Guilds'] })
    await setupClient(client)
    await setupCommands(client)
    console.groupEnd()
}

main()