const image = require("./robots/image");
const audio = require("./robots/audio");
const video = require("./robots/video");
const { baixaPost } = require("./robots/post");
const { upload, authenticate } = require("./robots/uploader");
const exec = require("child_process").exec;
const fs = require("fs");
const links = JSON.parse(fs.readFileSync("links.json", "utf-8"));

async function iniciar(link, upload) {
  const post = await baixaPost(link);
  console.log(`> Making ${post.title} video`);

  // const post = JSON.parse(fs.readFileSync("script.json", "utf-8"));
  await image.criaFotos(post);
  await image.criaTitulo(post);
  await audio.baixaAudio(post);
  await video.criaVideo(post);
  if (upload) await upload(post);
  console.log(`> Cleaning dist...`);
  exec("sh limpaDist.sh");
}

async function start() {
  var upload = false;
  if (process.argv.includes("-y")) {
    upload = true;
  }
  if (upload) await authenticate();
  for (link of links) {
    await iniciar(link.split(".com")[1], upload);
  }
}
start();
