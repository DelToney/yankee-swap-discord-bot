import { Command, CommandMessage } from "@typeit/discord";
import currentGameState, { Gamer } from "../util/stateManager";

export abstract class Begin {
  @Command("begin")
  async begin(command: CommandMessage) {
    generateTurnOrder(currentGameState.registeredGamers);
    command.reply("the game has begun!");
    currentGameState.begun = true;

  }
}

function generateTurnOrder (registeredGamers: Gamer[]) {
  registeredGamers.forEach((gamer, i) => {
    gamer.turnNumber = i; //TODO: Make this random from 0-list length and unique
  })
}
