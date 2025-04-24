import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! I'm here to help. You can ask me about mental health, online safety, or awareness. Or click on a question below to get started!",
    },
  ]);
  const [input, setInput] = useState("");
  const [predefinedQA, setPredefinedQA] = useState([
    {
      question: "What is mental health?",
      answer:
        "Mental health includes emotional, psychological, and social well-being. It affects how we think, feel, and behave.",
    },
    {
      question: "How can I stay safe online?",
      answer:
        "Use strong passwords, avoid sharing personal information, and be cautious of phishing scams.",
    },
    {
      question: "What is consent in sex education?",
      answer:
        "Consent means agreeing to something freely and enthusiastically. It is essential in any relationship.",
    },
    {
      question: "What should I do if I face cyberbullying?",
      answer:
        "Report the incident to the platform, block the bully, and talk to someone you trust.",
    },
  ]);

  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Check if the input matches a predefined question
    const matchedQA = predefinedQA.find(
      (qa) => input.toLowerCase() === qa.question.toLowerCase()
    );

    if (matchedQA) {
      // If a predefined question matches, display the predefined answer
      const botMessage = { type: "bot", text: matchedQA.answer };
      setMessages((prev) => [...prev, botMessage]);

      // Remove the clicked question from the predefined questions list
      setPredefinedQA((prev) =>
        prev.filter((qa) => qa.question !== matchedQA.question)
      );

      setInput(""); // Clear the input field
      return;
    }

    try {
      // If no predefined question matches, send the input to OpenAI API
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant specializing in mental health, online safety, and awareness.",
            },
            { role: "user", content: input },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const botMessage = {
        type: "bot",
        text: response.data.choices[0].message.content.trim(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API Error:", error);

      const botMessage = {
        type: "bot",
        text: "I'm sorry, I couldn't process your request. Please try again later.",
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput(""); // Clear the input field
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handlePredefinedQuestionClick = (question) => {
    setInput(question); // Set the clicked question as input
    setTimeout(() => handleSend(), 0); // Automatically send the question
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      <div
        className="chatbot-header"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: "#0078d7", color: "#fff" }} // Fix button color
      >
        {isOpen ? "(Click to Minimize)" : "Chatbot"}
      </div>
      {isOpen && (
        <div className="chatbot-body">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {predefinedQA.length > 0 && (
            <div className="chatbot-predefined-questions">
              {predefinedQA.map((qa, index) => (
                <button
                  key={index}
                  className="chatbot-question-button"
                  onClick={() => handlePredefinedQuestionClick(qa.question)}
                >
                  {qa.question}
                </button>
              ))}
            </div>
          )}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
