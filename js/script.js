const API_URL = "https://serveur-api-1-0.onrender.com/api/auth/login";

const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginButton = document.querySelector("#login-button");
const loginMessage = document.querySelector("#login-message");

function afficherMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = `message ${type}`;
}

function definirChargement(enChargement) {
    loginButton.disabled = enChargement;
    loginButton.classList.toggle("loading", enChargement);
    loginButton.querySelector(".button-text").textContent =
        enChargement ? "Connexion en cours..." : "Se connecter";
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        afficherMessage("Veuillez remplir tous les champs.", "error");
        return;
    }

    afficherMessage("", "");
    definirChargement(true);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        let data = {};
        try {
            data = await response.json();
        } catch {
            // La réponse peut être vide ou ne pas être au format JSON.
        }

        if (response.ok && data.success === true) {
            afficherMessage(
                data.message || "Authentification réussie.",
                "success"
            );

            // Prochaine étape : rediriger vers la page d'accueil.
            // window.location.href = "accueil.html";
        } else if (response.status === 401) {
            afficherMessage("Nom d'utilisateur ou mot de passe invalide.", "error");
        } else {
            afficherMessage(
                data.message || `Une erreur est survenue (HTTP ${response.status}).`,
                "error"
            );
        }
    } catch (error) {
        console.error("Erreur lors de la connexion à l'API :", error);
        afficherMessage(
            "Impossible de joindre l'API. Vérifiez qu'elle fonctionne sur le port 8080 et que le CORS est configuré.",
            "error"
        );
    } finally {
        definirChargement(false);
    }
});
