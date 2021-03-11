import { Command, CommandMessage, Guard } from "@typeit/discord";
import { DMOnly } from "../guards/DMOnly";
import currentGameState from "../util/stateManager";

export abstract class AddGame {
    @Command("addgame :gameCode :gameLink")
    @Guard(DMOnly)
  async addGame(command: CommandMessage) {
    debugger
    const { gameCode, gameLink } = command.args;
    currentGameState.giftPool[command.author.id] = { gameCode, gameLink };
    console.log(currentGameState.giftPool);
  }
}
