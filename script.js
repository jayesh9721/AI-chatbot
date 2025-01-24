const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatDisplay = document.getElementById("chat-display");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

async function fetchGroqData(messages) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`, // Corrected template literal syntax
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}` // Corrected template literal syntax
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Sorry, I encountered an error. Please try again later.");
  }
}

function appendMessage(content, isUser = false, isError = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(
    isUser ? "user-message" : isError ? "error-message" : "bot-message"
  );
  messageElement.textContent = content;
  chatDisplay.appendChild(messageElement);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

async function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    appendMessage(userMessage, true);
    userInput.value = "";

    try {
      const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ];

      const botResponse = await fetchGroqData(messages);
      appendMessage(botResponse);
    } catch (error) {
      appendMessage(error.message, false, true);
    }
  }
}

sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleUserInput();
  }
});

chatDisplay.innerHTML = "";

appendMessage(""); // This line can be removed if not needed
