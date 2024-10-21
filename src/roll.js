const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

const dice = [4, 6, 8, 10, 12, 20, 100]
const defaultDie = 20;

const command = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls a dice. (D20 by default)')
    .addStringOption(option =>
        option.setName('dice')
            .setDescription('Select which die to use.')
            .setChoices(dice.map(die => ({
                name: 'D' + die,
                value: die.toString()
            })))
    )
    .addNumberOption(option =>
        option.setName('amount')
            .setDescription('Select how many dice to roll.')
            .setMinValue(2)
            .setMaxValue(20)
    )

function roll(die) {
    return Math.ceil(Math.random() * die)
}

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
function execute(interaction) {
    const die = interaction.options.getString('dice') ?? defaultDie
    const amount = interaction.options.getNumber('amount')

    let result = ''

    if (!amount) {
        result = `Rolled d${die}, result: ${roll(die)}`
    }
    else {
        let rollResults = [];
        for (let i = 0; i < amount; i++) {
            rollResults.push(roll(die))
        }
        result = `Rolled ${amount}d${die}, result: ${rollResults.reduce((prev, curr) => prev + curr)} (${rollResults})`
    }

    interaction.reply(result)
}

module.exports = { command, execute }