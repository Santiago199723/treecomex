const config = {
  apiKey: "AIzaSyDXS-uF2k6MLySa0Q_ggo8uGjHMVRd_Ues",
    authDomain: "cadastro-orion-global-86cb0.firebaseapp.com",
    databaseURL:
    "https://cadastro-orion-global-default-rtdb.firebaseio.com",
    databaseURL: "https://cadastro-orion-global-86cb0-default-rtdb.firebaseio.com",
    projectId: "cadastro-orion-global-86cb0",
    storageBucket: "cadastro-orion-global-86cb0.appspot.com",
    messagingSenderId: "899820207666",
    appId: "1:899820207666:web:140d8fda3aca8e2634062b" // Adicione esta linha com a URL do seu banco de dados
};

firebase.initializeApp(config);
let database = firebase.database();
let ref = database.ref("cadastro-orion-global");

const uid = localStorage.getItem("uid");

// Mapeia os valores dos estados para suas siglas correspondentes
const estadosSiglas = {
  "": "", // Adicione a sigla padrão para quando nenhum estado for selecionado
  12: "AC",
  27: "AL",
  13: "AM",
  16: "AP",
  29: "BA",
  23: "CE",
  53: "DF",
  32: "ES",
  52: "GO",
  21: "MA",
  31: "MG",
  50: "MS",
  51: "MT",
  15: "PA",
  25: "PB",
  26: "PE",
  22: "PI",
  41: "PR",
  33: "RJ",
  24: "RN",
  11: "RO",
  14: "RR",
  43: "RS",
  42: "SC",
  28: "SE",
  35: "SP",
  17: "TO",
};

document
  .getElementById("cadastro-orion-global")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let nome = getElementVal("nome");
    let empresa = getElementVal("empresa");
    let cpf = getElementVal("cpf");
    let cnpj = getElementVal("cnpj");
    let tipo = getTipoSelecionado();
    let estado = estadosSiglas[getElementVal("CodUf")];

    let can = true;

    ref
      .orderByChild("registeredBy")
      .equalTo(uid)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const data = childSnapshot.val();
          if (data) {
            let sel = document.querySelector(".alert");
            sel.innerHTML = "Ops, você não pode cadastrar mais de uma vez!";
            sel.style.display = "block";
            can = false;
          }
        });
      });

    setTimeout(() => {
      if (can) {
        saveCPFOrCNPJ(nome, empresa, cpf, cnpj, tipo, estado, uid);

        document.querySelector(".alert").style.display = "block";

        setTimeout(() => {
          document.querySelector(".alert").style.display = "none";
        }, 3000);

        document.getElementById("cadastro-orion-global").reset();

        document.getElementById("mensagem-sucesso").style.display = "block";

        setTimeout(function () {
          window.location.href = "CPF.html";
        }, 2000);
      }
    }, 2000);
  });

const saveCPFOrCNPJ = (
  nome,
  empresa,
  cpf,
  cnpj,
  tipo,
  estado,
  registeredBy
) => {
  let k = ref.push();

  k.set({
    name: nome,
    empresa: empresa,
    cpf: cpf,
    cnpj: cnpj,
    tipo: tipo,
    estado: estado,
    registeredBy: registeredBy,
    dataCriacao: new Date().toString(),
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

function getTipoSelecionado() {
  let checkboxes = document.getElementsByName("tipo");
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      return checkboxes[i].value;
    }
  }
  return null; // Retorna null se nenhum checkbox estiver selecionado
}

window.onload = function () {
  if (!uid) {
    window.location.href = "/";
  }
};
