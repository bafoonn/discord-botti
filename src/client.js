const { Client } = require('discord.js');
const { token } = require('./config');

/**
 * Sets up all listeners and logins the client.
 * @param {Client} client Discord client object.
 */
async function setupClient(client) {
    console.group('Setting up client...')
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`)
        console.log(`Client user id: ${client.user.id}`)
    });

    await client.login(token);
    console.groupEnd()
}

module.exports = { setupClient }