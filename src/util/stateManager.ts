import { Channel, EmojiResolvable, MessageEmbed, TextChannel, User } from 'discord.js';

export class Game {
    gameKey!: string;
    gameLink!: string;
    donator!: User;
    emoji?: EmojiResolvable;
    currentGiftHolder?: User = null;
    embed?: MessageEmbed = null;
}

export class Gamer {
    user!: User;
    selectedGift?: Game;
    turnNumber?: number;
}

class GameState {
    begun: boolean = false;
    currentTurn: number;
    gameChannel: TextChannel;
    giftPool: Map<User['id'], Game> = new Map();
    registeredGamers: Gamer[] = [];

    getAvailableGames() {
        return [...this.giftPool.entries()].filter(([id, game]) => !game.currentGiftHolder);
    }
}

const currentGameState = new GameState();

export default currentGameState;
