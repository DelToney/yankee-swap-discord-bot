import { MessageEmbed, User } from "discord.js";

export class Game {
    gameKey!: string;
    gameLink!: string;
    donator!: User;
    currentGiftHolder?: User = null; 
    embed?: MessageEmbed = null;
}

export class Gamer {
    user!: User;
    turnNumber?: number;
}

class GameState {
    begun: boolean = false;
    giftPool: Map<User['id'], Game> = new Map();
    registeredGamers: Gamer[] = [];
}

const currentGameState = new GameState();

export default currentGameState;
