const config = {
  apiKey: "AIzaSyCvww91bXh1KIpVp59AdC94T8K06ymjvxs",
  authDomain: "cadastro-orion-global.firebaseapp.com",
  databaseURL: "https://cadastro-orion-global-default-rtdb.firebaseio.com",
  projectId: "cadastro-orion-global",
  storageBucket: "cadastro-orion-global.appspot.com",
  messagingSenderId: "687560691012",
  appId: "1:687560691012:web:5445782a7ee55a429e9b11",
  measurementId: "G-69FTGZDCGF",
};

firebase.initializeApp(config);

let database = firebase.database();
let ref = database.ref("cadastro-orion-global");

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let data = document.getElementById("dataInput").value;
    data = data.replace(/\D/g, "");

    if (data.length !== 11 && data.length !== 18) {
      document.getElementById("result").innerHTML =
        "Informe um CPF ou CNPJ válido!";
      return;
    }

    // if (data.trim().toLowerCase() === "admin") {
    // window.location.href = "https://console.firebase.google.com/u/0/project/cpf-ou-cnpj-tela/authentication/users";
    // return;
    // }

    document.getElementById("result").innerHTML =
      "Aguarde, estou verificando no banco de dados...";

    let authorized = false;

    setTimeout(() => {
      document.getElementById("result").innerHTML =
        "Aguarde, estou verificando no banco de dados...";
    }, 2000);

    ref
      .orderByChild("cpf")
      .equalTo(data)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const result = childSnapshot.val();
          if (result) {
            authorized = !authorized;
            document.getElementById("result").innerHTML =
              "Validado com sucesso!";
            window.location.href = "botoesetapas.html";
            return;
          }
        });
      });

    ref
      .orderByChild("cnpj")
      .equalTo(data)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const result = childSnapshot.val();
          if (result) {
            authorized = !authorized;
            document.getElementById("result").innerHTML =
              "Validado com sucesso!";
            window.location.href = "botoesetapas.html";
            return;
          }
        });
      });

    setTimeout(() => {
      if (!authorized) {
        document.getElementById("result").innerHTML =
          "CPF ou CNPJ não cadastrados ou incorretos!";
        return;
      }
    }, 2000);
  });

document.getElementById("noCadastro").addEventListener("click", function () {
  window.location.href = "cadastro.html";
});