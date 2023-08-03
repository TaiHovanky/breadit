import { z } from 'zod';

// lets you validate object sent to server matches schema. strips off unnneccesary properties
export const SubredditValidator = z.object({
  name: z.string().min(3).max(21)
});

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string()
});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;