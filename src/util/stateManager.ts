import { Emoji, EmojiResolvable, MessageEmbed, TextChannel, User } from 'discord.js';
import { messages } from './script.i18n';

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
    selectedGift?: string;
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

export function updateGamerHeldGame(recieverId: User['id'], donatorId: User['id']) {
    const recieverIndex = currentGameState.registeredGamers.findIndex((gmr) => recieverId === gmr.user.id);
    currentGameState.registeredGamers[recieverIndex] = {
        ...currentGameState.registeredGamers[recieverIndex],
        selectedGift: donatorId,
    };
}
export function getGamerByUserId(id: User['id']): Gamer {
    return currentGameState.registeredGamers.find((gmr) => gmr.user.id === id);
}
export function getGamerHoldingGiftByEmojiIdentifier(id: Emoji['identifier']): Gamer {
    let targetUser = '';
    for (const uid in currentGameState.giftPool) {
        const game: Game = currentGameState.giftPool[uid];
        if (game.emoji === `<:${id}>`) {
            targetUser = uid;
        }
        return currentGameState.registeredGamers.find((u: Gamer) => u.user.id === uid);
    }
    console.warn('No gamer found for that emoji!');
    return null;
}

export function swapGamersGames(from: Gamer, to: Gamer): void {
    if (from.selectedGift) {
        updateGamerHeldGame(to.user.id, from.selectedGift);
    }
    debugger;
    if (!to.selectedGift) {
        const unclaimed = getUnclaimedGames();
        const randomGift = unclaimed[Math.floor(Math.random() * unclaimed.length)];
        currentGameState.gameChannel.send(messages.gamerGotGame(from.user, randomGift.gameTitle), {
            embed: randomGift.embed,
        });
        updateGamerHeldGame(from.user.id, randomGift.donator.id);
    }
}

export default currentGameState;
