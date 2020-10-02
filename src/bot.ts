import { config } from "dotenv";
config();
import { Client, DMChannel, Message } from "discord.js";
import { prefix } from "./config.json";
import { listDevices, listFAQ, listProjects, listCompetencias } from "./sheet";

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
  if (message.content.startsWith(`${prefix}recurso`)) {
    if (message.member?.hasPermission(["KICK_MEMBERS"])) {
      const rows = await listCompetencias();
      const parametros = message.content.toUpperCase().split(" ");
      console.log(parametros);

      if (
        rows?.length &&
        rows?.map((row) => row[0].includes(parametros[1])).includes(true)
      ) {
        // @ts-ignore
        const personas = rows?.filter((row) =>
          row.find((element) => element.includes(parametros[1]))
        );
        const encabezados = rows[0];
        let respuesta =
          "Esta persona cumple con el nombre que has ingresado: \n";
        personas?.forEach((persona: any, index: number) => {
          // @ts-ignore
          persona.forEach((habilidad: any, index: any) => {
            respuesta += `${encabezados[index]} : ${persona[index]} \n`;
          });
          if (respuesta.length <= 2000) {
            message.reply(respuesta);
          } else {
            message.reply(
              `La información de ${persona[0]} es tan larga que no puede ser impresa`
            );
          }
          respuesta =
            "Esta persona tambien cumple con los criterios de búsqueda: \n";
        });
      } else {
        message.reply("No pude encontrar a nadie con ese nombre");
      }
    } else {
      message.reply(
        "No tienes permisos para consultar información de los recursos"
      );
    }
  }
  if (message.content.startsWith(`${prefix}FAQ`)) {
    const parametros = message.content.split(" ");
    const rows = await listFAQ();
    // @ts-ignore
    const numeroPreguntas = +rows?.length;
    if (rows?.length) {
      if (parametros[1]) {
        if (parametros[1].includes("todo")) {
          let preguntas = "Todas la preguntas que te puedo contestar son: \n";
          rows?.forEach((row: any, index: number) => {
            preguntas += `${index + 1} - ${row[0]}\n`;
          });
          message.reply(preguntas);
        } else if (+parametros[1] <= numeroPreguntas && +parametros[1] > 0) {
          message.reply(` ${rows[+parametros[1] - 1][1]}`);
        } else if (+parametros[1] > numeroPreguntas || +parametros[1] === 0) {
          message.reply(
            "No hay ninguna opción de las que seleccionaste si quieres ver toda la lista de FAQ solo teclea '?FAQ todo' "
          );
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
        let respuesta =
          "No me mandaste ninguna pregunta aquí estan las preguntas que estan en mi Base de datos : \n";
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
