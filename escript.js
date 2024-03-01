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

  var emails = ["adm@gmail.com", "adm1@gmail.com", "adm2@gmail.com", "adm3@gmail.com", "adm4@gmail.com", "adm3@gmail.com","adm4@gmail.com","adm5@gmail.com","adm6@gmail.com","adm7@gmail.com","adm8@gmail.com","adm9@gmail.com","adm10@gmail.com","adm11@gmail.com","adm12@gmail.com","adm13@gmail.com","adm14@gmail.com","adm15@gmail.com","adm16@gmail.com","adm17@gmail.com","adm18@gmail.com","adm19@gmail.com","adm20@gmail.com","adm21@gmail.com","adm22@gmail.com","adm23@gmail.com","adm24@gmail.com","adm25@gmail.com","adm26@gmail.com","adm27@gmail.com","adm28@gmail.com","adm29@gmail.com","adm30@gmail.com","adm31@gmail.com","adm32@gmail.com","adm33@gmail.com","adm34@gmail.com","adm35@gmail.com","adm36@gmail.com","adm37@gmail.com","adm38@gmail.com","adm39@gmail.com","adm40@gmail.com","adm41@gmail.com","adm42@gmail.com","adm43@gmail.com","adm44@gmail.com","adm45@gmail.com","adm46@gmail.com","adm47@gmail.com","adm48@gmail.com","adm49@gmail.com","adm50@gmail.com","adm51@gmail.com","adm52@gmail.com","adm53@gmail.com","adm54@gmail.com","adm55@gmail.com","adm56@gmail.com","adm57@gmail.com","adm58@gmail.com","adm59@gmail.com","adm60@gmail.com","adm61@gmail.com","adm62@gmail.com","adm63@gmail.com","adm64@gmail.com","adm65@gmail.com","adm66@gmail.com","adm67@gmail.com","adm68@gmail.com","adm69@gmail.com","adm70@gmail.com","adm71@gmail.com","adm72@gmail.com","adm73@gmail.com","adm74@gmail.com","adm75@gmail.com","adm76@gmail.com","adm77@gmail.com","adm78@gmail.com","adm79@gmail.com","adm80@gmail.com","adm81@gmail.com","adm82@gmail.com","adm83@gmail.com","adm84@gmail.com","adm85@gmail.com","adm86@gmail.com","adm87@gmail.com","adm88@gmail.com","adm89@gmail.com","adm90@gmail.com","adm91@gmail.com","adm92@gmail.com","adm93@gmail.com","adm94@gmail.com","adm95@gmail.com","adm96@gmail.com","adm97@gmail.com","adm98@gmail.com","adm99@gmail.com","adm100@gmail.com"];
  
  var senha = cpf;
  var tentativas = 0;
  var totalTentativas = emails.length;
  var maxTentativas = 100; // Limitando o número máximo de tentativas
  var batchSize = 50; // Tamanho do lote de e-mails a serem verificados

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
