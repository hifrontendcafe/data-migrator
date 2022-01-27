import sanityClient from '../loaders/sanity.js';
import { readFile } from 'fs/promises';
import config from '../config.js';

/**
 * @typedef {{ id: string; name: string; }} Role
 */

/** @typedef {Role[]} Roles */

/**
 * @param {Roles} roles
 * @returns
 */
function buildPatches(roles) {
  /** @type {{ _type: "role", name: string }[]} */
  const patches = roles.map((role) => ({
    _type: 'role',
    _id: role.id,
    name: role.name,
  }));

  return patches;
}

/**
 * @param {ReturnType<buildPatches>} patches
 * @returns
 */
const createTransaction = (patches) => {
  const tx = sanityClient.transaction();

  patches.forEach((patch) => {
    tx.create(patch);
  });

  return tx;
};

/**
 * @param {Roles} technologies
 * @returns {Promise<void>}
 */
async function migrate(technologies) {
  const patches = buildPatches(technologies);

  const transaction = createTransaction(patches);
  await transaction.commit();
}

/**
 * @param {Roles} technologies
 */
export function execMigration(technologies) {
  migrate(technologies).catch((/** @type {unknown} */ err) => {
    console.error(err);
    process.exit(1);
  });
}

async function main() {
  const rolesText = await readFile(`${config.datasetsDir}/raw/pg-roles.json`);
  const roles = JSON.parse(rolesText.toString());
  console.log(roles);
  execMigration(roles);
}

main();
