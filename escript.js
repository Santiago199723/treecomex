document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var cpf = document.getElementById('cpfInput').value;
  cpf = cpf.replace(/\D/g, ''); // Remover caracteres não numéricos

  // Verificar se o CPF tem pelo menos 11 números e no máximo 14
  if (cpf.length !== 11 && cpf.length !== 18) {
    document.getElementById('result').innerHTML = 'Informe um CPF ou CNPJ válido!';
    return;
  }



  // Verificar se o input é admin (com espaços em branco removidos)
if (cpf.trim().toLowerCase() === "admin") {
  window.location.href = "https://console.firebase.google.com/u/0/project/cpf-ou-cnpj-tela/authentication/users";
  return;
}


  // Adicionando mensagem de espera
  document.getElementById('result').innerHTML = 'Aguarde, já estamos identificando..';

  var emails = ["adm1@gmail.com", "adm2@gmail.com", "adm3@gmail.com", "adm4@gmail.com", "adm5@gmail.com"];
  
  var senha = cpf;
  var tentativas = 0;
  var totalTentativas = emails.length;
  var maxTentativas = 10; // Limitando o número máximo de tentativas
  var batchSize = 10; // Tamanho do lote de e-mails a serem verificados

  function tentarAutenticar() {
    if (tentativas >= totalTentativas || tentativas >= maxTentativas) {
      document.getElementById('result').innerHTML = 'CPF ou CNPJ não cadastrados ou incorretos!';
      return;
    }

    var email = emails[tentativas];

    // Adicionando mensagem de identificação
    document.getElementById('result').innerHTML = 'Aguarde, estou verificando no banco de dados...';

    firebase.auth().signInWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        if (userCredential.user) {
          window.location.href = 'botoesetapas.html';
        } else {
          tentativas++;
          tentarAutenticar();
        }
      })
      .catch((error) => {
        console.error("Erro ao autenticar usuário:", error.message);
        tentativas++;
        tentarAutenticar();
      });
  }

  tentarAutenticar();
});

document.getElementById('noCadastro').addEventListener('click', function() {
  window.location.href = 'cadastro.html';
});
