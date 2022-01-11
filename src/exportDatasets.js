import { getMentors, getPersons, getProfiles } from './api/queries.js';
import { writeFileSync } from 'fs';
import { Client } from 'discord.js';
import { execute } from './loaders/discord.js';
import config from './config.js';

getMentors().then((mentors) => {
  writeFileSync('./datasets/mentors.json', JSON.stringify(mentors, null, 2));
});

getPersons().then((persons) => {
  writeFileSync('./datasets/persons.json', JSON.stringify(persons, null, 2));
});

getProfiles().then((profiles) => {
  writeFileSync('./datasets/profiles.json', JSON.stringify(profiles, null, 2));
});

execute(async (/** @type {Client} */ client) => {
  console.log('ready');

  /** @type {Array<{ id: string, username: string | null, username2: string }>} */
  const dataset = [];

  const guild = await client.guilds.fetch(config.discord.guildId);
  const cantMembers = guild.memberCount;

  const members = await guild.members.fetch();
  members.forEach((member) => {
    dataset.push({
      id: member.id,
      username: member.nickname,
      username2: member.user.tag,
    });
  });

  console.log(`fec has ${cantMembers} members`);
  console.log(members.size);

  writeFileSync('./datasets/discord-users.json', JSON.stringify(dataset, null, 2));

  console.log('fec users saved!');
});
