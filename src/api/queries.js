import sanityClient from '../loaders/sanity.js';
import postgresClient from '../loaders/postgres.js';
import { Collection, Guild, GuildMember, Role } from 'discord.js';
import config from '../config.js';
import { execute } from '../loaders/discord.js';

export function getMentors() {
  return sanityClient.fetch("*[_type == 'mentor']");
}

export function getPersons() {
  return sanityClient.fetch("*[_type == 'person']");
}

export async function getProfiles() {
  const result = await postgresClient.query('SELECT * FROM "Profile"');
  postgresClient.end();
  return result.rows;
}

/** @typedef {{ id: string, username: string | null, username2: string, roles: Role[]  }} DiscordUser */
/** @typedef {Array<DiscordUser>} DiscordUsers */

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
        reject(err);
      }

      resolve(dataset);
    });
  });
}
