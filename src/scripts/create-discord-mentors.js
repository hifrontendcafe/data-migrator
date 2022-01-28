import { readFile, writeFile } from 'fs/promises';
import { filterMentors } from '../api/filters.js';
import config from '../config.js';

async function main() {
  const discordUsersText = await (await readFile(`${config.datasetsDir}/raw/discord-users.json`)).toString();

  /** @type {import('..').DiscordUsers} */
  const discordUsers = JSON.parse(discordUsersText);

  const mentors = await filterMentors(discordUsers);

  await writeFile(`${config.datasetsDir}/derived/mentors.json`, JSON.stringify(mentors));
}

main();
