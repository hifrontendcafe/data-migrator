import sanityClient from '../../loaders/sanity.js';

export function getMentors() {
  return sanityClient.fetch('*[_type == "mentor"]{..., "person": persona->, "topics": topics[]->}');
}

export function getPersons() {
  return sanityClient.fetch("*[_type == 'person']");
}

export function getPersonsWithoutIds() {
  return sanityClient.fetch("*[_type == 'person' && !defined(discordID)]");
}

export function getCmykParticipants() {
  return sanityClient.fetch('*[_type == "cmykParticipant"]{..., "person": discordUser->}');
}

export function getReactGroupsParticipants() {
  return sanityClient.fetch(
    `*[_type == "reactGroup"]{
      ...,
      "captain": teamCaptain->,
      "participants": participants[]->
    }`,
  );
}
