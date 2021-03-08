import { Command, CommandMessage } from "@typeit/discord";
import currentGameState from "../util/stateManager";

export abstract class Begin {
  @Command("begin")
  async begin(command: CommandMessage) {
    console.log(currentGameState.begun);
    command.reply("the game has begun!");
    currentGameState.begun = true;
    console.log(currentGameState.begun);
}
}
