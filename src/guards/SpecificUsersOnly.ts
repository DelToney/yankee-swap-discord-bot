import { ArgsOf, GuardFunction } from '@typeit/discord';
import { User } from 'discord.js';

export const SpecificUser = (users: User['id'][]) => {
    const guard: GuardFunction = async ([message]: ArgsOf<'commandMessage'>, client, next) => {
        if (users.includes(message.author.id)) {
            return next();
        }
    };

    return guard;
};
