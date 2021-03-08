import { ArgsOf, GuardFunction } from "@typeit/discord";

export const DMOnly = (text: string) => {
  const guard: GuardFunction = async (
    [message]: ArgsOf<"commandMessage">,
    client,
    on,
    next
  ) => {
    if (message.channel.type === 'dm') {
        await next();
    }
  };

  return guard;
};
