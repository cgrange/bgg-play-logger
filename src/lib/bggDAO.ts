import { z } from 'zod';
import xml2js from 'xml2js';

const PlayerSchema = z.object({
    $: z.object({
        username: z.string(),
        userid: z.string(),
        name: z.string(),
        startposition: z.string(),
        color: z.string(),
        score: z.string(),
        new: z.string(),
        rating: z.string(),
        win: z.string(),
    }),
});

const PlayersSchema = z.object({
    player: z.array(PlayerSchema),
});

const SubtypeSchema = z.object({
    $: z.object({
        value: z.string(),
    }),
});

const SubtypesSchema = z.object({
    subtype: z.array(SubtypeSchema),
});

const ItemSchema = z.object({
    $: z.object({
        name: z.string(),
        objecttype: z.string(),
        objectid: z.string(),
    }),
    subtypes: z.array(SubtypesSchema),
});

const PlaySchema = z.object({
    $: z.object({
        id: z.string(),
        date: z.string(),
        quantity: z.string(),
        length: z.string(),
        incomplete: z.string(),
        nowinstats: z.string(),
        location: z.string(),
    }),
    item: z.array(ItemSchema),
    players: z.array(PlayersSchema).optional(),
});

const PlaysSchema = z.object({
    $: z.object({
        username: z.string(),
        userid: z.string(),
        total: z.string(),
        page: z.string(),
        termsofuse: z.string(),
    }),
    play: z.array(PlaySchema),
});

const RootSchema = z.object({
    plays: PlaysSchema,
});

export { RootSchema };

type Root = z.infer<typeof RootSchema>;

export const getLoggedPlays = async (username: string): Promise<PlayLog[]> => {
    const response = await fetch(`https://www.boardgamegeek.com/xmlapi2/plays?username=${username}`)
    const xmlString = await response.text()
    const xmlParser = new xml2js.Parser()
    const json = await xmlParser.parseStringPromise(xmlString)
    const Root = RootSchema.parse(json)
    const plays = Root.plays.play.map((play) => {
        const players = play.players
            ? play.players[0].player.map((player) => ({
                name: player.$.name,
                userid: parseInt(player.$.userid),
                username: player.$.username,
                selected: false,
            }))
            : [];
        return {
            players,
            quantity: parseInt(play.$.quantity),
            date: play.$.date,
            twitter: false,
            bsky: false,
            location: play.$.location,
            locationfilter: "",
            minutes: 0,
            hours: 0,
            userfilter: "",
            objecttype: play.item[0].$.objecttype as ObjectType,
            objectid: play.item[0].$.objectid,
            playdate: play.$.date.split("T")[0],
            length: parseInt(play.$.length),
            ajax: 0,
            action: Action.Save
        }
    })
    return plays
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