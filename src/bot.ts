import { config } from "dotenv";
config();
import { Client, DMChannel, Message } from "discord.js";
import { prefix } from "./config.json";
import { listDevices } from "./sheet";

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

  if (message.content.startsWith(`${prefix}dispositivos`)) {
    const rows = await listDevices();

    if (rows?.length) {
      let devices =
        "Dispositivo, OS: \n Los dispositivos que tenemos son los siguientes:\n";

      rows?.map((row: any) => {
        devices += `${row[0]}, ${row[1]} \n`;
      });
      message.reply(devices);
    } else {
      console.log("No data found.");
    }
  }
});
client.login(process.env.DISCORD_TOKEN);
