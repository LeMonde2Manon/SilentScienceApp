
const buttons = [...document.querySelectorAll(".theme")];

const wait = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Tentative de passage en plein écran
async function enterFullscreen() {
  if (document.fullscreenElement) return;

  try {
    await document.documentElement.requestFullscreen();
  } catch (error) {
    console.log(
      "Le navigateur nécessite une interaction pour le plein écran."
    );
  }
}

// Lecture d'une phrase avec la voix française
function speak(text) {
  return new Promise(resolve => {
    if (!("speechSynthesis" in window)) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.78;
    utterance.pitch = 1;

    utterance.onend = resolve;
    utterance.onerror = resolve;

    speechSynthesis.speak(utterance);
  });
}

// Mettre un pictogramme en avant, prononcer son nom,
// puis le remettre à sa place
async function introduceTheme(theme) {
  const button = buttons.find(
    item => item.dataset.theme === theme
  );

  if (!button) return;

  button.classList.add("highlight");

  await speak(button.querySelector("span").textContent);
  await wait(900);

  button.classList.remove("highlight");
  await wait(700);
}

// Présentation initiale
async function startPresentation() {
  await speak("Que veux-tu comprendre ?");
  await wait(700);

  await introduceTheme("milky-way");
  await introduceTheme("solar-system");

  // Les deux pictogrammes sont revenus à leur place.
  // L'application attend maintenant le choix de l'enfant.
}

// Réaction au toucher d'un pictogramme
buttons.forEach(button => {
  button.addEventListener("click", async () => {
    // Nouvelle tentative de plein écran après interaction
    await enterFullscreen();

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }

    buttons.forEach(item =>
      item.classList.remove("highlight")
    );

    const theme = button.dataset.theme;

    console.log("Thème sélectionné :", theme);

    // Nous ajouterons ici l'ouverture du thème choisi.
  });
});

// Enregistrement du service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .catch(error => {
      console.error("Erreur service worker :", error);
    });
}

// Tentative au chargement
window.addEventListener("load", () => {
  enterFullscreen();
  startPresentation();
});

