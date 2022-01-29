import sanityClient, { client } from '../loaders/sanity.js';
import { readFile } from 'fs/promises';
import config from '../config.js';
import { v4 as uuidv4 } from 'uuid';

/** @typedef {import('..').ProfilePhoto} ProfilePhoto */

/**
 * @param { ProfilePhoto[] } photos
 */
function buildPatches(photos) {
  return photos.map((photo) => ({
    blob: Buffer.from(photo.src, 'base64'),
    type: photo.type,
    description: photo.description,
    owner: photo.id,
  }));
}

/**
 * @param {ReturnType<buildPatches>} operations
 * @returns
 */
async function command(operations) {
  let i = 1;
  for (const operation of operations) {
    try {
      const image = await sanityClient.assets.upload('image', operation.blob, {
        contentType: operation.type,
        description: operation.description,
        title: operation.owner,
        filename: operation.owner,
      });

      await sanityClient
        .patch(operation.owner, {
          set: {
            photo: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: image._id,
              },
            },
          },
        })
        .commit();
    } catch (err) {
      console.log(err);
    }

    console.log(`processed ${i} photos`);
    i++;
  }
}

/**
 * @param { ProfilePhoto[] } photos
 * @returns {Promise<void>}
 */
async function migrate(photos) {
  const patches = buildPatches(photos);

  command(patches);
}

/**
 * @param { ProfilePhoto[] } photos
 */
export function execMigration(photos) {
  migrate(photos).catch((/** @type {unknown} */ err) => {
    console.error(err);
    process.exit(1);
  });
}

async function main() {
  const profilesText = await readFile(`${config.datasetsDir}/derived/photos3.json`);
  const profiles = JSON.parse(profilesText.toString());
  execMigration(profiles);
}

main();
