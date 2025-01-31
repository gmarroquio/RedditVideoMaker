const { print } = require("./utils");

async function criaTitulo(script) {
  console.log("> Making Title.png");
  await print({
    text: script.title.replace(/[‘’]/g, "'").replace(/[“”]+/g, '"'),
    name: "Title",
    fontSize: 48,
  });
}

async function criaFotos({ story: script }) {
  for (const [numPar, paragrafo] of script.entries()) {
    const frases = paragrafo.split(/(?<=[.,?!:]\s)/);
    for (var i = 0; i < frases.length; i++) {
      if (frases[i].length > 0) {
        await print({
          text: frases[i],
          name: `${numPar + 1}.${i + 1}`,
          fontSize: 32,
        });
      }
    }
  }
}

module.exports = {
  criaFotos,
  criaTitulo,
};
