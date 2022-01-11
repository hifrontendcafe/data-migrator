import { Client, Intents } from "discord.js";
import config from "../config.js";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

/**
 * @param {() => Promise<void>} fn
 */
export function execute(fn) {
  client.once("ready", fn);
}

client.login(config.discord.token);
