import { Command, CommandMessage } from "@typeit/discord";
import currentGameState from "../util/stateManager";

export abstract class Register {
  @Command("register")
  async register(command: CommandMessage) {
    const welcomeMessage = await command.author.send('Welcome to Del\'s awful Yankee swap bot!\n\n Simply message me with the command `!addgame <INSERT_GAME_CODE_HERE> <INSERT_GAME_LINK_HERE>` to add your game to the yankee swap!');
    welcomeMessage.react('🔥');
    // command.author.send('OI~!')
  }
}
