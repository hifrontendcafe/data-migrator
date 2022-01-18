import {
  getCmykParticipants,
  getDiscordUsers,
  getMentors,
  getPersons,
  getProfiles,
  getReactGroupsParticipants,
} from './api/queries.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import config from './config.js';

export const queries = [
  { fetch: getMentors, file: `${config.datasetsDir}/raw/mentors.json` },
  { fetch: getPersons, file: `${config.datasetsDir}/raw/persons.json` },
  { fetch: getProfiles, file: `${config.datasetsDir}/raw/profiles.json` },
  { fetch: getCmykParticipants, file: `${config.datasetsDir}/raw/cmyk-participant.json` },
  { fetch: getReactGroupsParticipants, file: `${config.datasetsDir}/raw/react-groups-participants.json` },
  { fetch: getDiscordUsers, file: `${config.datasetsDir}/discord-users.json` },
];

export function saveQueries() {
  const rawPath = `${config.datasetsDir}/raw`;

  if (!existsSync(rawPath)) {
    mkdirSync(rawPath);
  }

  queries.forEach((query) => {
    query.fetch().then((data) => {
      console.log(`writing ${query.file}`);
      writeFileSync(query.file, JSON.stringify(data, null, 2));
    });
  });
}
