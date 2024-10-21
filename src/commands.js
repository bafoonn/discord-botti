const { REST, Routes, Client, SlashCommandBuilder } = require('discord.js')
const { token } = require('./config')
const roll = require('./roll')

const rest = new REST({ version: '10' })
    .setToken(token)

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!')
        .addStringOption(option =>
            option
                .setName('parameter')
                .setDescription('parameter description')
        ),
    roll.command
];

/**
 * Puts all defined commands using discord.js REST api.
 * Sets up listeners for the commands if definition were successfully put.
 * @param {Client} client Discord client object.
 * @returns {Promise<boolean>} Whether or not the setup was successful.
 */
async function setupCommands(client) {
    console.group('Setting application commands...')
    let result = false;
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        )
        setupListeners(client)
        console.log('Commands successfully set.')
        result = true;
    } catch (error) {
        console.error('Error occurred:', error)
    }
    console.groupEnd();
    return result;
}

/**
 * Sets up listeners for each command.
 * @param {Client} client Discord client object.
 */
function setupListeners(client) {
    client.on('interactionCreate', interaction => {
        if (!interaction.isChatInputCommand()) return;

        console.group('Command received')
        console.log('User:', interaction.user.username)
        console.log('Command name:', interaction.commandName)
        console.log('Options:', interaction.options.data)

        switch (interaction.commandName) {
            case 'ping':
                interaction.reply('pong')
                break;

            case 'roll':
                roll.execute(interaction)
                break;

        }

        console.groupEnd()
    })
}

module.exports = { setupCommands }