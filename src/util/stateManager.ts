import { EmojiResolvable, MessageEmbed, TextChannel, User } from 'discord.js';

export class Game {
    gameKey!: string;
    gameTitle!: string;
    gameLink!: string;
    donator!: User;
    emoji?: EmojiResolvable;
    embed?: MessageEmbed;
    claimed: boolean = false;
}

export class Gamer {
    user!: User;
    selectedGift?: keyof GameState['giftPool'];
    turnNumber?: number;
}

type GameState = {
    begun: boolean;
    currentTurn?: number;
    gameChannel?: TextChannel;
    // keyed by discord user id
    giftPool: { [key: string]: Game };
    registeredGamers: Gamer[];
};

const currentGameState: GameState = {
    begun: false,
    giftPool: {},
    registeredGamers: [],
};

export function getUnclaimedGames(): Game[] {
    const claimedGamerIds: (string | number)[] = currentGameState.registeredGamers
        .map((g) => g.selectedGift)
        .filter((e) => e);
    const unclaimedGamers = currentGameState.registeredGamers.filter((gmr) => !claimedGamerIds.includes(gmr.user.id));
    return unclaimedGamers.map((gmr) => currentGameState.giftPool[gmr.user.id]);
}
export function getClaimedGames(): Game[] {
    return currentGameState.registeredGamers
        .filter((e) => e.selectedGift)
        .map((gmr) => currentGameState.giftPool[gmr.selectedGift]);
}

export default currentGameState;
