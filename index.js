const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const connectToMongo = require("./db");
const cors = require("cors");
const Chat = require("./models/Chat");
const Image = require("./models/Imagemodel");
const Red = require("./models/Red");
const axios = require("axios");
require("dotenv").config();

connectToMongo();

const OPENAI_API_KEY = process.env.REACT_APP_API;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
app.use(cors());
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  const query = req.body.query;

  const chat = await Chat.create({
    title: req.body.query,
  });

  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: query,
      max_tokens: 4000,
      temperature: 0,
    })
    .then((response) => {
      return response.data.choices[0].text;
    })
    .then((answer) => {
      const array = answer
        .split("\n")
        .filter((value) => value)
        .map((value) => value.trim());
      return array;
    })
    .then((answer) => {
      res.json({ answer: answer });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/image-gen", async (req, res) => {
  const image = await Image.create({
    title: req.body.prompt,
  });

  try {
    const prompt = req.body.prompt;
    const GenImage = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const url = GenImage.data.data[0].url;
    console.log(url);
    res.json(url);
  } catch {
    res.json({ msg: "Internal Server Error" });
  }
});

app.post("/shremish-red", async (req, res) => {

  const parameter = req.body.parameter;

  const red = await Red.create({
    title: parameter,
  });

  const options = {
    method: "GET",
    url: `https://porn-gallery.p.rapidapi.com/pornos/${parameter}`,
    headers: {
      "X-RapidAPI-Key": "b4e651712emsh30f519de3ee1a6fp1e7190jsn3e8979d13b4f",
      "X-RapidAPI-Host": "porn-gallery.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const answerArray = [];
    const answer = response.data;

    for(var i=0; i<answer.results.length; i++)
    {
      for(var j=0; j<answer.results[i].images.length; j++)
      {
        answerArray.push(answer.results[i].images[j]);
      }
    }
    res.json(answerArray);
  } catch (error) {
    console.error(error);
  }
});


app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running at port 5000");
});
