const firebaseConfig = {
  //   copy your firebase config informations
  apiKey: "AIzaSyCvww91bXh1KIpVp59AdC94T8K06ymjvxs",
    authDomain: "cadastro-orion-global.firebaseapp.com",
    databaseURL: "https://cadastro-orion-global-default-rtdb.firebaseio.com",
    projectId: "cadastro-orion-global",
    storageBucket: "cadastro-orion-global.appspot.com",
    messagingSenderId: "687560691012",
    appId: "1:687560691012:web:5445782a7ee55a429e9b11",
    measurementId: "G-69FTGZDCGF"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var contactFormDB = firebase.database().ref("cadastro-orion-global");

document.getElementById("cadastro-orion-global").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var nome = getElementVal("nome");
  var empresa = getElementVal("empresa");
  var cpf = getElementVal("cpf");
  var cnpj = getElementVal("cnpj");

  saveMessages(nome, empresa, cpf, cnpj);


  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("cadastro-orion-global").reset();
}

const saveMessages = (nome, empresa, cpf, cnpj) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    name: nome,
    empresa: empresa,
    cpf: cpf,
    cnj: cnpj,
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};
