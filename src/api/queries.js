import sanityClient from "../loaders/sanity.js";
import postgresClient from "../loaders/postgres.js";

export function getMentors() {
  return sanityClient.fetch("*[_type == 'mentor']");
}

export function getPersons() {
  return sanityClient.fetch("*[_type == 'person']");
}

export async function getProfiles() {
  const result = await postgresClient.query('SELECT * FROM "Profile"');
  postgresClient.end();
  return result.rows;
}
