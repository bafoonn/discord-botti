require('dotenv').config();

function getVariable(name) {
    const variable = process.env[name]
    if (!variable) {
        throw new Error(errorMsg ?? `No variable (${name}) found.`)
    }
    return variable
}

module.exports = {
    token: getVariable('DISCORD_TOKEN'),
}