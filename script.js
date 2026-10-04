const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messages = document.getElementById("messages");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) return;

  // Show user's message
  messages.insertAdjacentHTML(
    "beforeend",
    `<div class="message user">
      <div class="bubble">${escapeHtml(message)}</div>
    </div>`
  );

  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    messages.insertAdjacentHTML(
      "beforeend",
      `<div class="message bot">
        <div class="bubble">${escapeHtml(data.reply || "No response.")}</div>
      </div>`
    );
  } catch (error) {
    messages.insertAdjacentHTML(
      "beforeend",
      `<div class="message bot">
        <div class="bubble">Sorry, I couldn't connect to the server.</div>
      </div>`
    );
  }

  messages.scrollTop = messages.scrollHeight;
});

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}