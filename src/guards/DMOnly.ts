import { ArgsOf, GuardFunction } from '@typeit/discord';

export const DMOnly: GuardFunction = async ([message]: ArgsOf<'commandMessage'>, client, next) => {
    if (message.channel.type === 'dm') {
        await next();
    }
};
