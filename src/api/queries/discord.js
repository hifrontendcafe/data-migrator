import { Collection, Guild, GuildMember } from 'discord.js';
import config from '../../config.js';
import { execute } from '../../loaders/discord.js';

/** @typedef {import('../../index.js').DiscordUsers} DiscordUsers */

/**
 * @returns {Promise<DiscordUsers>}
 */
export function getDiscordUsers() {
  return new Promise((resolve, reject) => {
    execute(async (client) => {
      /** @type {DiscordUsers} */
      const dataset = [];

      /** @type {Guild} */
      let guild;
      /** @type {Collection<string, GuildMember>} */
      let members;

      try {
        guild = await client.guilds.fetch(config.discord.guildId);
        members = await guild.members.fetch();

        members.forEach((member) => {
          dataset.push({
            id: member.id,
            username: member.nickname,
            username2: member.user.tag,
            roles: member.roles.cache.toJSON(),
          });
        });
      } catch (err) {
        console.log('error', err);
        reject(err);
      }

      resolve(dataset);
    });
  });
}
