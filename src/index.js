const image = require("./robots/image");
const audio = require("./robots/audio");
const video = require("./robots/video");
const { baixaPost } = require("./robots/post");
const { upload, authenticate } = require("./robots/uploader");
const exec = require("child_process").exec;
const fs = require("fs");
const links = JSON.parse(fs.readFileSync("links.json", "utf-8"));

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
  const uploadVar = process.argv.includes("-y");
  const cleanVar = !process.argv.includes("-c");
  cleanVideos(cleanVar);
  if (process.argv.includes("-y")) await authenticate();
  for (link of links) {
    cleanDist(cleanVar);
    await iniciar(link.split(".com")[1], uploadVar);
  }
  cleanDist(cleanVar);
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
