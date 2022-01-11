import { getDiscordUsers, getMentors, getPersons, getProfiles } from './api/queries.js';
import { writeFileSync } from 'fs';

const queries = [
  { fetch: getMentors, file: './datasets/mentors.json' },
  { fetch: getPersons, file: './datasets/persons.json' },
  { fetch: getProfiles, file: './datasets/profiles.json' },
  { fetch: getDiscordUsers, file: './datasets/discord-users.json' },
];

export function saveQueries() {
  queries.forEach((query) => {
    query.fetch().then((data) => {
      writeFileSync(query.file, JSON.stringify(data, null, 2));
    });
  });
}
