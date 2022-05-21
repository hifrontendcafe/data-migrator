import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import config from './config.js';
import queries from './queries.js';

export async function saveQueries() {
  console.info('init queries');
  const rawPath = `${config.datasetsDir}/raw`;

  if (!existsSync(rawPath)) {
    mkdirSync(rawPath);
  }

  for (const query of queries) {
    console.log(`Start Query: ${query.fetch.name}`);
    await query.fetch().then(async (data) => {
      console.log(`writing ${query.file}`);
      await writeFile(query.file, JSON.stringify(data, null, 2));
    });
    console.log(`End Query: ${query.fetch.name}`);
  }
}
