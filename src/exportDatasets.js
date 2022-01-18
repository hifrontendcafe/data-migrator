import { getDiscordUsers, getMentors, getPersons, getProfiles } from './api/queries.js';
import { mkdirSync, writeFileSync } from 'fs';
import config from './config.js';

export const queries = [
  { fetch: getMentors, file: `${config.datasetsDir}/raw/mentors.json` },
  { fetch: getPersons, file: `${config.datasetsDir}/raw/persons.json` },
  { fetch: getProfiles, file: `${config.datasetsDir}/raw/profiles.json` },
  { fetch: getDiscordUsers, file: `${config.datasetsDir}/discord-users.json` },
];

export function saveQueries() {
  const rawPath = `${config.datasetsDir}/raw`;

  if (!existsSync(rawPath)) {
    mkdirSync(rawPath);
  }

  queries.forEach((query) => {
    query.fetch().then((data) => {
      writeFileSync(query.file, JSON.stringify(data, null, 2));
    });
  });
}
