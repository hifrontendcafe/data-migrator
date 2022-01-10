import { getMentors, getPersons, getProfiles } from "./api/queries.js";
import { writeFileSync } from "fs";

getMentors().then((mentors) => {
  writeFileSync("./datasets/mentors.json", JSON.stringify(mentors, null, 2));
});

getPersons().then((persons) => {
  writeFileSync("./datasets/persons.json", JSON.stringify(persons, null, 2));
});

getProfiles().then((profiles) => {
  writeFileSync("./datasets/profiles.json", JSON.stringify(profiles, null, 2));
});
