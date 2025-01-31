const PImage = require("pureimage");
const fs = require("fs");

const width = 608;
const height = 1080;

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

async function print({ text, name, fontSize }) {
  var fnt = PImage.registerFont(
    "./font/Noto_Sans/static/NotoSans-Black.ttf",
    "Noto Sans"
  );
  fnt.loadSync();
  const image = PImage.make(width, height);
  const ctx = image.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fafa55";
  ctx.font = `${fontSize}pt 'Noto Sans'`;

  write(text, ctx, 60, height / 4, width * 0.8, fontSize);

  PImage.encodePNGToStream(
    image,
    fs.createWriteStream(`dist/images/${name}.png`)
  )
    .then(() => {
      console.log(`> Image ${name} created`);
    })
    .catch((e) => {
      console.log(`> Error on image ${name}`);
    });
}

module.exports = { write, print };
