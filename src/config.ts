import { configDotenv } from "dotenv"

configDotenv()

function getVariable(name: string) {
    const variable = process.env[name]
    if (!variable) {
        throw new Error(`No variable (${name}) found.`)
    }
    return variable
}

export const token = getVariable('DISCORD_TOKEN');