import { CommandNotFound, Discord, Command, CommandMessage, On, ArgsOf, Client } from "@typeit/discord";
import { MessageEmbed } from "discord.js";
import * as Path from "path";

@Discord("!", {
  import: [
    Path.join(__dirname, '..', 'commands', '*.ts'),
    Path.join(__dirname, '..', 'commands', '*.js'),
  ]
})
export abstract class DiscordApp {
  @On("message")
  onMessage(
    [message]: ArgsOf<"message">,
    client: Client
  ) {
    if (message.channel.type === 'dm' && !message.author.bot) {
      setTimeout(() => {
        console.log(message);
        const messageEmbedded: MessageEmbed = message.embeds[0];
        message.reply('squa', {embed: messageEmbedded})
      }, 3000);
      
    }
  }

  @CommandNotFound()
  notFoundA(command: CommandMessage) {
    command.reply("Command not found");
  }
}
