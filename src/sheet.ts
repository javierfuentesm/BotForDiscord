import fs from "fs";
import readline from "readline";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const TOKEN_PATH = "token.json";
const CRED_PATH = "src/credentials.json";

export async function listDevices() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: "Devices!A2:B",
  });

  if (rows) {
    return rows.data.values;
  }
}

export async function listProjects() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: "Proyectos!A2:A",
  });

  if (rows) {
    return rows.data.values;
  }
}
export async function listFAQ() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: "FAQ!A2:B",
  });

  if (rows) {
    return rows.data.values;
  }
}
export async function listWiki() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: "Wiki!A1:C",
  });

  if (rows) {
    return rows.data.values;
  }
}

export async function listCompetencias() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: "Competencias!A2:BB",
  });

  if (rows) {
    return rows.data.values;
  }
}
export async function listRecursos() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: "Recursos!C1:S",
  });
  if (rows) {
    return rows.data.values;
  }
}
export async function listInfo() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: "Prueba!A2:C",
  });
  if (rows) {
    return rows.data.values;
  }
}
export async function listCurso() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: "Curso!A1:I",
  });
  if (rows) {
    return rows.data.values;
  }
}
export async function listTuto() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: "Introduccion!A2:B",
  });
  if (rows) {
    return rows.data.values;
  }
}
export async function updateData(index: number) {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  let range = 2 + index;
  // @ts-ignore
  const rows = await sheets.spreadsheets.values.update({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: `Prueba!A${range}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      range: "Prueba!A2",
      majorDimension: "ROWS",
      values: [["Prueba", "hola"]],
    },
  });
  if (rows) {
    // @ts-ignore
    console.log(rows.config.data.values);
    // @ts-ignore
    return rows.config.data.values;
  }
}

export async function appendReport(values: any) {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")));
  const sheets = google.sheets({ version: "v4", auth });
  // @ts-ignore
  const rows = await sheets.spreadsheets.values.append({
    spreadsheetId: "1E9POZ7MslZ6HYcaosedSS7DMTEkg6zUIoUcXKcBGLxU",
    range: `Prueba!A:D`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values,
    },
  });

  if (rows) {
    // @ts-ignore
    console.log(rows.config.data.values);
    // @ts-ignore
    return rows.config.data.values;
  }
}

async function authorize(cred: any) {
  const { client_secret, client_id, redirect_uris } = cred.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(
      JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"))
    );
    return oAuth2Client;
  }

  return getNewToken<typeof oAuth2Client>(oAuth2Client);
}

async function getNewToken<T = any>(oAuth2Client: any): Promise<T> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  const code = await readlineAsync("Enter the code from that page here: ");
  const token = await new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, (err: any, token: any) => {
      err ? reject(err) : resolve(token);
    });
  });
  oAuth2Client.setCredentials(token);
  // Store the token to disk for later program executions
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
  console.log("Token stored to", TOKEN_PATH);

  return oAuth2Client;
}

async function readlineAsync(question: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
