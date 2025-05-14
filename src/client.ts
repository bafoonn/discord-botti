import { type Client } from "discord.js";
import { token } from "./config";

/**
 * Sets up all listeners and logins the client.
 * @param client Discord client object.
 */
export async function setupClient(client: Client) {
    console.group('Setting up client...')

    const user = client.user;
    if (user == null) {
        throw new Error('Client.user is null.');
    }

    client.on('ready', () => {
        console.log(`Logged in as ${user.tag}!`)
        console.log(`Client user id: ${user.id}`)
    });

    await client.login(token);
    console.groupEnd()
}