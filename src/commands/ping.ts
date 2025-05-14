import { SlashCommandBuilder } from "discord.js";
import { CommandModule, ExecuteFunc } from "../types";

const command = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!')
    .addStringOption(option =>
        option
            .setName('parameter')
            .setDescription('parameter description')
    )

const execute: ExecuteFunc = function (interaction) {
    interaction.reply('pong')
}

export default {
    command,
    execute
} satisfies CommandModule