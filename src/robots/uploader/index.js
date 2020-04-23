const express = require("express");
const google = require("googleapis").google;
const OAuth2 = google.auth.OAuth2;
const youtube = google.youtube({ version: "v3" });
const fs = require("fs");

async function authenticate() {
  const webServer = await startWebServer();
  const OAuthClient = await createOAuthClient();
  requestUserConsent(OAuthClient);
  const authorizationToken = await waitCallback(webServer);
  await requestToken(OAuthClient, authorizationToken);
  await setGlobalAuthentication(OAuthClient);
  await stopServer(webServer);

  async function startWebServer() {
    return new Promise((resolve, reject) => {
      const port = 5000;
      const app = express();
      const server = app.listen(port, () => {
        console.log(`> Listening on http://localhost:${port}`);
        resolve({
          app,
          server,
        });
      });
    });
  }

  async function createOAuthClient() {
    const credentials = require("../../../credentials/yt.json");
    const OAuthClient = new OAuth2(
      credentials.web.client_id,
      credentials.web.client_secret,
      credentials.web.redirect_uris[0]
    );

    return OAuthClient;
  }

  async function requestUserConsent(OAuthClient) {
    const consentURL = OAuthClient.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/youtube"],
    });

    console.log(`> Please give yout consent: ${consentURL}`);
  }

  async function waitCallback(webServer) {
    return new Promise((resolve, reject) => {
      console.log(`> Waiting for user consent...`);

      webServer.app.get("/", (req, res) => {
        const authCode = req.query.code;
        console.log(`> Consent given: ${authCode}`);

        res.send("<h1>Thak you</h1><p>Close this tab.</p>");
        resolve(authCode);
      });
    });
  }

  async function requestToken(OAuthClient, authorizationToken) {
    return new Promise((resolve, reject) => {
      OAuthClient.getToken(authorizationToken, (err, tokens) => {
        if (err) {
          return reject(err);
        }
        console.log(`> Access token recived`);
        OAuthClient.setCredentials(tokens);
        resolve();
      });
    });
  }

  async function setGlobalAuthentication(OAuthClient) {
    google.options({
      auth: OAuthClient,
    });
  }

  async function stopServer(webServer) {
    return new Promise((resolve, reject) => {
      webServer.server.close(() => {
        resolve();
      });
    });
  }
}

async function upload(post) {
  const videoInformation = await uploadVideo(post);

  async function uploadVideo(post) {
    const videoFilePath = `videos/${post.title} - ${
      post.sub.split("/")[1]
    }.mp4`;
    const videoFileSize = fs.statSync(videoFilePath).size;
    const videoTitle = `${
      post.title.length > 80 ? post.title.split(" ")[0] : post.title
    } - ${post.sub}`;
    const videoTags = [
      "reddit",
      "r/AskReddit",
      "ask reddit",
      "askreddit",
      "askreddit funny",
      "askreddit dumb",
      "reddit ama",
      "reddit ask me anything",
      "r/askreddit",
      "reddit stories",
      "reddit story",
      "askreddit scary",
      "askreddit stupid",
      "scary stories",
      "askreddit new",
      "top posts",
      "reddit top posts",
      "reddit cringe",
      "comedy",
      "askreddit top posts",
      "subreddit",
      "funny reddit",
      "best reddit posts",
      "askreddit stories",
      "best of reddit",
      "reddit best",
      "funny askreddit",
      "memes",
      "funny",
      "r/",
      "stories from reddit",
      "entitled parents",
      "petty revenge",
      "prorevenge",
    ];
    const videoDescription = [
      "Thanks for watching!",
      "Like, Comment and Subscribe if you are new on the channel!",
      "More content - https://www.youtube.com/playlist?list=PLbt9LZhJTjRwr278OfFP1hAz_66MQ4YYN",
      `Post link - ${post.link}`,
    ].join("\n\n");
    const requestParameters = {
      part: "snippet, status",
      requestBody: {
        snippet: {
          title: videoTitle,
          description: videoDescription,
          tags: videoTags,
        },
        status: {
          privacyStatus: "private",
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    };

    try {
      const youtubeRsponse = await youtube.videos.insert(requestParameters, {
        onUploadProgress: onUploadProgress,
      });
      console.log(
        `> Video available at: https://youtu.be/${youtubeRsponse.data.id}`
      );
    } catch (err) {
      console.log(`> Unable to upload video ${videoTitle}`);
      console(err);
    }

    function onUploadProgress(e) {
      const progress = Math.round((e.bytesRead / videoFileSize) * 100);
      console.log(`> ${progress}% completed`);
    }
  }
}

module.exports = {
  authenticate,
  upload,
};
