import { query } from '../loaders/groq.js';

/**
 * @param {import('../index.js').DiscordUsers} users
 * @returns {Promise<import('../index.js').DiscordUsers>}
 */
export async function filterMentors(users) {
  return query(users, '*[roles[].name match "Mentors"]{id, username2, "roles": roles[].name}');
}

/**
 * @param {import('../index.js').People} people
 * @param {string[]} ids
 * @returns {Promise<import('../index.js').DiscordUsers>}
 */
export async function filterByIds(people, ids) {
  return query(people, `*[discordID.current in ${JSON.stringify(ids)}]`);
}
