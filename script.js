const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messages = document.getElementById("messages");

let conversationCount = 1;

// Send message
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) return;

  // Show user's message
  messages.insertAdjacentHTML(
    "beforeend",
    `
      <div class="message user">
        <div class="bubble">${escapeHtml(message)}</div>
      </div>
    `
  );

  input.value = "";

  // Update conversation count
  conversationCount++;
  updateConversationCount();

  // Show thinking message
  const thinking = document.createElement("div");
  thinking.className = "message bot";
  thinking.id = "thinking-message";

  thinking.innerHTML = `
    <div class="bubble">
      ⚡ Flash AI is thinking...
    </div>
  `;

  messages.appendChild(thinking);
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await 
    fetch("https://flash-ai-lxa0.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    });

    const data = await response.json();

    // Remove thinking message
    thinking.remove();

    // Show AI response
    messages.insertAdjacentHTML(
      "beforeend",
      `
        <div class="message bot">
          <div class="bubble">
            ${escapeHtml(data.reply || "No response.")}
          </div>
        </div>
      `
    );

  } catch (error) {

    console.error(error);

    thinking.remove();

    messages.insertAdjacentHTML(
      "beforeend",
      `
        <div class="message bot">
          <div class="bubble">
            Sorry, I couldn't connect to the server. Please try again.
          </div>
        </div>
      `
    );
  }

  messages.scrollTop = messages.scrollHeight;
});


// Conversation counter
function updateConversationCount() {
  const cards = document.querySelectorAll(".stat-card");

  if (cards.length >= 2) {
    const number = cards[1].querySelector("strong");

    if (number) {
      number.textContent = conversationCount;
    }
  }
}


// Sidebar buttons
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((item) => {

  item.addEventListener("click", () => {

    const text = item.textContent.trim();

    // Remove active state
    menuItems.forEach((menu) => {
      menu.classList.remove("active");
    });

    item.classList.add("active");

    // New Chat
    if (text.includes("New Chat")) {
      startNewChat();
    }

    // Chat History
    if (text.includes("Chat History")) {
      showHistory();
    }

    // Settings
    if (text.includes("Settings")) {
      showSettings();
    }

    // About
    if (text.includes("About")) {
      showAbout();
    }

  });

});


// Start a new chat
function startNewChat() {

  messages.innerHTML = `
    <div class="message bot">
      <div class="bubble">
        Hello! I'm Flash AI. How can I help you today? ⚡
      </div>
    </div>
  `;

  conversationCount = 1;
  updateConversationCount();

  input.focus();
}


// Chat history
function showHistory() {

  messages.innerHTML = `
    <div class="message bot">
      <div class="bubble">
        🕘 Chat History
        <br><br>
        Your current conversation is available above.
        <br>
        More history features can be added later.
      </div>
    </div>
  `;

}


// Settings
function showSettings() {

  messages.innerHTML = `
    <div class="message bot">
      <div class="bubble">
        ⚙️ Flash AI Settings
        <br><br>
        • AI Assistant: Flash AI
        <br>
        • Status: Online
        <br>
        • Server: Connected
        <br>
        • AI responses: Enabled
      </div>
    </div>
  `;

}


// About
function showAbout() {

  messages.innerHTML = `
    <div class="message bot">
      <div class="bubble">
        ⚡ About Flash AI
        <br><br>
        Flash AI is an AI-powered virtual assistant
        designed to provide helpful and intelligent
        responses to users.
        <br><br>
        Version 1.0
      </div>
    </div>
  `;

}


// Escape HTML for security
function escapeHtml(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}