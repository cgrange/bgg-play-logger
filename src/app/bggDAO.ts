export const getLoggedPlays = (username: string): PlayLog[] => {

}

interface Player {
  name: string;
  userid: number; // defaults to 0
  username: string;
  repeat?: boolean; // Optional, as not all players have this field
  selected: boolean;
  avatarfile?: string; // Optional, as not all players have this field
  avatar?: boolean;    // Optional, as not all players have this field
}


enum Action {
  Save = "save"
}

enum ObjectType {
  Thing = "thing"
}

interface PlayLog {
  players: Player[];
  quantity: number;
  date: string; // ISO date string 2024-09-19T06:00:00.000Z
  twitter: boolean;
  bsky: boolean;
  location: string;
  locationfilter: string;
  minutes: number;
  hours: number;
  userfilter: string;
  objecttype: ObjectType;
  objectid: string; // string of digits
  playdate: string; // ISO date string 2024-09-19
  length: number;
  ajax: number;
  action: Action;
}

export const logPlay = (playLog: PlayLog) => {

}