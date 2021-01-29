import * as nodemailer from "nodemailer";
export class GMailService {
  private _transporter: nodemailer.Transporter;
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });
  }
  sendMail(subject: string, course: string, student: any) {
    let options = {
      from: process.env.EMAIL,
      to: student.Email,
      subject: subject,
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Informe de Linea de comandos</title>
    <style>
      /* -------------------------------------
            INLINED WITH htmlemail.io/inline
        ------------------------------------- */
      /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
        ------------------------------------- */
      @media only screen and (max-width: 620px) {
        table[class="body"] h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }
        table[class="body"] p,
        table[class="body"] ul,
        table[class="body"] ol,
        table[class="body"] td,
        table[class="body"] span,
        table[class="body"] a {
          font-size: 16px !important;
        }
        table[class="body"] .wrapper,
        table[class="body"] .article {
          padding: 10px !important;
        }
        table[class="body"] .content {
          padding: 0 !important;
        }
        table[class="body"] .container {
          padding: 0 !important;
          width: 100% !important;
        }
        table[class="body"] .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
        table[class="body"] .btn table {
          width: 100% !important;
        }
        table[class="body"] .btn a {
          width: 100% !important;
        }
        table[class="body"] .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important;
        }
      }

      /* -------------------------------------
            PRESERVE THESE STYLES IN THE HEAD
        ------------------------------------- */
      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .btn-primary table td:hover {
          background-color: #34495e !important;
        }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important;
        }
        .styled-table {
          border-collapse: collapse;
          margin: 25px 0;
          font-size: 0.9em;
          font-family: sans-serif;
          min-width: 400px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }
        .styled-table thead tr {
          background-color: #222927;
          color: #ffffff;
          text-align: left;
        }
        .styled-table th,
        .styled-table td {
          padding: 12px 15px;
        }
        .styled-table tbody tr {
          border-bottom: 1px solid #dddddd;
        }

        .styled-table tbody tr:nth-of-type(even) {
          background-color: #f3f3f3;
        }

        .styled-table tbody tr:last-of-type {
          border-bottom: 2px solid #009879;
        }
        .styled-table tbody tr.active-row {
          font-weight: bold;
          color: #009879;
        }
      }
    </style>
  </head>
  <body
    class=""
    style="
      background-color: #f6f6f6;
      font-family: sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 14px;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    "
  >
    <span
      class="preheader"
      style="
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0;
      "
      >Estatus del curso de ${course}.</span
    >
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="body"
      style="
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
        background-color: #f6f6f6;
      "
    >
      <tr>
        <td
          style="font-family: sans-serif; font-size: 14px; vertical-align: top"
        >
          &nbsp;
        </td>
        <td
          class="container"
          style="
            font-family: sans-serif;
            font-size: 14px;
            vertical-align: top;
            display: block;
            margin: 0 auto;
            max-width: 580px;
            padding: 10px;
            width: 580px;
          "
        >
          <div
            class="content"
            style="
              box-sizing: border-box;
              display: block;
              margin: 0 auto;
              max-width: 580px;
              padding: 10px;
            "
          >
            <!-- START CENTERED WHITE CONTAINER -->
            <table
              class="main"
              style="
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%;
                background: #ffffff;
                border-radius: 3px;
              "
            >
              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td
                  class="wrapper"
                  style="
                    font-family: sans-serif;
                    font-size: 14px;
                    vertical-align: top;
                    box-sizing: border-box;
                    padding: 20px;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse: separate;
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      width: 100%;
                    "
                  >
                    <tr>
                  <img align="left" style="height:50px;width:110px;" src="https://miro.medium.com/max/7654/1*KDZTfB2dvoNUgqc3AVqDAQ.jpeg" alt="">
                    
                  <td
                        style="
                          font-family: sans-serif;
                          font-size: 14px;
                          vertical-align: top;
                        "
                      >
                        <p
                          style="
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px;
                          "
                        >
                        </br>
                          Hola ${student.Name}
                 <img align="right" style="height:110px;width:130px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEU3R0/P2N3///+Spq1WY2kzREzW3+QpPEUmOkOnrK8sPke7v8COo6rO19zS2+AyQ0uNlZlcaG4fNT/o7O+ZrLP19vbKztDf4OG2w8k9TFTv8fOfsbe8yM7F0NWpub+tvMKGjpNKWF9zfoJncndEU1qVm56M3MwOAAADiklEQVR4nO3d0XKiMBQG4BgEFIFUhKIoumj7/q+4ICAJgttti5Dj/9105kwv8jcnJLZlwngt2lj+jAbf2kS3XKz6mlie5409sl+TZ7ESNaFFKF4pzygljGbU8hW8WVQnjCjmK3hRlXDsgQyoTGhRncJ8Eq0iYUI3YB4xyRMSnsLrJDKyj5mSF7EN8YQbRrpJizZlVM6ifXzWUbvqrH6pODEdCbd7wwhPnjryQ38xnXbGdkI/NVwj5xoHaeBpWBbdbWfxKSP9rnbC1Ki5TUSp2ET0muJpyrPYTmhI0qrmh03NvRX37n1xitSE/taVwhyrqTlIRWNfFVO5GE54ElsJ9/IchuVW6R/lolEVT3JCY8KT2EqoZHGrMKFSLMOoPwv38PSBf9nLJVTC1A2phKka0j9q2qXK6qqfNFvlSVN9q/L4CZ876P/S2i08adjNHtDZj/IWstXmWTrzm6mR9vFmZ7jtIEpxP+GA96e2Q3lqUw4qTfEoFatTW1580li/5+7k7afH0HWNo3Ke9r1TUdwflMmqi4MP8ke6Pj15uXbfdRdnGvwpoCMhMUioPyTUHxLqDwn1h4T6e4GEFnVsTh0zqWMAAAAAAAAAQJ5wxh7BwJzLWzD2GAblzCP+h3JEZ168+PW2GHscgylmkHREZ12/Zkp0LdYzWCC5FsWaSyg26mLFlYgEZ9F+VyISbFSzHZFeo5oLNSLBtXgX8QUalWDEF2zUF4hIsFGxFglAo1LQjvhG79dTThbJCaMPav+DI7KNEnAtxh7RLxO7RGnSObUmFR9KwIhewHaLkgv4QT0go74GM6xBvdHfJnbkWzQh3qLU16D5hTXoLPpN/+iqfuztXIPOctXvPP2IIv5XiwYx7/c5/aY22S1Az1NU94RMmPHjbUL7hMy040cBCSRkZjGL/dsEgYT5J4v4wVGNQsL84PbgqOZ8Lvtdpr9blB6+2ebY/XQJCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALuxBzCwHcuoXWeoMjOmwY0pPyHObGmPPYhB2UsW07s6VRbEjJO7dlMm1pzxFeVJDN7zhPyiyY0i3+CceZEwYVQ3DLO4ojJPyOOAZkTzehlOkZDHjGKjOuW1XNeEPDkH1J6oIriU1+Ox6gKj1TqwBZVmNYUdrOvb8djtkqZ4ec5oHMN32XnZXEf1F0M4ZaE0Kfl1AAAAAElFTkSuQmCC" alt="">

                        </p>
                        <p
                          style="
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px;
                          "
                        >
                          Este correo es para informarte de tu progreso en el
                          curso de ${course}
                        </p>
                        <table class="styled-table">
                          <thead>
                            <tr>
                              <th>Elemento de evaluación</th>
                              <th>Calificación</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Tarea 1</td>
                              <td>${
                                student.Tarea1 === ""
                                  ? 0
                                  : `10 y este es el link de tu tarea ${student.Tarea1}`
                              }</td>
                            </tr>   
                            <tr>
                              <td>Tarea 2</td>
                              <td>${
                                student.Tarea2 === "" ? 0 : +student.Tarea2
                              }</td>
                            </tr>
                            <tr>
                              <td>Tarea 3</td>
                              <td>${
                                student.Tarea3 === "" ? 0 : +student.Tarea3
                              }</td>
                            </tr>
                            <tr>
                              <td>Tarea 4</td>
                              <td>${
                                student.Tarea === "" ? 0 : +student.Tarea4
                              }</td>
                            </tr>
                            <tr>
                              <td>Examen</td>
                              <td>${
                                student.Examen === undefined
                                  ? 0
                                  : student.Examen === ""
                                  ? 0
                                  : +student.Examen
                              }</td>
                            </tr>
                            <tr class="active-row">
                              <td>Total</td>
                              <td>${student.Final}</td>
                            </tr>
                            <!-- and so on... -->
                          </tbody>
                        </table>
                        <p
                          style="
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px;
                          "
                        >
                        Estas son las calificaciones finales
                            </br>
                            </br>
                              Si crees que ha habido un error o deseas conocer los detalles de algo en específico contáctanos.
                          </br>
                          </br>
                            </p>
                        <p
                          style="
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px;
                          "
                        >
                          Saludos , Buen día.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div
              class="footer"
              style="
                clear: both;
                margin-top: 10px;
                text-align: center;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse: separate;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  width: 100%;
                "
              >
                <tr>
                  <td
                    class="content-block"
                    style="
                      font-family: sans-serif;
                      vertical-align: top;
                      padding-bottom: 10px;
                      padding-top: 10px;
                      font-size: 12px;
                      color: #999999;
                      text-align: center;
                    "
                  >
                    <span
                      class="apple-link"
                      style="
                        color: #999999;
                        font-size: 12px;
                        text-align: center;
                      "
                      >GlobalHitss , Test Automation Area</span
                    >


                  </td>
                </tr>

              </table>
            </div>
            <!-- END FOOTER -->

            <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td
          style="font-family: sans-serif; font-size: 14px; vertical-align: top"
        >
          &nbsp;
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    };

    this._transporter.sendMail(options, (error, info) => {
      if (error) {
        return console.log(`error: ${error}`);
      }
      console.log(`Message Sent ${info.response}`);
    });
  }
}
