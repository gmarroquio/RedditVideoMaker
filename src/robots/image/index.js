const jimp = require("jimp");

function getTitleWidth(upsWidth, textWidth, headerWidth, footerWidth) {
  if (upsWidth + 40 + textWidth > 1500) {
    return 1500;
  }
  const widths = [
    upsWidth + 40 + headerWidth,
    upsWidth + 40 + footerWidth,
    upsWidth + 40 + textWidth,
  ];
  return widths.sort((a, b) => a - b)[2];
}

async function juntaTitulo(text) {
  const header = await jimp.read("dist/composition/header.png");
  const ups = await jimp.read("dist/composition/ups.png");
  const footer = await jimp.read("assets/video/footer.png");
  const titleFont = await jimp.loadFont("font/fnt/titulo/titulo.fnt");
  const fundo = await jimp.read(1920, 1080, "#1a1a1b");
  const titleImageWidth = getTitleWidth(
    ups.bitmap.width,
    jimp.measureText(titleFont, text.trim()),
    header.bitmap.width,
    footer.bitmap.width
  );

  const titleTextHeight = jimp.measureTextHeight(
    titleFont,
    text.trim(),
    titleImageWidth - 35 - ups.bitmap.width
  );

  const titleHeight =
    header.bitmap.height + 80 + titleTextHeight + footer.bitmap.height;

  const titleImage = await jimp.read(titleImageWidth, titleHeight, "#1a1a1b");
  titleImage.composite(ups, 0, 0);
  titleImage.composite(header, ups.bitmap.width + 40, 0);
  titleImage.composite(
    footer,
    ups.bitmap.width + 40,
    header.bitmap.height + 80 + titleTextHeight
  );
  titleImage.print(
    titleFont,
    ups.bitmap.width + 40,
    header.bitmap.height + 30,
    text.trim(),
    titleImageWidth - 40 - ups.bitmap.width
  );

  fundo.composite(
    titleImage,
    960 - titleImage.bitmap.width / 2,
    540 - titleImage.bitmap.height / 2
  );

  fundo.write(`dist/images/Title.png`);
}

async function criaHeader(sub, author, days) {
  const subFont = await jimp.loadFont("./font/fnt/sub/sub.fnt");
  const postedByFont = await jimp.loadFont("./font/fnt/postedby/postedBy.fnt");

  const verticalSub = jimp.measureTextHeight(subFont, sub, 1500);
  const horizontalSub = jimp.measureText(subFont, sub);

  const postedByHorizontal = jimp.measureText(
    postedByFont,
    `posted by ${author} ${days} days ago`
  );
  const [, subLogo] = sub.split("/");
  const logo = await jimp.read(`assets/template/${subLogo.toLowerCase()}.png`);
  const logoHorizontal = logo.bitmap.width;
  const logoVertical = logo.bitmap.height + 10;

  const bolinha = await jimp.read("assets/template/bolinha.png");
  const bolinhaHorizontal = bolinha.bitmap.width;

  const header = await jimp.read(
    logoHorizontal +
      horizontalSub +
      bolinhaHorizontal +
      postedByHorizontal +
      45,
    logoVertical,
    "#1a1a1b"
  );

  header.composite(logo, 0, 5);
  header.print(
    subFont,
    logoHorizontal + 15,
    logoVertical / 2 - verticalSub / 2,
    sub
  );
  header.composite(
    bolinha,
    logoHorizontal + 15 + horizontalSub + 15,
    logoVertical / 2 - bolinha.bitmap.height / 2
  );
  header.print(
    postedByFont,
    logoHorizontal + 15 + horizontalSub + 15 + bolinhaHorizontal + 15,
    logoVertical / 2 - verticalSub / 2,
    `posted by ${author} ${days} day${days === "1" ? "" : "s"} ago`
  );
  header.write("dist/composition/header.png");
}

async function criaUps(ups) {
  const upsFont = await jimp.loadFont("font/fnt/ups/ups.fnt");
  const setaCima = await jimp.read("assets/template/setaCima.png");
  const setaBaixo = await jimp.read("assets/template/setaBaixo.png");
  const upsHeight = setaCima.bitmap.height + setaBaixo.bitmap.height + 90;
  const upsWidth = jimp.measureText(upsFont, ups);

  const upsPositionX = 0;
  const upsPositionY =
    upsHeight / 2 - jimp.measureTextHeight(upsFont, ups, upsWidth) / 2;

  const upsImage = await jimp.read(upsWidth, upsHeight, "#1a1a1b");
  upsImage.composite(setaCima, upsWidth / 2 - setaCima.bitmap.width / 2, 0);
  upsImage.composite(
    setaBaixo,
    upsWidth / 2 - setaBaixo.bitmap.width / 2,
    upsHeight - setaBaixo.bitmap.height
  );
  upsImage.print(upsFont, upsPositionX, upsPositionY, ups);
  upsImage.write("dist/composition/ups.png");
}

async function criaTitulo(script) {
  console.log("> Making Title.png");
  await criaHeader(script.sub, script.user, script.days);
  await criaUps(script.ups);
  await juntaTitulo(script.title.replace(/[‘’]/g, "'").replace(/[“”]+/g, '"'));
}

async function print(text, count, t, par) {
  const image = await jimp.read(1920, 1080, "#1a1a1b");
  const font = await jimp.loadFont(
    "./font/fnt/NotoSans-Regular-32-white/NotoSans-Regular-32-white.fnt"
  );
  const vertical = (1080 - jimp.measureTextHeight(font, t, 1800)) / 2;
  console.log(`> Making image ${par + 1}.${count + 1}.png`);
  image.print(font, 60, vertical, `${text}`, 1800);
  image.write(`dist/images/${par + 1}.${count + 1}.png`);
}

async function criaFotos({ story: script }) {
  for (const [numPar, paragrafo] of script.entries()) {
    const frases = paragrafo.split(/(?<=[.,?!:]\s)/);
    var text = "";
    for (var i = 0; i < frases.length; i++) {
      if (frases[i].length > 0) {
        text = text.concat(
          frases[i].replace(/[‘’]/g, "'").replace(/[“”]+/g, '"')
        );
        await print(text, i, paragrafo, numPar);
      }
    }
  }
}

module.exports = {
  criaFotos,
  criaTitulo,
};
