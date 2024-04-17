const config = {
  apiKey: "AIzaSyDXS-uF2k6MLySa0Q_ggo8uGjHMVRd_Ues",
  authDomain: "cadastro-orion-global-86cb0.firebaseapp.com",
  databaseURL: "https://cadastro-orion-global-86cb0-default-rtdb.firebaseio.com",
  projectId: "cadastro-orion-global-86cb0",
  storageBucket: "cadastro-orion-global-86cb0.appspot.com",
  messagingSenderId: "899820207666",
  appId: "1:899820207666:web:140d8fda3aca8e2634062b",
};

firebase.initializeApp(config);

const types = ["cpf", "cnpj"];

let database = firebase.database();
let usersRef = database.ref("users");
let cadastroRef = database.ref("cadastro-orion-global");

const email = localStorage.getItem("email");

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let data = document.getElementById("dataInput").value;
    data = data.replace(/\D/g, "");

    if (data.length !== 11 && data.length !== 14) {
      document.getElementById("result").innerHTML =
        "Informe um CPF ou CNPJ válido!";
      return;
    }

    document.getElementById("result").innerHTML =
      "Aguarde, já estamos identificando..";

    usersRef
      .orderByChild("email")
      .equalTo(email)
      .once("value", (snapshot) => {
        document.getElementById("result").innerHTML =
          "Aguarde, estou verificando no banco de dados...";

        let found = false; // Variável para controlar se algum tipo foi encontrado

        snapshot.forEach(function (childSnapshot) {
          const sdata = childSnapshot.val();
          if (sdata && !found) { // Verifica se o tipo ainda não foi encontrado
            for (let i = 0; i < types.length; i++) {
              cadastroRef
                .orderByChild(types[i])
                .equalTo(data)
                .once("value", function (snapshot) {
                  if (snapshot.exists()) {
                    snapshot.forEach(function (childSnapshot) {
                      const result = childSnapshot.val();
                      if (result) {
                        if (
                          result.registeredBy !== sdata.uid &&
                          !sdata.master
                        ) {
                          alert(
                            "Você não tem acesso a esta empresa!"
                          );
                        } else {
                          localStorage.setItem("code", data);
                          document.getElementById("result").innerHTML =
                            "Validado com sucesso!";
                          window.location.href = "botoesetapas.html";
                        }
                        found = true; // Marca que o tipo foi encontrado
                      }
                    });
                  } else {
                    document.getElementById("result").innerHTML =
                      "CPF ou CNPJ não cadastrados ou incorretos!";
                  }
                });
            }
          }
        });

        if (!found) { // Se nenhum tipo foi encontrado, exibe a mensagem padrão
          document.getElementById("result").innerHTML =
            "CPF ou CNPJ não cadastrados ou incorretos!";
        }
      });
  });

document.getElementById("noCadastro").addEventListener("click", function () {
  window.location.href = "cadastro.html";
});

window.onload = function () {
  if (!email) {
    window.location.href = "/";
  }
};
