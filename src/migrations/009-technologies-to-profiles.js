import { client } from '../loaders/sanity.js';
import { readFile } from 'fs/promises';
import config from '../config.js';

/** @typedef {import('..').ProfileTechnology} ProfileTechnology */

/** 
  @param {ProfileTechnology[]} relations
*/
const buildPatches = (relations) => {
  /** @type {Map<string, string[]>} */
  const profilesWithTechnologies = new Map();

  relations.forEach((relation) => {
    const existRelation = profilesWithTechnologies.get(relation.A);

    profilesWithTechnologies.set(relation.A, existRelation ? existRelation.concat(relation.B) : [relation.B]);
  });

  const operations = Array.from(profilesWithTechnologies.entries()).map(([profileId, technologies]) => ({
    _type: 'profile',
    _id: profileId,
    technologies: technologies.map((id) => ({
      _type: 'reference',
      _ref: id,
    })),
  }));

  console.log(operations);

  return operations;
};

/**
 * @param {ReturnType<buildPatches>} operations
 */
export async function createTransaction(operations) {
  const transaction = client.transaction();

  /** @type {Array<{ _id: string }>} */
  const profiles = await client.fetch(`*[_type == "profile"]`);

  /** @type {string[]} */
  const profilesIds = profiles.map((profile) => profile._id);

  operations.forEach((operation) => {
    if (!profilesIds.includes(operation._id)) return;

    transaction.patch(operation._id, {
      set: {
        ...operation,
      },
    });
  });

  return transaction;
}

/**
 * @param {ProfileTechnology[]} relations
 */
async function migrate(relations) {
  const patches = buildPatches(relations);

  const transaction = await createTransaction(patches);

  await transaction.commit({ autoGenerateArrayKeys: true });
}

/**
 *
 * @param {ProfileTechnology[]} relations
 */
export function execMigration(relations) {
  migrate(relations).catch((err) => {
    console.log(err);
    process.exit(1);
  });
}

async function main() {
  const relationsText = await readFile(`${config.datasetsDir}/raw/pg-profile-technologies.json`);
  const relations = JSON.parse(relationsText.toString());

  execMigration(relations);
}

main();
