const config = {
  apiKey: "AIzaSyAV9yNJNdZyueITfM8OvKhrU2Al_J2VRW0",
  authDomain: "orion-global-login.firebaseapp.com",
  databaseURL:
  "https://orion-global-login-default-rtdb.firebaseio.com",
  projectId: "orion-global-login",
  storageBucket: "orion-global-login.appspot.com",
  messagingSenderId: "789772166465",
  appId: "1:789772166465:web:be1f5c9962cf5563f6edc0"
};

firebase.initializeApp(config);

let btn = document.querySelector(".fa-eye");
let inputSenha = document.querySelector("#senha");
let msgError = document.querySelector("#msgError");

btn.addEventListener("click", () => {
  if (inputSenha.getAttribute("type") === "password") {
    inputSenha.setAttribute("type", "text");
  } else {
    inputSenha.setAttribute("type", "password");
  }
});

function showErrorMessage(message) {
  msgError.style.display = "block";
  msgError.innerHTML = message;
}

function hideErrorMessage() {
  msgError.style.display = "none";
  msgError.innerHTML = "";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function authorize() {
  console.log("Tentativa de login iniciada.");
  hideErrorMessage();
  showLoading();

  if (!usuario.value || !senha.value) {
    showErrorMessage("Preencha todos os campos para poder logar.");
    hideLoading();
    return;
  }

  const email = usuario.value;
  const password = senha.value;

  if (!isValidEmail(email)) {
    showErrorMessage("Formato de e-mail inválido.");
    hideLoading();
    return;
  }

  console.log("Email:", email);
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    console.log("Login bem-sucedido.");
    hideLoading();

    let user = firebase.auth().currentUser;

    return {uid: user.uid, email: email};
  } catch (err) {
    console.error("Erro durante o login:", err);
    hideLoading();
    const error = JSON.parse(err.message);
    showErrorMessage(getErrorMessage(error));
  }
}

function entrar() {
  authorize().then((data) => {
    if (data) {
      localStorage.setItem("uid", data.uid);
      localStorage.setItem("email", data.email);
      window.location.href = "CPF.html";
    }
  });
}

const btnEntrar = document.querySelector("#btnEntrar");
if (btnEntrar) {
  btnEntrar.addEventListener("click", entrar);
}

function getErrorMessage(obj) {
  switch (obj.error.message) {
    case "auth/user-not-found":
      return "Usuário não encontrado";
    case "INVALID_LOGIN_CREDENTIALS":
      return "Usuário não tem cadastro ou e-mail e senha incorretos.";
    case "auth/invalid-email":
      return "Endereço de e-mail inválido";
    default:
      return obj.error.message;
  }
}

function register() {
  window.location.href = "pages/register/register.html";
}
