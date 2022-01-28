import sanityClient from '../loaders/sanity.js';
import { readFile } from 'fs/promises';
import config from '../config.js';

/** @typedef {import('../index.js').Profile} Profile */
/** @typedef {Profile[]} Profiles */

/**
 * @param {Profiles} profiles
 * @returns
 */
function buildPatches(profiles) {
  /**
   * @type {{
   *   _type: "profile",
   *   _id: string;
   *   _createdAt: string;
   *   _updatedAt: string;
   *   role: { _type: "reference"; _ref: string; };
   *   seniority: { _type: "reference"; _ref: string; };
   *   description: string;
   *   isActive: boolean;
   *   isAvailable: boolean;
   *   location: string;
   * }[]}
   **/
  return profiles.map((profile) => ({
    _type: 'profile',
    _id: profile.id,
    _createdAt: profile.created_at,
    _updatedAt: profile.updated_at,
    role: { _type: 'reference', _ref: profile.roleId },
    seniority: { _type: 'reference', _ref: profile.seniorityId },
    description: profile.description,
    isActive: profile.active,
    isAvailable: profile.available,
    location: profile.location,
  }));
}

/**
 * @param {ReturnType<buildPatches>} patches
 * @returns
 */
const createTransaction = (patches) => {
  const tx = sanityClient.transaction();

  patches.forEach((patch, i) => {
    tx.createIfNotExists(patch);
  });

  return tx;
};

/**
 * @param {Profiles} technologies
 * @returns {Promise<void>}
 */
async function migrate(technologies) {
  const patches = buildPatches(technologies);

  const transaction = createTransaction(await patches);
  await transaction.commit();
}

/**
 * @param {Profiles} profiles
 */
export function execMigration(profiles) {
  migrate(profiles).catch((/** @type {unknown} */ err) => {
    console.error(err);
    process.exit(1);
  });
}

async function main() {
  const profilesText = await readFile(`${config.datasetsDir}/raw/pg-profiles.json`);
  const profiles = JSON.parse(profilesText.toString());
  console.log(profiles);
  execMigration(profiles);
}

main();
