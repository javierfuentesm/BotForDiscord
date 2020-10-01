import { config } from "dotenv";
config();
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
import { Client, DMChannel, Message } from "discord.js";
import { prefix } from "./config.json";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(
  credentials: {
    installed: { client_secret: any; client_id: any; redirect_uris: any };
  },
  callback: { (auth: any): void; (arg0: any): void }
) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  try {
    return fs.readFile(TOKEN_PATH, (err: any, token: string) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  } catch (err) {
    console.error("Error occured while reading directory!", err);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(
  oAuth2Client: {
    generateAuthUrl: (arg0: { access_type: string; scope: string[] }) => any;
    getToken: (arg0: any, arg1: (err: any, token: any) => void) => void;
    setCredentials: (arg0: any) => void;
  },
  callback: { (auth: any): void; (arg0: any): void; (arg0: any): void }
) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code: any) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: any) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

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
  function listDevices(auth: any) {
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
        range: "Devices!A2:B",
      },
      (err: string, res: { data: any[] }) => {
        if (err) return console.log("The API returned an error: " + err);
        const rows = res.data.values;

        if (rows.length) {
          let devices =
            "Dispositivo, OS: \n Los dispositivos que tenemos son los siguientes:\n";
          // @ts-ignore
          rows.map((row: any) => {
            devices += `${row[0]}, ${row[1]} \n`;
          });
          message.reply(devices);
        } else {
          console.log("No data found.");
        }
      }
    );
  }
  if (message.content.startsWith(`${prefix}dispositivos`)) {
    fs.readFile("src/credentials.json", (err: any, content: string) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), listDevices);
    });
  }
});
client.login(process.env.DISCORD_TOKEN);
