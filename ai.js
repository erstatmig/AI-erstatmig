// ai.js
async function sendToAI() {
  const inputField = document.getElementById("userInput");
  const responseBox = document.getElementById("response");

  const message = inputField.value.trim();
  if (!message) return;

  responseBox.style.display = "block";
  responseBox.textContent = "Svar afventer...";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    if (data.reply) {
      responseBox.textContent = data.reply;
    } else {
      responseBox.textContent = "Intet svar modtaget.";
    }
  } catch (error) {
    responseBox.textContent = "Der opstod en fejl ved afsendelse.";
  }
}
