document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var cpf = document.getElementById('cpfInput').value;
    // Remove qualquer caractere que não seja um dígito
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se o campo CPF está vazio
    if (cpf.trim() === '') {
      document.getElementById('result').innerHTML = 'Informe seu CPF ou CNPJ!';
      return; // Encerra a execução da função se o campo estiver vazio
    }
    
    if (validateCPF(cpf)) {
      // Se o CPF estiver em um dos formatos válidos, redireciona para outra página
      window.location.href = 'botoesetapas.html';
    } else {
      document.getElementById('result').innerHTML = 'CPF ou CNPJ não cadastrado ou incorreto. Por favor, insira um CPF ou CNPJ válido!';
    }
  });
  
  // Adicionando evento de clique ao elemento "Não possuo cadastro"
  document.getElementById('noCadastro').addEventListener('click', function() {
    // Redirecionando para outra página
    window.location.href = 'cadastro.html';
  });
  
  // Função para validar CPF
  function validateCPF(cpf) {
    // Lista de CPFs válidos
    var cpfList = ['11111111111', '22222222222', '111.111.111-11', '222.222.222-22'];
    // Remove pontos e traços para comparar com os CPFs válidos
    var cpfSemFormatacao = cpf.replace(/\D/g, '');
    // Verifica se o CPF está na lista de CPFs válidos
    return cpfList.includes(cpfSemFormatacao);
  }
  