import { Client, REST, Routes } from "discord.js";
import { token } from "./config";
import fs from 'node:fs/promises';
import path from "node:path";
import { CommandModule } from "./types";

const rest = new REST({ version: '10' })
    .setToken(token)

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
    console.group('Loading commands...')
    const commands: Record<string, CommandModule> = {}
    const commandsDir = path.join(__dirname, '/commands')
    const fileNames = await fs.readdir(commandsDir)

    await Promise.all(fileNames.map(importFile))
    console.groupEnd()
    return commands

    async function importFile(fileName: string) {
        const commandName = fileName.split('.')[0]
        const { default: commandModule } = await import(path.join(commandsDir, fileName))
        if (!isCommandModule(commandModule)) return;
        console.log(fileName, 'loaded.')
        commands[commandName] = commandModule;
    }
}

/**
 * Sets up listeners for each command.
 * @param client Discord client object.
 */
function setupListeners(client: Client, commands: Record<string, CommandModule>) {
    client.on('interactionCreate', interaction => {
        if (!interaction.isChatInputCommand()) return;

        console.group('Command received')
        console.log('User:', interaction.user.username)
        console.log('Command name:', interaction.commandName)
        console.log('Options:', interaction.options.data)

        const commandName = interaction.commandName;
        if (commands[commandName] == null) {
            console.error('Invalid command name:', commandName);
            interaction.reply("Invalid command.");
            return;
        }

        console.groupEnd()
        commands[commandName].execute(interaction);
    })
}

/**
 * Puts all defined commands using discord.js REST api.
 * Sets up listeners for the commands if definition were successfully put.
 * @param client Discord client object.
 * @returns Whether or not the setup was successful.
 */
export async function setupCommands(client: Client) {
    console.group('Setting application commands...')

    const user = client.user;
    if (user == null) {
        throw new Error('Client.user is null');
    }

    const commands = await loadCommands();

    let result = false;
    try {
        await rest.put(
            Routes.applicationCommands(user.id),
            {
                body: Object
                    .values(commands)
                    .map(({ command }) => command)
            }
        )
        setupListeners(client, commands)
        result = true;
    } catch (error) {
        console.error('Error occurred:', error)
    }
    console.groupEnd();
    return result;
}