    import { NextResponse } from "next/server";

    // Default questions in case of API failure
    const allQuestions = [
    {
        id: "1",
        question: "Do you smoke cigarettes?",
        type: "yes-no",
    },
    {
        id: "2",
        question: "Do you drive a diesel vehicle?",
        type: "yes-no",
    },
    {
        id: "3",
        question: "How often do you eat meat?",
        type: "multiple-choice",
        options: ["Daily", "Weekly", "Rarely", "Never"],
    },
    {
        id: "4",
        question: "What is your primary mode of transportation?",
        type: "text",
    },
    {
        id: "5",
        question: "How many flights have you taken in the past year?",
        type: "number",
    }
    ];

    export default async function POST(req) {
    const apiKey = process.env.GOOGLE_API;
    const { inputData } = await req.json();

    if (!apiKey) {
        return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    const prompt = `
    Generate 1 to 5 survey questions to understand user behavior for a Carbon Footprint Tracker based on the following data:
    ${JSON.stringify(inputData)}
    Provide output in JSON format with id, question, question_type (yes-no | multiple-choice | text | number), and options (if applicable).
    `;

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
        });

        if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        // Extract JSON data from response text
        const cleanedText = responseText.startsWith("```json") ? responseText.slice(7, -3).trim() : responseText;
        const questions = JSON.parse(cleanedText);

        return NextResponse.json({ questions });
    } catch (error) {
        console.error("Error generating survey questions:", error.message);
        const randomCount = Math.floor(Math.random() * 5) + 1;
        const fallbackQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, randomCount);
        return NextResponse.json({ questions: fallbackQuestions });
    }
    }
