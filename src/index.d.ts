import type { Role } from 'discord.js';

export interface Person {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: 'person';
  _updatedAt: string;
  username: string;
  discordID?: {
    _type: 'slug';
    current: string;
  };
  fecTeam?: boolean;
  firstName?: string;
  lastName?: string;
  linkedin?: `https://www.linkedin.com/in/${string}/`;
  photo?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
}

export type Persons = Person[];

export interface Mentor {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: 'mentor';
  _updatedAt: string;
  calendly: string;
  description: string;
  isActive: boolean;
  linkedin: string;
  name: string;
  person: Person;
}

export interface DiscordUser {
  id: string;
  username: string | null;
  username2: string;
  roles: Role[];
}

export type DiscordUsers = DiscordUser[];
