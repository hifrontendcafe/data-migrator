import { readFile } from 'fs/promises';
import { APIErrorCode, ClientErrorCode, isNotionClientError } from '@notionhq/client';
import config from '../config.js';
import { client } from '../loaders/notion.js';

/**
 * @typedef {{
 *   name?: string;
 *   status?: "ACTIVE" | "NOT_AVAILABLE" | "INACTIVE" | "OUT";
 *   email?: string;
 *   github?: string;
 *   linkedin?: string;
 *   twitter?: string;
 *   instagram?: string;
 * }} Mentor
 */

const mentorsFile = 'datasets/raw/mentors.json';

/**
 * @returns {Promise<import('./populate-notion-mentors.js').Mentor[]>}
 */
async function readMentorsFromFile() {
  const file = await readFile(mentorsFile);
  return JSON.parse(file.toString());
}

const databaseId = config.notion.mentorsDatabaseId;

/**
 * @param {Mentor} mentor
 */
export async function addMentor({ name, email, instagram, linkedin, twitter, github, status }) {
  const statuses = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    NOT_AVAILABLE: 'No disponible',
    OUT: 'Fuera del programa',
  };

  try {
    const response = await client.pages.create({
      parent: { database_id: databaseId },
      properties: {
        ...(name && {
          Name: {
            type: 'title',
            title: [{ text: { content: name } }],
          },
        }),
        ...(email && {
          Mails: {
            type: 'email',
            email: email,
          },
        }),
        ...(instagram && {
          Instagram: {
            type: 'url',
            url: instagram,
          },
        }),
        ...(linkedin && {
          Linkedin: {
            type: 'url',
            url: linkedin,
          },
        }),
        ...(twitter && {
          Twitter: {
            type: 'url',
            url: twitter,
          },
        }),
        ...(github && {
          Github: {
            type: 'url',
            url: github,
          },
        }),
        ...(status && {
          Estado: {
            type: 'select',
            select: { name: statuses[status] },
          },
        }),
      },
    });
    console.log(response);
    console.log('Success! Entry added.');
  } catch (error) {
    if (isNotionClientError(error)) {
      // error is now strongly typed to NotionClientError
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          console.error(error.message);
          break;
        case APIErrorCode.ObjectNotFound:
          console.error(error.body);
          break;
        case APIErrorCode.Unauthorized:
          console.error(error.body);
          break;
        default:
          throw new Error('should never happen');
      }
    } else {
      console.error(error);
    }
  }
}

readMentorsFromFile().then((mentors) => {
  mentors.forEach((mentor) => {
    addMentor({
      name: mentor.name ?? '',
      email: mentor.person.email ?? '',
      github: mentor.github ?? mentor.person.github ?? '',
      instagram: mentor.person.instagram ?? '',
      linkedin: mentor.linkedin ?? mentor.person.linkedin ?? '',
      twitter: mentor.person.twitter ?? '',
      status: mentor.status,
    });
  });
});
