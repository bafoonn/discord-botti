import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandModule } from "../types";

const dice = [4, 6, 8, 10, 12, 20, 100]
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
            .setChoices([
                { name: 'Advantage', value: 1 },
                { name: 'Disadvantage', value: 0 },
            ])
    )
    .addStringOption(option =>
        option.setName('description')
            .setDescription('Describe what you are rolling.')
            .setMaxLength(200)
    )


function roll(die: number) {
    return Math.ceil(Math.random() * die)
}

/**
 *
 * @param interaction
 */
function execute(interaction: ChatInputCommandInteraction) {
    console.group('Rolling dice...')

    const die = interaction.options.getNumber('dice') ?? defaultDie,
        amount = interaction.options.getNumber('amount'),
        advantage = interaction.options.getNumber('roll-with'),
        description = interaction.options.getString('description')

    console.log('Selected die:', die)
    console.log('Amount:', amount)
    console.log('Roll with:', advantage)
    console.log('Description:', description)

    if (advantage != null) {
        const results = [roll(die), roll(die)]
        if (advantage) {
            console.log('Rolling with advantage.')
            return reply(`d${die} with advantage`, `${Math.max(...results)} (${results})`)
        }
        else {
            console.log('Rolling with disadvantage')
            return reply(`d${die} with disadvantage`, `${Math.min(...results)} (${results})`)
        }
    }

    if (amount) {
        let rollResults = Array<number>(amount)
        for (let i = 0; i < amount; i++) {
            rollResults[i] = roll(die)
        }

        console.log('Roll results:', rollResults)
        return reply(`${amount}d${die}`, `${rollResults.reduce((prev, curr) => prev + curr)} (${rollResults})`)

    }

    return reply('d' + die, roll(die))

    function reply(rolled: string, result: number | string) {
        console.log('Result:', result)
        console.groupEnd()
        if (description) {
            interaction.reply(description + ` Rolled ${rolled}, result: ${result}`)
            return;
        }

        interaction.reply(`Rolled ${rolled}, result: ${result}`)
    }
}

export default {
    command,
    execute
} satisfies CommandModule