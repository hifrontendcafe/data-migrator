import type { Role } from 'discord.js';

export interface ProfilePhoto {
  id: string;
  description: string;
  type: string;
  src: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  available: boolean;
  active: boolean;
  twitter: string;
  github: string;
  portfolio: string;
  discord: string;
  description: string;
  location: string;
  linkedin: string;
  photo: string;
  created_at: string;
  updated_at: string;
  roleId: string;
  seniorityId: string;
  discordId: string;
}

export type ProfileTechnology = {
  A: string;
  B: string;
}

export type Profiles = Profile[];

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

export type People = Person[];

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

export interface Doc {
  _id: string;
  title: string;
  content: string;
  slug: {
    _type: 'slug'
    current: string;
  },
}