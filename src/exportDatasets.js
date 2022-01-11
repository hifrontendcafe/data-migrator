import { getDiscordUsers, getMentors, getPersons, getProfiles } from './api/queries.js';
import { writeFileSync } from 'fs';
import config from './config.js';

const queries = [
  { fetch: getMentors, file: `${config.datasetsDir}/mentors.json` },
  { fetch: getPersons, file: `${config.datasetsDir}/persons.json` },
  { fetch: getProfiles, file: `${config.datasetsDir}/profiles.json` },
  { fetch: getDiscordUsers, file: `${config.datasetsDir}/discord-users.json` },
];

export function saveQueries() {
  queries.forEach((query) => {
    query.fetch().then((data) => {
      writeFileSync(query.file, JSON.stringify(data, null, 2));
    });
  });
}
