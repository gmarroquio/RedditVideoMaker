const ffmpeg = require("fluent-ffmpeg");

async function getDuration(name) {
  const metadata = await new Promise((res, rej) =>
    ffmpeg.ffprobe(name, (err, metadata) => {
      if (!err) res(metadata);
      else rej(err);
    })
  );
  return metadata.format.duration;
}

function _write(text, x, y, ctx) {
  ctx.fillText(text.trim(), x, y);
}

function write(text, ctx, x, y, maxWidth, fontSize) {
  let frase = "";
  let line = 0;

  for (let word of text.split(" ")) {
    if (ctx.measureText(frase).width < maxWidth) {
      frase = frase.concat(" ", word);
    } else {
      _write(frase, x, y + line, ctx);
      frase = word;
      line += fontSize;
    }
  }
  _write(frase, x, y + line, ctx);
}

module.exports = { getDuration, write };
