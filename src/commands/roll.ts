import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandModule } from "../types";
import Option from "../models/option";

type RollType = 'Disadvantage' | 'Advantage' | 'Single'
const rollTypeOptions: Readonly<RollType[]> = [
    'Disadvantage', 'Advantage'
]

const dice = [4, 6, 8, 10, 12, 20, 100] as const
const defaultDie = 20;

const command = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls a dice. (D20 by default)')
    .addNumberOption(option =>
        option.setName('dice')
            .setDescription('Select which die to use.')
            .setChoices(dice.map(die => ({
                name: 'D' + die,
                value: die
            })))
    )
    .addNumberOption(option =>
        option.setName('amount')
            .setDescription('Select how many dice to roll.')
            .setMinValue(2)
            .setMaxValue(20)
    )
    .addNumberOption(option =>
        option.setName('roll-with')
            .setDescription('Select if a roll is made with advantage or disadvantage. Ignores amount option if set.')
            .setChoices(
                rollTypeOptions.map((type, index) => ({ name: type, value: index }))
            )
    )
    .addStringOption(option =>
        option.setName('description')
            .setDescription('Describe what you are rolling.')
            .setMaxLength(200)
    )


function roll(die: number, type?: RollType | null): number {
    switch (type) {
        case 'Advantage': return Math.max(roll(die), roll(die))
        case 'Disadvantage': return Math.min(roll(die), roll(die))
        case 'Single':
        default: return Math.ceil(Math.random() * die)
    }
}

function format(str: string) {
    return str
        .split('\n')
        .map(line => line.replace(/^(\s*)/, ''))
        .join('\n');
}

function execute(interaction: ChatInputCommandInteraction) {
    console.group('Rolling dice...')

    const die = Option
        .of(interaction.options.getNumber('dice'))
        .reduce(defaultDie);

    const amount = Option
        .of(interaction.options.getNumber('amount'))
        .reduce(1);

    const type = Option
        .of(interaction.options.getNumber('roll-with'))
        .map((value) => rollTypeOptions[value])
        .reduce('Single')

    let reply = Option
        .of(interaction.options.getString('description'))
        .map((value) => `${value} - Rolled D${die}`)
        .reduce(`Rolled D${die}`)

    console.log(format(
        `Selected die: ${die}
        Amount: ${amount}
        Roll with: ${type}`
    ))

    let result = 0
    for (let i = 0; i < amount; i++) {
        result += roll(die, type)
    }

    if (amount > 1) reply += `x${amount}`

    switch (type) {
        case 'Advantage':
            reply += ' with advantage'
            break;
        case 'Disadvantage':
            reply += ' with disadvantage'
            break;
    }

    reply += `, Result: ${result}`
    console.log('Reply:', reply);
    console.groupEnd();
    return interaction.reply(reply)
}

export default {
    command,
    execute
} satisfies CommandModule