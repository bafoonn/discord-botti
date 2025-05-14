import { Client, REST, Routes } from "discord.js";
import { token } from "./config";
import fs from 'node:fs/promises'


import roll from "./commands/roll";
import ping from "./commands/ping";
import { Command, CommandModule } from "./types";

const rest = new REST({ version: '10' })
    .setToken(token)

const commands: Command[] = [];

function isCommandModule(value: unknown): value is CommandModule {
    if (value == null
        || typeof value !== 'object'
        || "command" in value === false
        || "execute" in value === false
        || typeof value.execute !== 'function') {
        return false;
    }
    return true;
}

async function loadCommands() {
    console.log('Loading command modules...')
    const fileNames = await fs.readdir('./commands')
    await Promise.all(fileNames.map(importFile))

    async function importFile(fileName: string) {
        const file = await import(`./commands/${fileName}`)
        if (!isCommandModule(file)) return;
        commands.push(file.command)
    }
}

/**
 * Sets up listeners for each command.
 * @param client Discord client object.
 */
function setupListeners(client: Client) {
    client.on('interactionCreate', interaction => {
        if (!interaction.isChatInputCommand()) return;

        console.group('Command received')
        console.log('User:', interaction.user.username)
        console.log('Command name:', interaction.commandName)
        console.log('Options:', interaction.options.data)

        switch (interaction.commandName) {
            case 'ping':
                break;

            case 'roll':
                roll.execute(interaction)
                break;

        }

        console.groupEnd()
    })
}

/**
 * Puts all defined commands using discord.js REST api.
 * Sets up listeners for the commands if definition were successfully put.
 * @param client Discord client object.
 * @returns {Promise<boolean>} Whether or not the setup was successful.
 */
export async function setupCommands(client: Client) {
    console.group('Setting application commands...')

    await loadCommands();

    const user = client.user;
    if (user == null) {
        throw new Error('Client.user is null');
    }

    let result = false;
    try {
        await rest.put(
            Routes.applicationCommands(user.id),
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