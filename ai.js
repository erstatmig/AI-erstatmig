// ai.js
async function sendToAI() {
  const inputField = document.getElementById("userInput");
  const responseBox = document.getElementById("response");
  const spinner = document.getElementById("spinner");

  const message = inputField.value.trim();
  if (!message) return;

  responseBox.style.display = "none";
  spinner.style.display = "block";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    spinner.style.display = "none";

    if (data.reply) {
      responseBox.textContent = data.reply;
    } else {
      responseBox.textContent = "Intet svar modtaget.";
    }

    responseBox.style.display = "block";
  } catch (error) {
    spinner.style.display = "none";
    responseBox.textContent = "Der opstod en fejl ved afsendelse.";
    responseBox.style.display = "block";
  }
}
