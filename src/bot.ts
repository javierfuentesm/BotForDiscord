import { config } from "dotenv";
config();
import { Client, DMChannel, Message } from "discord.js";
import { prefix } from "./config.json";

const client: Client = new Client();
client.on("ready", () => {
  console.log("Bot is ready");
});

client.on("message", async (message: Message) => {
  console.log(message.content);
  if (message.content.startsWith(`${prefix}ping`)) {
    //message.channel.send("Pong 💩");
    message.reply("Pong 💩");
  }
  if (message.content.startsWith(`${prefix}kick`)) {
    if (message.member?.hasPermission(["KICK_MEMBERS"])) {
      const member = message.mentions.members?.first();
      console.log(member);
      if (member) {
        const kickedMember = await member.kick();
        message.channel.send(
          `${kickedMember.user.username} ha sido expulsado 😈`
        );
      }
    } else {
      await message.reply(
        "Quien te crees ? NO tienes permisos para hacer esta acción"
      );
    }
  }
  if (message.content.startsWith(`${prefix}deleteMessages`)) {
    try {
      const messages = await message.channel.messages.fetch();
      if (!(message.channel instanceof DMChannel)) {
        await message.channel.bulkDelete(messages);
      }
    } catch (e) {
      console.error(e);
    }
  }
});
client.login(process.env.DISCORD_TOKEN);
