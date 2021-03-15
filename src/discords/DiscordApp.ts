import { CommandNotFound, Discord, Command, CommandMessage, On, ArgsOf, Client, Guard } from '@typeit/discord';
import { Guild, MessageEmbed } from 'discord.js';
import * as Path from 'path';
import { SpecificUser } from '../guards/SpecificUsersOnly';

@Discord('!', {
    import: [Path.join(__dirname, '..', 'commands', '*.ts'), Path.join(__dirname, '..', 'commands', '*.js')],
})
export abstract class DiscordApp {
    @On('message')
    @Guard(SpecificUser(['110862236636971008']))
    onMessage([message]: ArgsOf<'message'>, client: Client) {
        console.log(message);
    }

    @CommandNotFound()
    notFoundA(command: CommandMessage) {
        command.reply('Command not found');
    }
}
