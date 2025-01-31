const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { getDuration } = require("../util");

async function criaVideo(post) {
  const files = fs.readdirSync("dist/audio");
  const nomesAux = files
    .map((a) => {
      const i = a.lastIndexOf(".");
      return a.slice(0, i);
    })
    .filter((name) => !!name);

  const nomes = nomesAux.sort((a, b) => {
    if (a === "Title") return -1;
    else if (Number(a.split(".")[0]) - Number(b.split(".")[0]) !== 0) {
      return Number(a.split(".")[0]) - Number(b.split(".")[0]);
    } else {
      const c = a.split(".")[1];
      const d = b.split(".")[1];

      return c - d;
    }
  });
  let audio = ffmpeg();
  for (let nome of nomes) {
    audio.input(`dist/audio/${nome}.mp3`);
  }

  await new Promise((res, rej) => {
    audio
      .on("end", () => res())
      .on("error", (err) => rej(err))
      .on("progress", function (progress) {
        console.log("> Joining audio: " + progress.percent + "% done");
      })
      .mergeToFile("dist/audio.mp3");
  });

  const videoDuration = await getDuration(`dist/audio.mp3`);
  const start = Math.random() * (30 - videoDuration / 60 + 1);

  await new Promise((res, rej) => {
    ffmpeg("assets/video/background_vertical.mp4")
      .seekInput(start * 60)
      .input("dist/audio.mp3")
      .outputOption("-c:v copy")
      .outputOption("-c:a aac")
      .outputOption("-map 0:v")
      .outputOption("-map 1:a")
      .setDuration(videoDuration)
      .output("dist/bg_video.mp4")
      .on("progress", function (progress) {
        console.log("> Joining audio on video: " + progress.percent + "% done");
      })
      .on("end", res)
      .on("error", rej)
      .run();
  });

  let last = 0;
  let input = 1;

  let filter = "[0:v] setpts=PTS-STARTPTS [bg0];";
  const output = ffmpeg("dist/bg_video.mp4");

  for (let nome of nomes) {
    output.input(`dist/images/${nome}.png`);

    const duration = await getDuration(`dist/audio/${nome}.mp3`);

    filter += ` [bg${
      input - 1
    }][${input}:v] overlay=enable='between(t,${last},${
      last + duration
    })':x=(main_w-overlay_w)/2:y=0 [bg${input}];`;

    input += 1;
    last += duration;
  }

  await new Promise((res, rej) => {
    output
      .complexFilter(filter)
      .outputOption(`-map [bg${input - 1}]:v`)
      .outputOption("-map 0:a")
      .output(`videos/${post.title.replaceAll(" ", "_")}.mp4`)
      .on("end", () => res())
      .on("error", (err) => rej(err))
      .on("progress", function (progress) {
        console.log("> Creating final video: " + progress.percent + "% done");
      })
      .run();
  });
  fs.rmSync("dist/audio.mp3");
  fs.rmSync("dist/bg_video.mp4");
}

module.exports = {
  criaVideo,
};
