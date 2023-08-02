import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

const REQUEST_DELAY_MS = 2000; // Ubah sesuai kebutuhan

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Success",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // Memberi jeda antara permintaan API
    await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(error.message || "Terjadi kesalahan saat memproses permintaan.");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
