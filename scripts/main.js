Hooks.on("chatMessage", async (chatLog, messageText, chatData) => {
  if (messageText.startsWith("!ask")) {
    const question = messageText.slice(4).trim();
    const answer = await sendQuestionToAI(question);
    ChatMessage.create({
      content: `AI: ${answer}`,
      speaker: { alias: "AI" }
    });
  }
});

Hooks.on("renderChatLog", (chatLog, html, data) => {
  const form = createQuestionForm();
  html.find(".chat-controls").prepend(form);
});

const OPENAI_API_KEY = "org-N2u9Y5a2UZ9WDLLM8egPq1Wo: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";

async function sendQuestionToAI(question) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      prompt: question,
      max_tokens: 150,
      temperature: 0.5,
      n: 1,
      stop: "\n"
    })
  };

  const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", requestOptions);
  const data = await response.json();
  const generatedText = data.choices[0].text.trim();

  return generatedText;
}

function createQuestionForm() {
  const form = document.createElement("form");
  form.className = "ai-form";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ask a question...";
  input.required = true;

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Ask";

  form.appendChild(input);
  form.appendChild(submitButton);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value;
    const answer = await sendQuestionToAI(question);
    ChatMessage.create({
      content: `AI: ${answer}`,
      speaker: { alias: "AI" }
    });
    input.value = "";
  });

  return form;
}

const MODULE_NAME = "Orb and Scepter";

Hooks.once("init", () => {
  console.log(`${MODULE_NAME} | Initializing ${MODULE_NAME}`);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_NAME} | ${MODULE_NAME} is ready`);
  ui.notifications.info(`${MODULE_NAME} is ready!`);
});

Hooks.once("setup", () => {
  console.log(`${MODULE_NAME} | Setting up ${MODULE_NAME}`);
});

Hooks.once("start", () => {
  console.log(`${MODULE_NAME} | Starting ${MODULE_NAME}`);
});