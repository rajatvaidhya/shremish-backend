const express = require("express");
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');
require("dotenv").config();

const OPENAI_API_KEY = process.env.REACT_APP_API;

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});


const app = express();
app.use(express.json());
app.use(cors());
const openai = new OpenAIApi(configuration);

app.post('/chat', (req,res)=>{

    const query = req.body.query;

    openai.createCompletion({
        model: "text-davinci-003",
        prompt: query,
        max_tokens: 4000,
        temperature: 0,
    })
    .then((response)=>{
        return response.data.choices[0].text;
    })
    .then((answer)=>{
        const array = answer.split("\n").filter((value)=>value).map((value)=>value.trim());
        // const array = answer;
        return array;
    })
    .then((answer)=>{
        res.json({answer:answer});
    })
    .catch((error)=> {
        console.log(error);
    })
})

app.listen(process.env.PORT || 5000, ()=>{
    console.log("Server is running at port 5000");
})