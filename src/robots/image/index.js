const { Jimp, loadFont, measureTextHeight, measureText } = require("jimp");

const width = 1080;
const height = 1920;

function getTitleWidth(upsWidth, textWidth, headerWidth, footerWidth) {
  if (upsWidth + 40 + textWidth > 0.8 * width) {
    return 0.8 * width;
  }
  const widths = [
    upsWidth + 40 + headerWidth,
    upsWidth + 40 + footerWidth,
    upsWidth + 40 + textWidth,
  ];
  return widths.sort((a, b) => a - b)[2];
}

async function juntaTitulo(text) {
  const header = await Jimp.read("dist/composition/header.png");
  const ups = await Jimp.read("dist/composition/ups.png");
  const footer = await Jimp.read("assets/video/footer.png");
  const titleFont = await loadFont("font/fnt/titulo/titulo.fnt");
  const fundo = new Jimp({ width, height, color: "#1a1a1b" });
  const titleImageWidth = getTitleWidth(
    ups.bitmap.width,
    measureText(titleFont, text.trim()),
    header.bitmap.width,
    footer.bitmap.width
  );

  const titleTextHeight = measureTextHeight(
    titleFont,
    text.trim(),
    titleImageWidth - 35 - ups.bitmap.width
  );

  const titleHeight =
    header.bitmap.height + 80 + titleTextHeight + footer.bitmap.height;

  const titleImage = new Jimp({
    width: titleImageWidth,
    height: titleHeight,
    color: "#1a1a1b",
  });
  titleImage.composite(ups, 0, 0);
  titleImage.composite(header, ups.bitmap.width + 40, 0);
  titleImage.composite(
    footer,
    ups.bitmap.width + 40,
    header.bitmap.height + 80 + titleTextHeight
  );
  titleImage.print({
    font: titleFont,
    x: ups.bitmap.width + 40,
    y: header.bitmap.height + 30,
    text: text.trim(),
    maxWidth: titleImageWidth - 40 - ups.bitmap.width,
  });

  fundo.composite(
    titleImage,
    width / 2 - titleImage.bitmap.width / 2,
    height / 2 - titleImage.bitmap.height / 2
  );

  fundo.write(`dist/images/Title.png`);
}

async function criaHeader(sub, author, days) {
  const subFont = await loadFont("./font/fnt/sub/sub.fnt");
  const postedByFont = await loadFont("./font/fnt/postedby/postedBy.fnt");

  const verticalSub = measureTextHeight(subFont, sub, 0.8 * width);
  const horizontalSub = measureText(subFont, sub);

  const postedByHorizontal = measureText(postedByFont, `posted by ${author}`);
  const [, subLogo] = sub.split("/");
  const logo = await Jimp.read(`assets/template/${subLogo.toLowerCase()}.png`);
  const logoHorizontal = logo.bitmap.width;
  const logoVertical = logo.bitmap.height + 10;

  const bolinha = await Jimp.read("assets/template/bolinha.png");
  const bolinhaHorizontal = bolinha.bitmap.width;

  const header = new Jimp({
    width:
      logoHorizontal +
      horizontalSub +
      bolinhaHorizontal +
      postedByHorizontal +
      45,
    height: logoVertical,
    color: "#1a1a1b",
  });

  header.composite(logo, 0, 5);
  header.print({
    font: subFont,
    x: logoHorizontal + 15,
    y: logoVertical / 2 - verticalSub / 2,
    text: sub,
  });
  header.composite(
    bolinha,
    logoHorizontal + 15 + horizontalSub + 15,
    logoVertical / 2 - bolinha.bitmap.height / 2
  );
  header.print({
    font: postedByFont,
    x: logoHorizontal + 15 + horizontalSub + 15 + bolinhaHorizontal + 15,
    y: logoVertical / 2 - verticalSub / 2,
    text: `posted by ${author} ${days} day${days === "1" ? "" : "s"} ago`,
  });
  header.write("dist/composition/header.png");
}

async function criaUps(ups) {
  const upsFont = await loadFont("font/fnt/ups/ups.fnt");
  const setaCima = await Jimp.read("assets/template/setaCima.png");
  const setaBaixo = await Jimp.read("assets/template/setaBaixo.png");
  const upsHeight = setaCima.bitmap.height + setaBaixo.bitmap.height + 90;
  const upsWidth = measureText(upsFont, ups);

  const upsPositionX = 0;
  const upsPositionY =
    upsHeight / 2 - measureTextHeight(upsFont, ups, upsWidth) / 2;

  const upsImage = new Jimp({
    width: upsWidth,
    height: upsHeight,
    color: "#1a1a1b",
  });
  upsImage.composite(setaCima, upsWidth / 2 - setaCima.bitmap.width / 2, 0);
  upsImage.composite(
    setaBaixo,
    upsWidth / 2 - setaBaixo.bitmap.width / 2,
    upsHeight - setaBaixo.bitmap.height
  );
  upsImage.print({
    font: upsFont,
    x: upsPositionX,
    y: upsPositionY,
    text: ups,
  });
  upsImage.write("dist/composition/ups.png");
}

async function criaTitulo(script) {
  console.log("> Making Title.png");
  await criaHeader(script.sub, script.user, script.days);
  await criaUps(String(script.ups));
  await juntaTitulo(script.title.replace(/[‘’]/g, "'").replace(/[“”]+/g, '"'));
}

async function print(text, count, t, par) {
  const image = new Jimp({ width, height, color: "#1a1a1b" });
  const font = await loadFont(
    "./font/fnt/NotoSans-Regular-32-white/NotoSans-Regular-32-white.fnt"
  );
  const vertical = (height - measureTextHeight(font, t, 0.9 * width)) / 2;
  console.log(`> Making image ${par + 1}.${count + 1}.png`);
  image.print({
    font,
    x: 60,
    y: vertical,
    text,
    maxWidth: 0.9 * width,
  });
  image.write(`dist/images/${par + 1}.${count + 1}.png`);
}

async function criaFotos({ story: script }) {
  for (const [numPar, paragrafo] of script.entries()) {
    const frases = paragrafo.split(/(?<=[.,?!:]\s)/);
    var text = "";
    for (var i = 0; i < frases.length; i++) {
      if (frases[i].length > 0) {
        text = text.concat(frases[i]);
        await print(text, i, paragrafo, numPar);
      }
    }
  }
}

module.exports = {
  criaFotos,
  criaTitulo,
};
