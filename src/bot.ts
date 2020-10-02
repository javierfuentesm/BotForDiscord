import { config } from "dotenv";
config();
import { Client, DMChannel, Message } from "discord.js";
import { prefix } from "./config.json";
import { listDevices, listFAQ, listProjects } from "./sheet";

const client: Client = new Client();

client.on("ready", () => {
  console.log("Bot is ready");
});

client.on("message", async (message: Message) => {
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
  if (message.content.startsWith(`${prefix}proyectos`)) {
    const rows = await listProjects();

    if (rows?.length) {
      let devices = "Los Proyectos que se tienen registrados son: \n";
      rows?.map((row: any) => {
        devices += `${row[0]}\n`;
      });
      message.reply(devices);
    } else {
      console.log("No data found.");
    }
  }
  if (message.content.startsWith(`${prefix}FAQ`)) {
    const words = message.content.split(" ");
    const rows = await listFAQ();
    // @ts-ignore
    const numeroPreguntas = +rows?.length;
    if (rows?.length) {
      if (words[1].includes("todo")) {
        let preguntas = "Todas la preguntas que te puedo contestar son: \n";
        rows?.forEach((row: any, index: number) => {
          preguntas += `${index + 1} - ${row[0]}\n`;
        });
        message.reply(preguntas);
      } else if (+words[1] <= numeroPreguntas && +words[1] > 0) {
        message.reply(` ${rows[+words[1] - 1][1]}`);
      } else if (+words[1] > numeroPreguntas || +words[1] === 0) {
        message.reply("No hay ninguna opción de las que seleccionaste");
      } else {
        let respuesta =
          "No entendí tu pregunta pero aqui estan todas las preguntas que podemos contestar : \n";
        rows?.forEach((row: any, index: number) => {
          respuesta += `${index + 1} - ${row[0]}\n`;
        });
        respuesta +=
          "Puedes preguntar usando ?FAQ seguido del número de la pregunta de la cual deseas que te conteste";
        message.reply(respuesta);
      }
    } else {
      console.log("No data found.");
    }
  }
});
client.login(process.env.DISCORD_TOKEN);
