import { ArgsOf, GuardFunction } from '@typeit/discord';

export const ChannelOnly: GuardFunction = async ([message]: ArgsOf<'commandMessage'>, client, next) => {
    if (message.channel.type === 'text') {
        await next();
    }
};
