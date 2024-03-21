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
  
  const uid = localStorage.getItem("uid");
  const currentEtapaNum = Number(window.location.pathname.match(/[0-9]+/)[0]);
  
  function validateStep(button) {
    let answer = prompt(
      "VOCÊ JÁ CONCLUIU ESSA ETAPA? digite (SIM/NAO/DESMARCAR)"
    );
    if (answer !== null) {
      answer = answer.toUpperCase();
      let messageDiv = button.querySelector(".message");
      const etapaName = button.querySelector("span").innerHTML;
      const etapaTipo = getEtapaTipo(etapaName);
      if (answer.toUpperCase() === "SIM") {
        ref
          .orderByChild("uid")
          .equalTo(uid)
          .once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              if (data) {
                if (data.etapas && data.etapas.length > 0) {
                  const etapaIndex = data.etapas.findIndex(
                    (d) => d.tipo === etapaTipo && d.etapa == currentEtapaNum
                  );
                  if (etapaIndex !== -1) {
                    data.etapas[etapaIndex] = {
                      ...data.etapas[etapaIndex],
                      nome: etapaName,
                      estado: "finished",
                    };
                  } else {
                    data.etapas.push({
                      tipo: etapaTipo,
                      nome: etapaName,
                      estado: "finished",
                      etapa: currentEtapaNum,
                    });
                  }
                } else {
                  data.etapas = [
                    {
                      tipo: etapaTipo,
                      nome: etapaName,
                      estado: "finished",
                      etapa: currentEtapaNum,
                    },
                  ];
                }
  
                childSnapshot.ref
                  .update(data)
                  .then(() => {
                    console.log("Data updated successfully");
                  })
                  .catch((error) => {
                    console.error("Error updating data: ", error);
                  });
              }
            });
          });
  
        button.classList.add("active");
        button.classList.remove("pending");
        messageDiv.textContent = "CONCLUÍDO!";
      } else if (answer.toUpperCase() === "NAO") {
        ref
          .orderByChild("uid")
          .equalTo(uid)
          .once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              if (data) {
                if (data.etapas && data.etapas.length > 0) {
                  const etapaIndex = data.etapas.findIndex(
                    (etapa) => etapa.tipo === etapaTipo
                  );
                  if (etapaIndex !== -1) {
                    data.etapas[etapaIndex] = {
                      ...data.etapas[etapaIndex],
                      nome: etapaName,
                      estado: "pending",
                    };
                  } else {
                    data.etapas.push({
                      tipo: etapaTipo,
                      nome: etapaName,
                      estado: "pending",
                      etapa: currentEtapaNum,
                    });
                  }
                } else {
                  data.etapas = [
                    {
                      tipo: etapaTipo,
                      nome: etapaName,
                      estado: "pending",
                      etapa: currentEtapaNum,
                    },
                  ];
                }
  
                childSnapshot.ref
                  .update(data)
                  .then(() => {
                    console.log("Data updated successfully");
                  })
                  .catch((error) => {
                    console.error("Error updating data: ", error);
                  });
              }
            });
          });
  
        button.classList.remove("active");
        button.classList.add("pending");
        messageDiv.textContent = "PENDENTE!";
      } else if (answer.toUpperCase() === "DESMARCAR") {
        ref
          .orderByChild("uid")
          .equalTo(uid)
          .once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              if (data) {
                const etapaIndex = data.etapas.findIndex(
                  (d) => d.tipo === etapaTipo && d.etapa == currentEtapaNum
                );
  
                if (etapaIndex !== -1) {
                  data.etapas.splice(etapaIndex, 1);
                }
  
                childSnapshot.ref
                  .update(data)
                  .then(() => {
                    console.log("Data updated successfully");
                  })
                  .catch((error) => {
                    console.error("Error updating data: ", error);
                  });
              }
            });
          });
  
        button.classList.remove("active");
        button.classList.remove("pending");
        messageDiv.textContent = "";
      }
    }
  }
  
  function chooseFile(inputId) {
    document.getElementById(inputId).click();
  }
  
  function handleFileUpload(inputId, linkId) {
    let fileInput = document.getElementById(inputId);
    let file = fileInput.files[0]; // Obtém o arquivo do input
  
    // Verifica se um arquivo foi selecionado
    if (file) {
      let fileName = file.name; // Obtém o nome do arquivo
  
      let reader = new FileReader();
      reader.onload = function (event) {
        const opcaoNum = document
          .getElementById(inputId)
          .getAttribute("data-opcao");
        const etapaTipo = document
          .getElementById(inputId)
          .getAttribute("data-etapa-tipo");
        const opcaoTipo = getOpcaoTipo(opcaoNum);
        const bs64File = event.target.result.split(",")[1];
        ref
          .orderByChild("uid")
          .equalTo(uid)
          .once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              if (data) {
                if (data.etapas && data.etapas.length > 0) {
                  const etapaIndex = data.etapas.findIndex(
                    (d) =>
                      d.tipo === Number(etapaTipo) && d.etapa == currentEtapaNum
                  );
                  if (etapaIndex !== -1) {
                    if (!data.etapas[etapaIndex].files) {
                      data.etapas[etapaIndex].files = [];
                    }
                    const fileIndex = data.etapas[etapaIndex].files.findIndex(
                      (file) => file.opcaoTipo === opcaoTipo
                    );
                    if (fileIndex !== -1) {
                      data.etapas[etapaIndex].files[fileIndex] = {
                        opcaoTipo: opcaoTipo,
                        arquivoNome: fileName,
                        base64Arquivo: bs64File,
                      };
                    } else {
                      data.etapas[etapaIndex].files.push({
                        opcaoTipo: opcaoTipo,
                        arquivoNome: fileName,
                        base64Arquivo: bs64File,
                      });
                    }
                  }
                }
  
                childSnapshot.ref
                  .update(data)
                  .then(() => {
                    console.log("Data updated successfully");
                  })
                  .catch((error) => {
                    console.error("Error updating data: ", error);
                  });
              }
            });
          });
      };
  
      reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
      // Encontra o link correspondente ao linkId
      let link = document.getElementById(linkId);
  
      link.textContent = fileName; // Define o texto do link como o nome do arquivo
      link.href = URL.createObjectURL(file); // Define o URL do link como um objeto URL do arquivo
      link.download = fileName; // Adiciona o atributo 'download' ao link para permitir o download
      link.style.display = "inline"; // Exibe o link
    } else {
      // Se nenhum arquivo for selecionado, limpa o texto do link e oculta o link
      let link = document.getElementById(linkId);
      link.textContent = "";
      link.href = "";
      link.download = "";
      link.style.display = "none";
    }
  }
  
  document
    .getElementById("opcao1_1_label")
    .addEventListener("click", function () {
      let fileName = localStorage.getItem("opcao1_1_input");
      if (fileName) {
        let fileBlob = localStorage.getItem("opcao1_1_input_blob");
        let blob = new Blob([fileBlob], {
          type: "application/octet-stream",
        });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  
  // Event listener para quando um arquivo é selecionado
  document.querySelectorAll('input[type="file"]').forEach((inputFile) => {
    inputFile.addEventListener("change", function (event) {
      let file = event.target.files[0]; // Obtém o arquivo selecionado
      let inputId = event.target.getAttribute("id"); // Obtém o ID do input
  
      // Cria um objeto FileReader para ler o conteúdo do arquivo
      let reader = new FileReader();
  
      // Evento disparado quando a leitura do arquivo é concluída
      reader.onload = function (event) {
        // Armazena o conteúdo do arquivo no localStorage
        localStorage.setItem(inputId + "_blob", event.target.result);
      };
  
      // Inicia a leitura do arquivo como um Blob
      reader.readAsDataURL(file);
    });
  });
  
  // Adiciona um evento de clique aos elementos de nome de arquivo
  document.querySelectorAll(".file-name").forEach((fileName) => {
    fileName.addEventListener("click", function (event) {
      event.preventDefault(); // Evita o comportamento padrão do clique
  
      let inputId = this.getAttribute("id").replace("_file_name", "_input"); // Obtém o ID do input correspondente ao nome do arquivo
      let fileBlob = localStorage.getItem(inputId + "_blob"); // Obtém o Blob do arquivo do localStorage
      let fileName = this.textContent; // Obtém o nome do arquivo
  
      if (fileBlob) {
        // Cria um objeto Blob a partir dos dados armazenados
        let blob = dataURItoBlob(fileBlob);
  
        // Cria um URL do objeto Blob
        let url = window.URL.createObjectURL(blob);
  
        // Cria um elemento de âncora
        let a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Define o atributo 'download' com o nome do arquivo
        a.click(); // Aciona o clique no elemento de âncora
      }
    });
  });
  
  // Função para converter uma string de dados URI em Blob
  function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  
  function toggleOption(option) {
    if (option.checked) {
      localStorage.setItem(option.id, "selected");
    } else {
      localStorage.removeItem(option.id);
    }
  }
  
  // Função para carregar arquivos anexados ao recarregar a página
  function loadAttachedFiles() {
    let fileInputs = document.querySelectorAll(".file-input");
    fileInputs.forEach(function (input) {
      let fileId = input.id;
      const sel = `${fileId.replace("_input", "")}_file_name`;
      let fileLink = document.getElementById(sel);
      const etapaTipo = fileLink.getAttribute("data-etapa-tipo");
      const opcaoTipo = getOpcaoTipo(Number(fileLink.getAttribute("data-opcao")));
      ref
        .orderByChild("uid")
        .equalTo(uid)
        .once("value", function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            const data = childSnapshot.val();
            if (data) {
              const etapaIndex = data.etapas.findIndex(
                (d) => d.tipo === Number(etapaTipo) && d.etapa == currentEtapaNum
              );
              if (etapaIndex !== -1) {
                const fileIndex = data.etapas[etapaIndex].files.findIndex(
                  (d) =>
                    d.opcaoTipo === opcaoTipo
                );
                if (fileIndex !== -1) {
                  fileLink.innerText =
                    data.etapas[etapaIndex].files[fileIndex].arquivoNome;
                  fileLink.style.display = "inline";
                }
              }
            }
          });
        });
    });
  }
  
  window.onload = function () {
    ref
      .orderByChild("uid")
      .equalTo(uid)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const data = childSnapshot.val();
          if (data) {
            document.getElementById("company-name").innerText =
              data.empresa.toUpperCase();
            document.getElementById("company-type").innerText =
              data.tipo.toUpperCase();
            document.getElementById("company-state").innerText =
              data.estado.toUpperCase();
          }
        });
      });
  
    let buttons = document.querySelectorAll(".neumorphic");
    let submenuBotao1 = document.querySelector("#submenu_botao1");
    let submenuBotao5 = document.querySelector("#submenu_botao5");
    let submenuBotao6 = document.querySelector("#submenu_botao6"); // Adiciona o submenu do botão 6
    let submenuBotao10 = document.querySelector("#submenu_botao10"); // Adiciona o submenu do botão 10
  
    // Adiciona um event listener a todos os botões
    buttons.forEach((button, index) => {
      button.addEventListener("click", function (event) {
        event.stopPropagation(); // Impede a propagação do evento para o documento
        validateStep(button);
        if (button === buttons[0]) {
          toggleSubmenu(button, submenuBotao1); // Passa o submenu do botão 1 como argumento para a função
        } else if (button === buttons[4]) {
          toggleSubmenu(button, submenuBotao5); // Passa o submenu do botão 5 como argumento para a função
        } else if (button === buttons[5]) {
          // Verifica se o botão clicado é o botão 6
          toggleSubmenu(button, submenuBotao6); // Passa o submenu do botão 6 como argumento para a função
        } else if (index === 9) {
          // Passa o submenu do botão 9 como argumento para a função
          toggleSubmenu(button, submenuBotao10); // Passa o submenu do novo botão como argumento para a função
        }
        // Carregar arquivos anexados
        loadAttachedFiles();
      });
  
      ref
        .orderByChild("uid")
        .equalTo(uid)
        .once("value", function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            const data = childSnapshot.val();
            if (data.etapas) {
              for (let i = 0; i < data.etapas.length; i++) {
                const etapaNum = data.etapas[i].etapa;
                if (
                  button.querySelector("span").innerHTML == data.etapas[i].nome &&
                  etapaNum == currentEtapaNum
                ) {
                  if (data.etapas[i].estado == "pending") {
                    button.classList.add("pending");
                    button.querySelector(".message").textContent = "PENDENTE!";
                  } else if (data.etapas[i].estado == "finished") {
                    button.classList.add("active");
                    button.querySelector(".message").textContent = "CONCLUÍDO!";
                  }
                }
              }
            }
          });
        });
    });
  };
  
  function toggleSubmenu(button, submenu) {
    let isVisible = submenu.style.display === "block";
    if (isVisible && submenu.parentNode === button) {
      submenu.style.display = "none";
    } else {
      submenu.style.display = "block";
      let submenuWidth = submenu.offsetWidth;
      let buttonRect = button.getBoundingClientRect();
      let buttonRightEdge = buttonRect.right;
      let windowWidth = window.innerWidth;
      let submenuLeft;
  
      // Calcula a largura disponível à direita do botão
      let availableWidth = windowWidth - buttonRightEdge;
  
      // Verifica se o submenu cabe à direita do botão
      if (availableWidth >= submenuWidth) {
        submenuLeft = buttonRightEdge; // Posição à direita do botão
      } else {
        // Se não couber à direita, alinha o canto direito do submenu com o canto direito do botão
        submenuLeft = windowWidth - submenuWidth;
      }
  
      submenu.style.top = buttonRect.top + button.offsetHeight + "px";
      submenu.style.left = submenuLeft + "px";
      submenu.parentNode.style.position = "relative"; // Atribui posição relativa ao pai do submenu
    }
  }
  
  // Adiciona um event listener para capturar cliques fora do submenu e fechá-lo
  document.addEventListener("click", function (event) {
    let submenuBotao1 = document.querySelector("#submenu_botao1");
    let submenuBotao5 = document.querySelector("#submenu_botao5");
    let submenuBotao6 = document.querySelector("#submenu_botao6");
    let submenuBotao10 = document.querySelector("#submenu_botao10");
  
    // Verifica se o clique ocorreu fora do submenu e de seus botões relacionados
    if (
      !submenuBotao1.contains(event.target) &&
      !submenuBotao5.contains(event.target) &&
      !submenuBotao6.contains(event.target) &&
      !submenuBotao10.contains(event.target)
    ) {
      submenuBotao1.style.display = "none"; // Oculta o submenu do botão 1
      submenuBotao5.style.display = "none"; // Oculta o submenu do botão 5
      submenuBotao6.style.display = "none"; // Oculta o submenu do botão 6
      submenuBotao10.style.display = "none"; // Oculta o submenu do botão 10
    }
  });
  
  const etapas = {
    "DOCUMENTOS PESSOAIS DO SÓCIO": 1,
    "CERTIFICADO DIGITAL DO SÓCIO": 2,
    "CONTRATAÇÃO DO CONTADOR": 3,
    "CONTRATAÇÃO DE SALA": 4,
    "E-CNPJ A1 ": 5,
    "ALTERAR CONTA DE ENERGIA PARA NOME DA EMPRESA": 6,
    "SOLICITAR INTERNET/TELEFONE": 7,
    "CONTRATAÇÃO DE ARMAZÉM LOGÍSTICO": 8,
    "COMPRA DE MÓVEIS E ELETRÔNICOS": 9,
    "ADEQUAÇÃO VISUAL DA SALA": 10,
    "CONTRATAÇÃO DE HOSPEDAGEM E DOMÍNIO": 11,
    "CRIAÇÃO DE EMAILS": 12,
    "CRIAÇÃO DE REDE SOCIAIS": 13,
    "ALUGUEL ENDERECO FILIAL": 14,
    "CONTRATO SOCIAL FILIAL": 15,
    "CONTRATO MAINO": 16,
    "CONTRATO COM A PROSEFTUR": 17,
    "CONTRATO COM A TCX": 18,
  };
  
  const opcao = {
    1: "COPIA DO CPF",
    2: "COPIA DO RG",
    3: "CÓPIA DO IRPF",
    4: "COMPROVANTE DE ENDEREÇO",
    5: "CERTIFICADO A1",
  };
  
  function getEtapaTipo(x) {
    return etapas[x];
  }
  
  function getOpcaoTipo(x) {
    return opcao[x];
  }