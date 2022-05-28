import { APIErrorCode, ClientErrorCode, isNotionClientError } from '@notionhq/client';
import config from '../../config.js';
import { client } from '../../loaders/notion.js';

const databaseId = config.notion.mentorsDatabaseId;

export async function listMentors() {
  try {
    const response = await client.databases.retrieve({ database_id: databaseId });
    return response;
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
