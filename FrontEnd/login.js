const URL_LOGIN = "http://localhost:5678/api/users/login";

function login() {
  const loginForm = document.getElementById("loginform");
  //   attention il faut aussi que l'event listener soit async
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    // j'essayais de console.log ce que j'entrais mais sans preventDefault ça recharge la page donc pas le temps

    // et vu que tes inputs ont bien un name tu peux les prendre par ce name
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    console.log(email);
    console.log(password);

    const reponseLogin = await fetch(URL_LOGIN, {
      method: "POST",
      //Important pour que le serveur comprenne que le texte se lit comme du json
      headers: { "Content-Type": "application/json" },

      //   il faut forcément envoyer un string
      body: JSON.stringify({ email, password }),
    });

    const data = await reponseLogin.json();

    if (reponseLogin.ok) {
      console.log("Connexion réussie", data);
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      let errorMessage = document.querySelector(".error-msg");
      if (!errorMessage) {
        let errorMessage = document.createElement("p");
        console.log("Erreur", reponseLogin.status, data.message);
        errorMessage.textContent = `Erreur ${reponseLogin.status} ${data.message}, email ou mot de passe incorrect`;
        errorMessage.className = "error-msg";
        loginForm.appendChild(errorMessage);
      }
    }
  });
}

login();
