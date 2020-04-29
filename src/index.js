const image = require("./robots/image");
const audio = require("./robots/audio");
const video = require("./robots/video");
const { baixaPost, searchPosts } = require("./robots/post");
const { upload, authenticate } = require("./robots/uploader");
const exec = require("child_process").exec;
const fs = require("fs");

async function iniciar(link, uploadVar) {
  const post = await baixaPost(link);
  console.log(`> Making ${post.title} video`);

  // const post = JSON.parse(fs.readFileSync("script.json", "utf-8"));
  await image.criaFotos(post);
  await image.criaTitulo(post);
  await audio.baixaAudio(post);
  await video.criaVideo(post);
  if (uploadVar) await upload(post);
}

async function start() {
  const uploadVar = process.argv.includes("-y"); //Upload pro yt se passar
  const cleanDistVar = !process.argv.includes("-c:d"); //Limpar dist se não passar
  const cleanVideoVar = process.argv.includes("-c:v"); //Limpar videos se passar

  const links = process.argv.includes("-s")
    ? await searchPosts()
    : JSON.parse(fs.readFileSync("links.json", "utf-8"));

  // Limpa a pasta videos
  cleanVideos(cleanVideoVar);

  if (process.argv.includes("-y")) await authenticate();

  for (link of links) {
    //Limpa a pasta de arquivos temporarios
    cleanDist(cleanDistVar);

    //Execução do programa
    await iniciar(link.split(".com")[1], uploadVar);
    if (!cleanDistVar) break;
  }

  //Limpa a pasta de arquivos temporarios
  cleanDist(cleanDistVar);
}
start();

function cleanVideos(cleanVar) {
  if (cleanVar) {
    console.log(`> Cleaning videos...`);
    exec("sh limpaVideos.sh");
  }
}
function cleanDist(cleanVar) {
  if (cleanVar) {
    console.log(`> Cleaning dist...`);
    exec("sh limpaDist.sh");
  }
}
