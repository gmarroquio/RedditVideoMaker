const axios = require("axios");
const api = axios.create({ baseURL: "https://api.reddit.com" });
const fs = require("fs");
const datefns = require("date-fns");
const hj = new Date();

async function baixaPost(link) {
  const post = await api.get(link);
  const p = post.data[0].data.children[0].data;
  const data = {
    title: p.title,
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
    story: p.selftext
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\*\*/g, "")
      .replace(/~~/g, "")
      .split("\n")
      .filter((a) => a.length > 0),
  };
  fs.writeFileSync(
    `scripts/${data.title.replace("/", "-")}.json`,
    JSON.stringify(data)
  );
  return data;
}

module.exports = { baixaPost };
