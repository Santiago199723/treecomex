const firebaseConfig = {
  apiKey: "AIzaSyDXS-uF2k6MLySa0Q_ggo8uGjHMVRd_Ues",
    authDomain: "cadastro-orion-global-86cb0.firebaseapp.com",
    databaseURL:
    "https://cadastro-orion-global-default-rtdb.firebaseio.com",
    databaseURL: "https://cadastro-orion-global-86cb0-default-rtdb.firebaseio.com",
    projectId: "cadastro-orion-global-86cb0",
    storageBucket: "cadastro-orion-global-86cb0.appspot.com",
    messagingSenderId: "899820207666",
    appId: "1:899820207666:web:140d8fda3aca8e2634062b" 
};

firebase.initializeApp(firebaseConfig);

var contactFormDB = firebase.database().ref("cadastro-orion-global");

document.getElementById("cadastro-orion-global").addEventListener("submit", submitForm);

// Mapeia os valores dos estados para suas siglas correspondentes
const estadosSiglas = {
  "": "", // Adicione a sigla padrão para quando nenhum estado for selecionado
  "12": "AC",
  "27": "AL",
  "13": "AM",
  "16": "AP",
  "29": "BA",
  "23": "CE",
  "53": "DF",
  "32": "ES",
  "52": "GO",
  "21": "MA",
  "31": "MG",
  "50": "MS",
  "51": "MT",
  "15": "PA",
  "25": "PB",
  "26": "PE",
  "22": "PI",
  "41": "PR",
  "33": "RJ",
  "24": "RN",
  "11": "RO",
  "14": "RR",
  "43": "RS",
  "42": "SC",
  "28": "SE",
  "35": "SP",
  "17": "TO"
};

function submitForm(e) {
  e.preventDefault();

  var nome = getElementVal("nome");
  var empresa = getElementVal("empresa");
  var cpf = getElementVal("cpf");
  var cnpj = getElementVal("cnpj");
  var tipo = getTipoSelecionado();
  var estadoValue = getElementVal("CodUf");
  var estadoSigla = estadosSiglas[estadoValue]; // Obtém a sigla do estado com base no valor selecionado

  saveMessages(nome, empresa, cpf, cnpj, tipo, estadoSigla);

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("cadastro-orion-global").reset();
}

const saveMessages = (nome, empresa, cpf, cnpj, tipo, estado) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    name: nome,
    empresa: empresa,
    cpf: cpf,
    cnpj: cnpj,
    tipo: tipo,
    estado: estado
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

function getTipoSelecionado() {
  var checkboxes = document.getElementsByName("tipo");
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      return checkboxes[i].value;
    }
  }
  return null; // Retorna null se nenhum checkbox estiver selecionado
}
