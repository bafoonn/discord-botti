import { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

type Command = SlashCommandOptionsOnlyBuilder
type ExecuteFunc = (interaction: ChatInputCommandInteraction) => void
type CommandModule = {
    command: Command;
    execute: ExecuteFunc;
}