import { Client } from 'discord.js';
import { config } from 'dotenv';
import { DallyDoseBot } from './discord/bot';
import { TwitterService } from './service/twitter';
import Twitter from 'twitter-lite';
import { TweetRepository } from './repository/tweet';
import { UserRepository } from './repository/user';
import { MongoClient } from 'mongodb';

(async function() {
  if (process.env.NODE_ENV === 'development') {
    config();
  }

  const dbClient = await MongoClient.connect(
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  );
  const db = dbClient.db();
  const tweetRepository = new TweetRepository(db);
  const userRepository = new UserRepository(db);

  if (!process.env.CONSUMER_TOKEN || !process.env.CONSUMER_SECRET) {
    throw new Error('Twitter tokens has not been set');
  }

  if (!process.env.DISCORD_TOKEN) {
    throw new Error('Discord token has not been set');
  }

  const discordClient = new Client();
  const twitterClient = new Twitter({
    consumer_key: process.env.CONSUMER_TOKEN,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_TOKEN,
    access_token_secret: process.env.TWITTER_SECRET,
  });

  const twitterService = new TwitterService(twitterClient);

  const bot = new DallyDoseBot(
    discordClient,
    { twitterService, tweetRepository, userRepository },
  );

  try {
    const feedback = await bot.start(process.env.DISCORD_TOKEN);

    if (process.env.NODE_ENV === 'development') {
      if (feedback) {
        console.log('DallyDose successfully connected to Discord server!');
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }

    throw err;
  }
})();
