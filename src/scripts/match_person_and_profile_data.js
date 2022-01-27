import { readFile, writeFile } from 'fs/promises';
import config from '../config.js';

async function main() {
  const profilesText = await (await readFile(`${config.datasetsDir}/raw/pg-profiles.json`)).toString();
  /** @type {import('..').Profiles} */
  const profiles = JSON.parse(profilesText);

  const peopleText = await (await readFile(`${config.datasetsDir}/raw/people.json`)).toString();
  /** @type {import('..').People} */
  const people = JSON.parse(peopleText);

  /** @type {{ person: import('..').Person, profile: import('..').Profile}[]} */
  const matches = [];
  profiles.forEach((profile) => {
    const person = people.find((person) => person.discordID?.current === profile.discordId);
    if (person) {
      matches.push({ profile, person });
    }
  });

  await writeFile(`${config.datasetsDir}/derived/profiles-to-person.json`, JSON.stringify(matches));
}

main();
