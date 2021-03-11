import { Command, CommandMessage, Guard } from "@typeit/discord";
import { DMOnly } from "../guards/DMOnly";
import { Game } from "../util/stateManager"
import currentGameState from "../util/stateManager";
import { NotBot } from "../guards/NotBot";
import * as turnOrderTemplate from "../util/playerOrderTemplate.json"
import { MessageEmbedOptions } from "discord.js";
import { getTypeParameterOwner } from "typescript";

export abstract class ListPlayerOrder {
    @Command("list")
    @Guard(DMOnly, NotBot)
  async listPlayerOrder(command: CommandMessage) {
    const playerOrderEmbed: MessageEmbedOptions = turnOrderTemplate;

    const sortedGames = currentGameState.registeredGamers.sort((a, b) => a.turnNumber - b.turnNumber);

    sortedGames.forEach((gamer, i) => {
      playerOrderEmbed.fields.push({
        name:  gamer.user.username,
        value: `    ${i + 1}`,
      })
    }
    )

    command.reply('', { embed: playerOrderEmbed })
  }
}
