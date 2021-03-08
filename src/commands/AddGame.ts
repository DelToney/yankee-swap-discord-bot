import { Command, CommandMessage, Guard } from "@typeit/discord";
import { DMOnly } from "../guards/DMOnly";
import currentGameState from "../util/stateManager";

export abstract class AddGame {
    @Command("addgame :gameCode :gameLink")
    @Guard(DMOnly)
  async addGame(command: CommandMessage) {
      console.log(command.args);
  }
}
