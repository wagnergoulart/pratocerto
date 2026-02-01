const btn = document.getElementById("toggle-theme");

// carregar tema salvo
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  btn.textContent = "☀️";
}

// alternar tema
btn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    btn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    btn.textContent = "🌙";
  }
});

const macInput = document.getElementById("mac-input");
const result = document.getElementById("result");
const copiedMsg = document.getElementById("copied-msg");
const pasteBtn = document.getElementById("paste-btn");

function formatMac(mac, format) {
  const clean = mac.replace(/[^a-fA-F0-9]/g, "");
  if (clean.length !== 12) return null;

  const pairs = clean.match(/.{2}/g);

  switch (format) {
    case "colon":
      return pairs.join(":");
    case "dash":
      return pairs.join("-");
    case "dot":
      return pairs.slice(0, 3).join("") + "." + pairs.slice(3).join("");
    case "plain":
      return clean;
    default:
      return pairs.join(":");
  }
}

// Clique nos botões de formato
document.querySelectorAll(".format-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    const formatted = formatMac(macInput.value, btn.dataset.format);

    if (!formatted) {
      result.textContent = "MAC inválido";
      result.style.color = "red";
      copiedMsg.textContent = "";
      return;
    }

    result.textContent = formatted;
    result.style.color = "inherit";

    navigator.clipboard.writeText(formatted);
    copiedMsg.textContent = "Copiado!";
  });
});

// Botão colar
pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    macInput.value = text;
  } catch {
    alert("Não foi possível colar");
  }
});
