const axios = require("axios");
const api = axios.create({ baseURL: "https://api.reddit.com" });
const fs = require("fs");
const datefns = require("date-fns");
const hj = new Date();
var readline = require("readline-sync");

async function baixaPost(link) {
  const post = await api.get(link);
  const p = post.data[0].data.children[0].data;
  const data = {
    title: p.title.replace(/&amp;/, "&"),
    link: p.url,
    sub: p.subreddit_name_prefixed,
    ups:
      p.ups > 1000
        ? p.ups > 10000
          ? p.ups > 100000
            ? `${String(p.ups)[0]}${String(p.ups)[1]}${String(p.ups)[2]}k`
            : `${String(p.ups)[0]}${String(p.ups)[1]}.${String(p.ups)[2]}k`
          : `${String(p.ups)[0]}.${String(p.ups)[1]}k`
        : p.ups,
    days: String(
      datefns.differenceInDays(hj, datefns.fromUnixTime(p.created_utc))
    ),
    user: `u/${p.author}`,
    flair: p.link_flair_text,
    awards: p.all_awardings.map((a) => {
      return { name: a.name, id: a.id, url: a.icon_url };
    }),
    story: p.selftext
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\*/g, "")
      .replace(/[\[]/g, "[")
      .replace(/[\]]/g, "]")
      .replace(/\*\*/g, "")
      .replace(/~~/g, "")
      .replace(/&amp;/, "&")
      .replace(/\([\w+/:.]+\)/g, "")
      .split("\n")
      .filter((a) => a.length > 0),
  };
  fs.writeFileSync(
    `scripts/${data.title.replace("/", "-")}.json`,
    JSON.stringify(data)
  );
  return data;
}

async function searchPosts() {
  var favOpc = "";
  var sub = "";
  var filter = "";
  var time = "";
  var addFavOpc = "";
  var limit = 25;
  var opc = "";
  const links = [];

  //CARREGAR O SUBREDDIT
  //Carregar favs.json
  while (favOpc !== "y" && favOpc !== "n") {
    favOpc = readline
      .question("> Deseja carregar subreddits favoritos [y/n]: ")
      .toLowerCase();
  }
  //Carregando favs.json
  if (favOpc === "y") {
    //Checa se fav.json existe
    const existsFav = fs.existsSync("favs.json");
    if (existsFav) {
      const favs = JSON.parse(fs.readFileSync("favs.json", "utf8"));
      var id = -1;
      //Pede o numero do subreddit
      while (id < 0 || id > favs.length) {
        favs.map((f) => console.log(`> ${favs.indexOf(f) + 1} - ${f}`));
        console.log("> 0 - Sub desejado não esta na lista");
        id = readline.questionInt("> Digite o numero do subreddit: ");
      }
      sub = favs[id - 1];
    }
    if (!existsFav || id === 0) {
      //Caso favs.json n exista
      if (!existsFav) console.log("> Arquivo favs.json não existe");
      sub = readline.question("> Digite um subreddit: ").toLowerCase();
      //Pergunta se quer adicionar o sub aos favoritos
      while (addFavOpc !== "y" && addFavOpc !== "n") {
        addFavOpc = readline
          .question(`> Deseja adicionar ${sub} aos favoritos [y/n]: `)
          .toLowerCase();
      }
      if (addFavOpc === "y") {
        fs.appendFileSync("favs.json", JSON.stringify([sub]));
      }
    }
  } else {
    //Pede sub
    sub = readline.question("> Subreddit: ").toLowerCase();
    //Pergunta se quer adicionar o sub aos favoritos
    while (addFavOpc !== "y" && addFavOpc !== "n") {
      addFavOpc = readline
        .question(`> Deseja adicionar ${sub} aos favoritos [y/n]: `)
        .toLowerCase();
    }
    if (addFavOpc === "y") {
      //Se o arquivo existir
      if (fs.existsSync("favs.json")) {
        const favs = JSON.parse(fs.readFileSync("favs.json", "utf8"));
        if (!favs.includes(sub)) {
          favs.push(sub);
          fs.writeFileSync("favs.json", JSON.stringify(favs));
        } else {
          console.log(`> ${sub} já está nos favoritos`);
        }
      } else {
        fs.appendFileSync("favs.json", JSON.stringify([sub]));
      }
    }
  }

  if (!sub.includes("r/")) {
    sub = `r/${sub}`;
  }
  console.log("============================================================");
  // Ordem dos posts
  while (filter !== "h" && filter !== "n" && filter !== "t" && filter !== "r") {
    filter = readline
      .question(
        "> Filtrar por:\n> [H]ot\n> [N]ew\n> [T]op\n> [R]ising\n> Digite a opção: "
      )
      .toLowerCase();
  }
  filter =
    filter === "h"
      ? (filter = "hot")
      : filter === "n"
      ? (filter = "new")
      : filter === "t"
      ? (filter = "top")
      : (filter = "rising");
  console.log("> Opção escolhida: " + filter);
  // Opção top
  if (filter === "top") {
    while (
      time !== "n" &&
      time !== "t" &&
      time !== "w" &&
      time !== "m" &&
      time !== "y" &&
      time !== "a"
    ) {
      time = readline
        .question(
          "> Filtrar por:\n> [N]ow\n> [T]oday\n> This [w]eek\n> This [m]onth\n> This [y]ear\n> [A]ll time\n> Digite uma opção: "
        )
        .toLowerCase();
    }
    console.log("> Opção escolhida: " + time);
    time =
      time === "n"
        ? (time = "hour")
        : time === "t"
        ? (time = "day")
        : time === "w"
        ? (time = "week")
        : time === "m"
        ? (time = "month")
        : time === "y"
        ? (time = "year")
        : (time = "all");
  }
  // Alterar o limite
  limit = readline.question(
    "> Digite o valor de posts que deseja buscar [Defalut = 25]: "
  );
  limit = !limit ? 25 : Number(limit);

  const url = `${sub}/${filter}/?${time ? `t=${time}&` : ""}limit=${limit}`;

  const { data } = await api.get(url);
  const offSet = data.data.dist - limit;
  const posts = data.data.children;

  for (var i = 0 + offSet; i < limit + offSet; i++) {
    console.log(`> ${i + 1} =============================================`);
    console.log("> Titulo:\t", posts[i].data.title.replace(/&amp;/, "&"));
    console.log("> Link:\t\t", posts[i].data.url);
    console.log("> Ups:\t\t", posts[i].data.ups);
  }
  console.log(`> 0 ===================Terminar==================`);
  while (opc !== 0) {
    opc = readline.questionInt(`> Selecione o post: `);
    if (opc !== 0) {
      if (!links.includes(posts[opc - 1].data.url))
        links.push(posts[opc - 1].data.url);
    }
  }
  return links;
}

module.exports = { baixaPost, searchPosts };
