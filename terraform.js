import express from 'express';
import dotenv from "dotenv"
dotenv.config()
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());

app.post('/generate-terraform', async (req, res) => {
    try {
        const { userRequest } = req.body;
        if (!userRequest) {
            return res.status(400).send({ error: 'Please provide a valid request.' });
        }

        const prompt = `Generate a Terraform code for the following request: ${userRequest}. Give me only Terraform code and nothing else.`;

        const result = await model.generateContent(prompt);
        console.log(result.response.text())
        res.send({ terraformCode: result.response.text() });
    } catch (error) {
        console.error('Error generating Terraform code:', error);
        res.status(500).send({ error: 'Something went wrong while generating the Terraform code.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
