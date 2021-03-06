import { config } from "dotenv";
config();
import { Client, DMChannel, Message } from "discord.js";
import { prefix } from "./config.json";
import {
  listDevices,
  listFAQ,
  listProjects,
  listCompetencias,
  listRecursos,
  listWiki,
  listTuto,
  updateData,
  listInfo,
  listCurso,
  appendReport,
  listScenarios,
} from "./sheet";
import { informe } from "./navegador";
import { GMailService } from "./emails";

const bot: Client = new Client();
bot.on("ready", () => {
  console.log("Bot is ready");
  async function birthDays() {
    const recursos = await listRecursos();
    const today = new Date();
    const mes = today.getMonth() + 1;
    let dia: any = today.getDate();
    if (dia.toString().length === 1) {
      dia = `0${dia}`;
    }
    const fecha = dia + "/" + mes + "/";
    const birthdays = recursos?.filter((recurso) =>
      recurso[3].startsWith(fecha)
    );
    const anuncios = bot.channels.cache.find(
      // @ts-ignore
      (channel) => channel?.name === "anuncios"
    );
    birthdays?.forEach((birthday) =>
      // @ts-ignore
      anuncios?.send(
        `@here Estas son las mañanitas que cantaba el rey David .....Feliz cumpleaños a ${birthday[0]}  no te preocupes no diremos cuantos cumples 🙊🙊`
      )
    );
  }
  birthDays();
  setInterval(birthDays, 86400000);
});
bot.on("message", async (message: Message) => {
  if (
    message.webhookID === "770736134882852884" ||
    (message.content.startsWith(`${prefix}sheet`) &&
      // @ts-ignore
      message.member?._roles?.includes("762744622467776522"))
  ) {
    const [casos, casosTotal, elements, buildJenkins] = await informe();
    if (elements) {
      const scenarios = await listScenarios();
      const findId = (name: any) =>
        scenarios.find(
          (scenario: { NAME_TC: any }) => scenario.NAME_TC === name
        ).ID_TC;
      let finalElements: any[][] = [];
      // @ts-ignore
      elements?.forEach((element: { scenarios: any[]; feature: any }) => {
        element.scenarios.forEach(async (scenario: any) => {
          finalElements.push([
            findId(scenario.scenarioName),
            element.feature,
            scenario.scenarioName,
            scenario.date,
            scenario.status,
          ]);
        });
      });
      await appendReport(finalElements);

      let respuesta = `La información ya debería de estar en el googlesheet que corresponden al build ${buildJenkins} , hubo ${casosTotal} casos en total y este es un pequeño resumen \n`;
      // @ts-ignore
      casos?.forEach((caso) => {
        console.log(caso);
        respuesta += `Feature :${caso.nombre} ${
          caso.exito ? `#Scenarios exitosos :${caso.exito}` : ""
        } ${caso.error ? `#Scenarios fallidos :${caso.error}` : ""}\n`;
      });
      message.reply(respuesta);
    }
  }
  if (message.content.startsWith(`${prefix}ping`)) {
    //message.channel.send("Pong 💩");
    message.reply("Pong 💩");
  }
  if (message.content.startsWith(`${prefix}kick`)) {
    if (message.member?.hasPermission(["KICK_MEMBERS"])) {
      const member = message.mentions.members?.first();
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
  if (message.content.startsWith(`${prefix}reporte`)) {
    const [casos, casosTotal] = await informe();

    if (casos?.length) {
      let resultado = `En total se ejecutaron ${casosTotal} casos de prueba: \n`;
      // @ts-ignore
      casos?.forEach((caso) => {
        console.log(caso);
        resultado += `Feature :${caso.nombre} ${
          caso.exito ? `#Scenarios exitosos :${caso.exito}` : ""
        } ${caso.error ? `#Scenarios fallidos :${caso.error}` : ""}\n`;
      });
      message.reply(resultado);
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
  if (message.content.startsWith(`${prefix}curso`)) {
    // @ts-ignore
    if (message.member?._roles?.includes("762744622467776522")) {
      const students = await listCurso();

      if (students?.length) {
        let goodStudents: {}[] = [];
        const encabezados = students[0];

        students?.map((student: any) => {
          if (student.length > 5) {
            let goodStudent = {};
            student.forEach((element: any, index: string | number) => {
              // @ts-ignore
              goodStudent[`${encabezados[index]}`] = student[index];
            });
            // @ts-ignore
            goodStudent.FinalGrade =
              // @ts-ignore
              ((goodStudent.Homework1 === "" ? 0 : 10) +
                // @ts-ignore
                (goodStudent.Homework2 === "" ? 0 : +goodStudent.Homework2) +
                // @ts-ignore
                (goodStudent.GradeExam === undefined
                  ? 0
                  : // @ts-ignore
                  goodStudent.GradeExam === ""
                  ? 0
                  : // @ts-ignore
                    +goodStudent.GradeExam)) /
              3;

            goodStudents.push(goodStudent);
          }
        });
        let gmailService = new GMailService();
        goodStudents.shift();
        const emailTimeout = (student: any, index: number) => {
          console.log(student);
          setTimeout(
            () =>
              gmailService.sendMail(
                "Estatus del curso de  Git y GitHub",
                "Git y GitHub",
                student
              ),
            index * 5000
          );
        };

        goodStudents.forEach((student: any, index) => {
          emailTimeout(student, index);
        });
        message.reply("Se estan mandado los correos con el status");
      } else {
        console.log("No data found.");
      }
    } else {
      message.reply("No tienes permisos para realizar esta acción");
    }
  }
  if (message.content.startsWith(`${prefix}datos`)) {
    const parametros = message.content.split(" ");

    const info = await listInfo();
    let indexFinal: any;
    const persona = info?.filter((row, index) =>
      row.find((element) => {
        if (element.includes("11")) {
          indexFinal = index;
          return element.includes("11");
        }
      })
    );

    const rows = await updateData(indexFinal);

    if (persona?.length) {
      let cambios = "Se actualizo: \n";
      rows?.map((row: any) => {
        cambios += `${row[0]}\n`;
      });
      message.reply(cambios);
    } else {
      console.log("No data found.");
    }
  }
  if (message.content.startsWith(`${prefix}competencias`)) {
    // @ts-ignore
    if (message.member?._roles?.includes("762744622467776522")) {
      const rows = await listCompetencias();
      const parametros = message.content.toUpperCase().split(" ");

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
            respuesta += `${encabezados[index]} : ${
              persona[index] === ""
                ? "Gis no ha llenado la información 🙃"
                : persona[index]
            } \n`;
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
  if (message.content.startsWith(`${prefix}recurso`)) {
    // @ts-ignore
    if (message.member?._roles?.includes("762744622467776522")) {
      const rows = await listRecursos();
      const parametros = message.content.toUpperCase().split(" ");

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
        personas?.forEach((persona: any) => {
          // @ts-ignore
          persona.forEach((dato: any, index: any) => {
            respuesta += `${encabezados[index]} : ${
              persona[index] === ""
                ? "No hay datos disponibles(Gis no los ha llenado 🙊)"
                : persona[index]
            } \n`;
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
          "No me mandaste ninguna pregunta aquí estan las preguntas que están en mi Base de datos : \n";
        rows?.forEach((row: any, index: number) => {
          respuesta += `${index + 1} - ${row[0]}\n`;
        });
        respuesta +=
          "Puedes preguntar usando ?FAQ seguido del número de la pregunta de la cual deseas que te conteste 😎";
        message.reply(respuesta);
      }
    } else {
      console.log("No data found.");
    }
  }
  if (message.content.startsWith(`${prefix}help`)) {
    const rows = await listTuto();
    // @ts-ignore
    if (rows?.length) {
      let comandos =
        "Todo esto es lo que puedo hacer: \n" + "Comando -> Resultado esperado";
      rows?.forEach((row: any, index: number) => {
        comandos += `${row[0]} ---->  ${row[1]}\n`;
      });
      message.reply(comandos);
    } else {
      console.log("No data found.");
    }
  }
  if (message.content.startsWith(`${prefix}Wiki`)) {
    const parametros = message.content.split(" ");
    const rows = await listWiki();
    // @ts-ignore
    if (
      rows?.length &&
      (rows
        ?.map((row) =>
          row[0].toLowerCase().includes(parametros[1].toLowerCase())
        )
        .includes(true) ||
        rows
          ?.map((row) =>
            row[1].toLowerCase().includes(parametros[1].toLowerCase())
          )
          .includes(true))
    ) {
      // @ts-ignore
      const datos = rows?.filter((row) =>
        row.find((element) =>
          element.toLowerCase().includes(parametros[1].toLowerCase())
        )
      );
      const encabezados = rows[0];
      let respuesta = "Este registro cumple con los parametros recibidos: \n";
      datos?.forEach((dato: any) => {
        // @ts-ignore
        dato.forEach((info: any, index: any) => {
          respuesta += `${encabezados[index]} : ${
            dato[index] === "" ? "No hay datos disponibles" : dato[index]
          } \n`;
        });
        if (respuesta.length <= 2000) {
          message.reply(respuesta);
        } else {
          message.reply(
            `La información  es tan larga que no puede ser impresa`
          );
        }
        respuesta =
          "Esta registro tambien cumple con los criterios de búsqueda: \n";
      });
    } else {
      message.reply(
        "No pude nada relacionado a ese tema 🧐 pero puedes contrubuir 🤓"
      );
    }
  }
});
bot.login(process.env.DISCORD_TOKEN);
