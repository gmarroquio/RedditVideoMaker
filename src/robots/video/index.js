const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

function juntaImgComAudioAsync(nome) {
  console.log("> Joining " + nome);
  return nome !== "fim"
    ? new Promise((resolve, reject) => {
        ffmpeg(`dist/images/${nome}.png`)
          .input(`dist/audio/${nome}.mp3`)
          // .outputOption("-shortest")
          .outputOption("-c:a copy")
          .outputOption("-c:v mjpeg")
          .output(`dist/clips/${nome}.avi`)
          .on("end", () => resolve())
          .on("error", (err) => reject(err))
          .run();
      })
    : new Promise((resolve, reject) => {
        ffmpeg(`assets/video/${nome}.png`)
          .input(`assets/video/${nome}.mp3`)
          // .outputOption("-shortest")
          .outputOption("-c:a copy")
          .outputOption("-c:v mjpeg")
          .output(`assets/video/${nome}.avi`)
          .on("end", () => resolve())
          .on("error", (err) => reject(err))
          .run();
      });
}

function juntaClips(nomes, title, sub) {
  const files = nomes.map((nome) => `dist/clips/${nome}.avi`);
  var inputs = ffmpeg("dist/clips/Title.avi");
  for (var i = 0; i < files.length; i++) {
    inputs = inputs.input(files[i]);
  }
  return new Promise((resolve, reject) => {
    console.log("> Joining all clips");
    inputs
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .mergeToFile(`videos/${title} - ${sub.split("/")[1]}.mp4`);
  });
}

async function criaVideo(post) {
  const files = fs.readdirSync("dist/audio");
  const nomesAux = files
    .map((a) => {
      const i = a.lastIndexOf(".");
      return a.slice(0, i);
    })
    .filter((name) => !!name);

  const nomes = nomesAux.sort((a, b) => {
    if (Number(a.split(".")[0]) - Number(b.split(".")[0]) !== 0) {
      return Number(a.split(".")[0]) - Number(b.split(".")[0]);
    } else {
      const c = a.split(".")[1];
      const d = b.split(".")[1];

      return c - d;
    }
  });

  for (let nome of nomes) {
    if (nome !== "fim") await juntaImgComAudioAsync(nome);
    else if (!fs.existsSync("assets/video/fim.avi")) {
      await juntaImgComAudioAsync(nome);
    }
  }
  await juntaClips(
    nomes.filter((a) => (a === "Title" || a === "fim" ? false : true)),
    post.title,
    post.sub
  );
}

module.exports = {
  criaVideo,
};
