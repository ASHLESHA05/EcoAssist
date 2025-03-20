import { NextResponse } from "next/server"

export async function GET() {
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
    },
    {
      id: "6",
      question: "Do you use renewable energy sources at home?",
      type: "yes-no",
    },
    {
      id: "7",
      question: "How often do you use public transport?",
      type: "multiple-choice",
      options: ["Daily", "Weekly", "Rarely", "Never"],
    },
    {
      id: "8",
      question: "How energy-efficient are your home appliances?",
      type: "multiple-choice",
      options: ["Highly Efficient", "Moderately Efficient", "Not Efficient", "Not Sure"],
    },
    {
      id: "9",
      question: "Do you practice recycling at home?",
      type: "yes-no",
    },
    {
      id: "10",
      question: "What type of heating or cooling system do you use at home?",
      type: "text",
    },
    {
      id: "11",
      question: "How often do you shop for new clothes?",
      type: "multiple-choice",
      options: ["Monthly", "Quarterly", "Annually", "Rarely"],
    },
    {
      id: "12",
      question: "Do you compost organic waste?",
      type: "yes-no",
    },
    {
      id: "13",
      question: "How much water do you consume daily?",
      type: "number",
    },
    {
      id: "14",
      question: "Do you prefer using reusable bags over plastic bags?",
      type: "yes-no",
    },
    {
      id: "15",
      question: "How often do you eat locally sourced food?",
      type: "multiple-choice",
      options: ["Daily", "Weekly", "Rarely", "Never"],
    },
    {
      id: "16",
      question: "Do you have energy-efficient lighting at home?",
      type: "yes-no",
    },
    {
      id: "17",
      question: "How often do you participate in carpooling or ridesharing?",
      type: "multiple-choice",
      options: ["Daily", "Weekly", "Rarely", "Never"],
    },
    {
      id: "18",
      question: "What kind of waste management practices do you follow?",
      type: "text",
    }
  ];

  const randomCount = Math.floor(Math.random() * 5) + 1;
  const questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, randomCount);

  return NextResponse.json({ questions });
}
