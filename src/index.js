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
  //console.log(`> Cleaning videos...`);
  //exec("sh limpaVideos.sh");
  var uploadVar = false;
  if (process.argv.includes("-y")) {
    uploadVar = true;
  }
  if (uploadVar) await authenticate();
  for (link of links) {
    console.log(`> Cleaning dist...`);
    exec("sh limpaDist.sh");
    await iniciar(link.split(".com")[1], uploadVar);
  }
  console.log(`> Cleaning dist...`);
  exec("sh limpaDist.sh");
}
start();
