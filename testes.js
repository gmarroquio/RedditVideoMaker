////////////////////////////////////////////////////////////////////////////////
// Teste para trocar ' por \' e " por \"////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// const fs = require("fs");

// const aspas = ['"', "'"];
// const aspasSimples = ["‘", "’"];
// const aspasDuplas = ["“", "”"];

// const file = fs.readFileSync("script.txt", "utf8");
// const sanitizado = file
//   .split("\n")
//   .map((p) => {
//     var a = 0;
//     if (p.length > 0) {
//       p.replace(/"/g, '\\"');
//       p.replace(/'/g, "\\'");

//       return p;
//     }
//     return "";
//   })
//   .filter((a) => (a.length > 0 ? true : false));
// file.forEach((a) => (aspas.includes(a) ? `\\${a}` : a));

// fs.writeFileSync("sanitizador.json", JSON.stringify(sanitizado));

// const a = aspasSimples[0].replace("'");
// console.log(aspasSimples[0]);
// if (aspasSimples[0] === "‘") aspasSimples[0] = "'";
// console.log(aspasSimples[0]);

// console.log("'".charCodeAt());
// console.log(aspasSimples[0].charCodeAt());
// console.log(aspasSimples[0]);
// console.log(a.charCodeAt());
// console.log(a);
////////////////////////////////////////////////////////////////////////////////
//Teste para juntar pontuações//////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// const linhas = [
//   'absa "dasd" asdas',
//   'Karen: "Are you KIDDING me?!?!"',
//   'Karen: "Are you KIDDING me"',
//   "bla. bla.. bla...",
//   "bla, bla,, bla,,,",
//   "bla? bla?? bla???",
//   "bla! bla!! bla!!!",
//   "bla: bla:: bla:::",
//   "(bla) ((bla)) (((bla)))",
//   "bla -  bla -- bla  --- bla-bla",
// ];
// const pontuacao = [".", ",", "?", "!", ":", " - "];
// const parentese = ["(", ")"];
// const aspasDuplas = '"';

// const linhaUsando = linhas[1];
// var aspas = false;
// var pontua = false;

// const frases = linhaUsando.split(/(?<=[.,?!:]\s)/);

// for (var i = 0; i < frases.length; i++) {
//   console.log(frases[(0, i)], i);
// }

// for (var i = 0; i < linhaUsando.length; i++) {
//   if (linhaUsando[i] === '"') {
//     aspas = !aspas;
//   }
//   if (pontuacao.includes(linhaUsando[i])) {
//     pontua = true;
//     while (pontuacao.includes(linhaUsando[i + 1])) {
//       i++;
//     }
//     if (!aspas) {
//       console.log(linhaUsando.slice(0, i + 1));
//     } else {
//       console.log(linhaUsando.slice(0, i + 2));
//     }
//   }
// }
// if (!pontua) {
//   console.log(linhaUsando);
// }
////////////////////////////////////////////////////////////////////////////////
//Teste do google tts //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// const tts = require("@google-cloud/text-to-speech");
// const fs = require("fs");
// const util = require("util");
// const credentials = require("./credentials/tts.json");

// const client = new tts.TextToSpeechClient({ credentials });
// async function quickStart() {
//   const text = "hello";
//   const request = {
//     input: { text: text },
//     // Select the language and SSML voice gender (optional)
//     voice: { languageCode: "en-US", name: "en-US-Standard-E" },
//     // select the type of audio encoding
//     audioConfig: { audioEncoding: "MP3" },
//   };
//   // Performs the text-to-speech request
//   const [response] = await client.synthesizeSpeech(request);
//   // Write the binary audio content to a local file
//   const writeFile = util.promisify(fs.writeFile);
//   await writeFile("output.mp3", response.audioContent, "binary");
//   console.log("Audio content written to file: output.mp3");
// }
// quickStart();
////////////////////////////////////////////////////////////////////////////////
//Teste de Criação da foto do titulo////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// const jimp = require("jimp");
////////////////////////////////////////////////////////////////////////////////
//Teste de criação dos clips////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs");
// const script = JSON.parse(fs.readFileSync("script.json"));

// function juntaImgComAudioAsync(nome) {
//   return new Promise((resolve, reject) => {
//     console.log("Juntando " + nome);
//     ffmpeg(`dist/images/${nome}.png`)
//       .input(`dist/audio/${nome}.mp3`)
//       // .outputOption("-shortest")
//       .outputOption("-c:a copy")
//       .outputOption("-c:v mjpeg")
//       .output(`dist/clips/${nome}.avi`)
//       .on("end", () => resolve())
//       .on("error", (err) => reject(err))
//       .run();
//   });
// }

// function juntaClips(nomes) {
//   const n = nomes.map((nome) => `dist/clips/${nome}.avi`);
//   const a = ffmpeg("dist/clips/Title.avi");
//   var inputs = a;
//   for (var i = 0; i < n.length; i++) {
//     inputs = inputs.input(n[i]);
//   }
//   return new Promise((resolve, reject) => {
//     console.log("Juntando os clips");
//     inputs
//       .input("dist/clips/fim.avi")
//       .on("end", () => resolve())
//       .on("error", (err) => reject(err))
//       .mergeToFile(`dist/${script.title} - ${script.sub.split("/")[1]}.mp4`);
//   });
// }

// ffmpeg(`dist/images/Title.png`)
//   .input(`dist/audio/Title.mp3`)
//   // .outputOption("-shortest")
//   .outputOption("-c:a copy")
//   .outputOption("-c:v mjpeg")
//   .output(`dist/clips/Title.avi`)
//   .run();

// ffmpeg -loop 1 -y -i assets/images/1.1.png -i assets/audio/1.1.mp3 -shortest -acodec copy -vcodec mjpeg result.avi
////////////////////////////////////////////////////////////////////////////////
//Teste da criação da imagem////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// const jimp = require("jimp");

// async function criaTitulo(text) {
//   const header = await jimp.read("dist/composition/header.png");
//   const ups = await jimp.read("dist/composition/ups.png");
//   const footer = await jimp.read("dist/composition/footer.png");
//   const titleFont = await jimp.loadFont("font/fnt/titulo/titulo.fnt");
//   const fundo = await jimp.read(1920, 1080, "#1a1a1b");
//   const titleWidth =
//     ups.bitmap.width + 40 + jimp.measureText(titleFont, text) > 1500
//       ? 1500
//       : ups.bitmap.width + 40 + jimp.measureText(titleFont, text);
//   const titleTextHeight = jimp.measureTextHeight(titleFont, text, 1500);
//   const titleHeight =
//     header.bitmap.height + 80 + titleTextHeight + footer.bitmap.height;

//   const titleImage = await jimp.read(titleWidth, titleHeight, "#1a1a1b");
//   titleImage.composite(ups, 0, 0);
//   titleImage.composite(header, ups.bitmap.width + 40, 0);
//   titleImage.composite(
//     footer,
//     ups.bitmap.width + 40,
//     header.bitmap.height + 80 + titleTextHeight
//   );
//   titleImage.print(
//     titleFont,
//     ups.bitmap.width + 40,
//     header.bitmap.height + 30,
//     text,
//     titleWidth - 40 - ups.bitmap.width
//   );

//   fundo.composite(
//     titleImage,
//     960 - titleImage.bitmap.width / 2,
//     540 - titleImage.bitmap.height / 2
//   );

//   fundo.write("dist/images/Title.png");
// }

// async function criaHeader(sub, author, days) {
//   const subFont = await jimp.loadFont("./font/fnt/sub/sub.fnt");
//   const postedByFont = await jimp.loadFont("./font/fnt/postedby/postedBy.fnt");

//   const verticalSub = jimp.measureTextHeight(subFont, sub, 1500);
//   const horizontalSub = jimp.measureText(subFont, sub);

//   const postedByHorizontal = jimp.measureText(
//     postedByFont,
//     `posted by ${author} ${days} days ago`
//   );
//   const [, subLogo] = sub.split("/");
//   const logo = await jimp.read(`assets/template/${subLogo}.png`);
//   const logoHorizontal = logo.bitmap.width;
//   const logoVertical = logo.bitmap.height + 10;

//   const bolinha = await jimp.read("assets/template/bolinha.png");
//   const bolinhaHorizontal = bolinha.bitmap.width;

//   const header = await jimp.read(
//     logoHorizontal +
//       horizontalSub +
//       bolinhaHorizontal +
//       postedByHorizontal +
//       45,
//     logoVertical,
//     "#1a1a1b"
//   );

//   header.composite(logo, 0, 5);
//   header.print(
//     subFont,
//     logoHorizontal + 15,
//     logoVertical / 2 - verticalSub / 2,
//     sub
//   );
//   header.composite(
//     bolinha,
//     logoHorizontal + 15 + horizontalSub + 15,
//     logoVertical / 2 - bolinha.bitmap.height / 2
//   );
//   header.print(
//     postedByFont,
//     logoHorizontal + 15 + horizontalSub + 15 + bolinhaHorizontal + 15,
//     logoVertical / 2 - verticalSub / 2,
//     `posted by ${author} ${days} day${days === "1" ? "" : "s"} ago`
//   );
//   header.write("dist/composition/header.png");
// }

// async function criaUps(ups) {
//   const upsFont = await jimp.loadFont("font/fnt/ups/ups.fnt");
//   const setaCima = await jimp.read("assets/template/setaCima.png");
//   const setaBaixo = await jimp.read("assets/template/setaBaixo.png");
//   const upsHeight = setaCima.bitmap.height + setaBaixo.bitmap.height + 90;
//   const upsWidth = jimp.measureText(upsFont, ups);

//   const upsPositionX = 0;
//   const upsPositionY =
//     upsHeight / 2 - jimp.measureTextHeight(upsFont, ups, upsWidth) / 2;

//   const upsImage = await jimp.read(upsWidth, upsHeight, "#1a1a1b");
//   upsImage.composite(setaCima, upsWidth / 2 - setaCima.bitmap.width / 2, 0);
//   upsImage.composite(
//     setaBaixo,
//     upsWidth / 2 - setaBaixo.bitmap.width / 2,
//     upsHeight - setaBaixo.bitmap.height
//   );
//   upsImage.print(upsFont, upsPositionX, upsPositionY, ups);
//   upsImage.write("dist/composition/ups.png");
// }

////////////////////////////////////////////////////////////////////////////////
//Teste de trocar as aspas erradas//////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// const frase = "Entitled mom begs bride to be “less happy” on her wedding day";
// const aspas = "‘’“”";

// function trocaAspas(text) {
//   var t = text.replace(/[‘’]/g, "'");
//   t = t.replace(/[“”]+/g, '"');

//   return t;
// }
////////////////////////////////////////////////////////////////////////////////
//Teste de pegar os posts no reddit/////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// const axios = require("axios");
// const api = axios.create({ baseURL: "https://api.reddit.com" });
// const fs = require("fs");
// const datefns = require("date-fns");
// const hj = new Date();

// //r/IDontWorkHereLady/comments/fsqjb5/i_got_fired_from_walmart_and_never_worked_there/
// //r/IDontWorkHereLady/comments/ftk6a1/a_wild_karen_meets_her_match/
// //r/IDontWorkHereLady/comments/fqqae6/karen_tells_my_parents_i_assaulted_her_because_i/

// async function start() {
//   const post = await api.get(
//     "/r/IDontWorkHereLady/comments/ftk6a1/a_wild_karen_meets_her_match/"
//   );
//   const p = post.data[0].data.children[0].data;
//   const data = {
//     title: p.title,
//     link: p.url,
//     sub: p.subreddit_name_prefixed,
//     ups:
//       p.ups > 1000
//         ? p.ups > 10000
//           ? p.ups > 100000
//             ? `${String(p.ups)[0]}${String(p.ups)[1]}${String(p.ups)[2]}k`
//             : `${String(p.ups)[0]}${String(p.ups)[1]}.${String(p.ups)[2]}k`
//           : `${String(p.ups)[0]}.${String(p.ups)[1]}k`
//         : p.ups,
//     days: String(
//       datefns.differenceInDays(hj, datefns.fromUnixTime(p.created_utc))
//     ),
//     user: `u/${p.author}`,
//     story: p.selftext.split("\n").filter((a) => a.length > 0),
//   };
//   fs.writeFileSync("teste.json", JSON.stringify(data));
// }

// start();

////////////////////////////////////////////////////////////////////////////////
//Teste de ler input////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// const readline = require("readline");

// const leitor = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// leitor.question("Link do post\n", function (answer) {
//   console.log("\n" + answer);
//   leitor.close();
// });
////////////////////////////////////////////////////////////////////////////////
const fs = require("fs");
const links = JSON.parse(fs.readFileSync("links.json", "utf-8"));

links.map((link) => console.log(link.split(".com")[1]));
