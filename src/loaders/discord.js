import { Client, Intents } from 'discord.js';
import config from '../config.js';

export const discordClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES],
});

/**
 * @param {(client: Client) => Promise<void>} fn
 */
export function execute(fn) {
  discordClient.once('ready', async (client) => {
    await fn(client);
    discordClient.destroy();
  });
}

discordClient.login(config.discord.token);
