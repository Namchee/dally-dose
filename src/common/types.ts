import { Message } from 'discord.js';
import { EventEmitter } from 'events';
import { TweetRepository } from '../repository/db/tweet';
import { UserRepository } from '../repository/db/user';
import { TwitterRepository } from '../repository/twitter';

// Bot context, useful for dependency injection purposes
export interface Context {
  userRepository: UserRepository;
  tweetRepository: TweetRepository;
  twitterRepository: TwitterRepository;
  emitter: EventEmitter;
}

// Complete definition for command handler function
export interface HandlerFunction {
  (message: Message, args: string[], ctx: Context): Promise<Message>;
}

export interface HandlerParams {
  name: string;
  description: string;
}

/**
 * Discord's command handler which is defined in the discord/commands folder
 */
export interface CommandHandler {
  command: string;
  description: string;
  params: HandlerParams[],
  example: string;
  execute: HandlerFunction;
}

// useful const
export const TWEET_INSERT = Symbol('INSERT');
export const RETWEET = Symbol('RETWEET');
export const INSTANT_RETWEET = Symbol('INSTANT_RETWEET');
