export interface Mentor {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  calendly: string;
  description: string;
  isActive?: boolean | null;
  linkedin?: string | null;
  name: string;
  person: Person;
  persona: AssetOrPersona;
  photo?: Photo | null;
  status?: 'ACTIVE' | 'NOT_AVAILABLE' | 'INACTIVE' | 'OUT';
  topics?: TopicsEntity[] | null;
  github?: string | null;
  web?: string | null;
}
export interface Person {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  discordID: DiscordID;
  fecTeam?: boolean | null;
  firstName: string;
  lastName: string;
  linkedin?: string | null;
  photo: Photo1;
  username: string;
  email?: string | null;
  fromProfile?: boolean | null;
  github?: string | null;
  instagram?: string | null;
  portfolio?: string | null;
  twitter?: string | null;
  timezone?: string | null;
}
export interface DiscordID {
  _type: string;
  current: string;
}
export interface Photo1 {
  _type: string;
  asset: AssetOrPersona;
  crop?: Crop | null;
  hotspot?: Hotspot | null;
}
export interface AssetOrPersona {
  _ref: string;
  _type: string;
}
export interface Crop {
  _type: string;
  bottom: number;
  left: number;
  right: number;
  top: number;
}
export interface Hotspot {
  _type: string;
  height: number;
  width: number;
  x: number;
  y: number;
}
export interface Photo {
  _type: string;
  asset: AssetOrPersona;
  alt?: string | null;
}
export interface TopicsEntity {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  title: string;
}
