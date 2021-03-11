import { MessageEmbed, User } from "discord.js";

class Game {
    gameKey: string;
    gameLink: string;
    embed: MessageEmbed;
}

class GameState {
    begun: boolean = false;
    giftPool: Map<User['id'], Game> = new Map();
    registeredGamers: User['id'];
}

const currentGameState = new GameState();

export default currentGameState;
