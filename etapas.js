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

const types = ["cpf", "cnpj"];

const uid = localStorage.getItem("uid");
const code = localStorage.getItem("code");
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

    if (answer === "DESMARCAR") {
      for (let i = 0; i < types.length; i++) {
        ref
          .orderByChild(types[i])
          .equalTo(code)
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
      }

      button.classList.remove("active");
      button.classList.remove("pending");
      messageDiv.textContent = "";
      return;
    }

    const estado = answer == "SIM" ? "finished" : "pending";

    for (let i = 0; i < types.length; i++) {
      ref
        .orderByChild(types[i])
        .equalTo(code)
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
                    estado: estado,
                  };
                } else {
                  data.etapas.push({
                    tipo: etapaTipo,
                    nome: etapaName,
                    estado: estado,
                    etapa: currentEtapaNum,
                  });
                }
              } else {
                data.etapas = [
                  {
                    tipo: etapaTipo,
                    nome: etapaName,
                    estado: estado,
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

      if (estado == "finished") {
        button.classList.add("active");
        button.classList.remove("pending");
        messageDiv.textContent = "CONCLUÍDO!";
      } else {
        button.classList.remove("active");
        button.classList.add("pending");
        messageDiv.textContent = "PENDENTE!";
      }
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
      const fileBlob = event.target.result;

      for (let i = 0; i < types.length; i++) {
        ref
          .orderByChild(types[i])
          .equalTo(code)
          .once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              if (data) {
                if (!data.etapas || data.etapas.length == 0) {
                  data.etapas = [];
                  const etapaNome = Object.keys(etapas).find(
                    (key) => etapas[key] === Number(etapaTipo)
                  );
                  data.etapas.push({
                    tipo: Number(etapaTipo),
                    estado: "unconfirm",
                    nome: etapaNome,
                    etapa: currentEtapaNum,
                    files: [
                      {
                        opcaoTipo: opcaoTipo,
                        arquivoNome: fileName,
                        fileBlob: fileBlob,
                        uploadBy:
                          localStorage.getItem("email") ??
                          localStorage.getItem("uid"),
                        time: getFormatedDate(),
                      },
                    ],
                  });
                } else if (data.etapas && data.etapas.length > 0) {
                  const etapaIndex = data.etapas.findIndex(
                    (d) =>
                      d.tipo === Number(etapaTipo) && d.etapa == currentEtapaNum
                  );
                  if (etapaIndex == -1) {
                    const etapaNome = Object.keys(etapas).find(
                      (key) => etapas[key] === Number(etapaTipo)
                    );
                    data.etapas.push({
                      tipo: Number(etapaTipo),
                      estado: "unconfirm",
                      nome: etapaNome,
                      etapa: currentEtapaNum,
                      files: [
                        {
                          opcaoTipo: opcaoTipo,
                          arquivoNome: fileName,
                          fileBlob: fileBlob,
                          uploadBy:
                            localStorage.getItem("email") ??
                            localStorage.getItem("uid"),
                          time: getFormatedDate(),
                        },
                      ],
                    });
                  } else if (etapaIndex !== -1) {
                    if (!data.etapas[etapaIndex].files) {
                      data.etapas[etapaIndex].files = [];
                    }
                    !data.etapas[etapaIndex].files;
                    const fileIndex = data.etapas[etapaIndex].files.findIndex(
                      (file) => file.opcaoTipo === opcaoTipo
                    );
                    if (fileIndex !== -1) {
                      data.etapas[etapaIndex].files[fileIndex] = {
                        opcaoTipo: opcaoTipo,
                        arquivoNome: fileName,
                        fileBlob: fileBlob,
                        uploadBy:
                          localStorage.getItem("email") ??
                          localStorage.getItem("uid"),
                        time: getFormatedDate(),
                      };
                    } else {
                      data.etapas[etapaIndex].files.push({
                        opcaoTipo: opcaoTipo,
                        arquivoNome: fileName,
                        fileBlob: fileBlob,
                        uploadBy:
                          localStorage.getItem("email") ??
                          localStorage.getItem("uid"),
                        time: getFormatedDate(),
                      });
                    }
                  }
                }

                childSnapshot.ref
                  .update(data)
                  .then(() => {
                    // Encontra o link correspondente ao linkId
                    let link = document.getElementById(linkId);
                    const trashSel = link.id.replace("_file_name", "_trash");
                    let trashBtn = document.getElementById(trashSel);
                    link.textContent = fileName; // Define o texto do link como o nome do arquivo
                    link.href = URL.createObjectURL(file); // Define o URL do link como um objeto URL do arquivo
                    link.download = fileName; // Adiciona o atributo 'download' ao link para permitir o download
                    link.style.display = "inline"; // Exibe o link
                    trashBtn.style.display = "inline"; // Exibe o botacao
                    console.log("Data updated successfully");
                  })
                  .catch((error) => {
                    console.error("Error updating data: ", error);
                  });
              }
            });
          });
      }
    };

    reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
  } else {
    // Se nenhum arquivo for selecionado, limpa o texto do link e oculta o link
    let link = document.getElementById(linkId);
    link.textContent = "";
    link.href = "";
    link.download = "";
    link.style.display = "none";
  }
}

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

    let sel = this.getAttribute("id"); // Obtém o ID do input correspondente ao nome do arquivo
    let span = document.getElementById(sel);

    for (let i = 0; i < types.length; i++) {
      ref
        .orderByChild(types[i])
        .equalTo(code)
        .once("value", function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            const data = childSnapshot.val();
            if (data) {
              const etapaTipo = span.getAttribute("data-etapa-tipo");
              const etapaIndex = data.etapas.findIndex(
                (d) =>
                  d.tipo === Number(etapaTipo) && d.etapa == currentEtapaNum
              );
              if (etapaIndex !== -1) {
                let files = data.etapas[etapaIndex].files;
                if (files) {
                  const opcaoTipo = getOpcaoTipo(
                    Number(span.getAttribute("data-opcao"))
                  );
                  const fileIndex = files.findIndex(
                    (d) => d.opcaoTipo === opcaoTipo
                  );
                  if (fileIndex !== -1) {
                    let arquivoNome =
                      data.etapas[etapaIndex].files[fileIndex].arquivoNome;
                    let fileBlob =
                      data.etapas[etapaIndex].files[fileIndex].fileBlob;
                    // Cria um objeto Blob a partir dos dados armazenados
                    let blob = dataURItoBlob(fileBlob);

                    // Cria um URL do objeto Blob
                    let url = window.URL.createObjectURL(blob);

                    // Cria um elemento de âncora
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = arquivoNome; // Define o atributo 'download' com o nome do arquivo
                    a.click(); // Aciona o clique no elemento de âncora
                  }
                }
              }
            }
          });
        });
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
    const fileSel = fileId.replace("_input", "_file_name");
    const trashSel = fileId.replace("_input", "_trash");
    let fileLink = document.getElementById(fileSel);
    let trashBtn = document.getElementById(trashSel);

    for (let i = 0; i < types.length; i++) {
      ref
        .orderByChild(types[i])
        .equalTo(code)
        .once("value", function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            const data = childSnapshot.val();
            if (data) {
              const etapaTipo = fileLink.getAttribute("data-etapa-tipo");
              const etapaIndex = data.etapas.findIndex(
                (d) =>
                  d.tipo === Number(etapaTipo) && d.etapa == currentEtapaNum
              );
              if (etapaIndex !== -1) {
                let files = data.etapas[etapaIndex].files;
                if (files) {
                  const opcaoTipo = getOpcaoTipo(
                    Number(fileLink.getAttribute("data-opcao"))
                  );
                  const fileIndex = files.findIndex(
                    (d) => d.opcaoTipo === opcaoTipo
                  );
                  if (fileIndex !== -1) {
                    fileLink.innerText =
                      data.etapas[etapaIndex].files[fileIndex].arquivoNome;
                    try {
                      fileLink.style.display = "inline";
                      trashBtn.style.display = "inline";
                    } catch (_) {}
                  }
                }
              }
            }
          });
        });
    }
  });
}

window.onload = function () {
  if (!uid) {
    window.location.href = "/";
  }

  for (let i = 0; i < types.length; i++) {
    ref
      .orderByChild(types[i])
      .equalTo(code)
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
  }

  let buttons = document.querySelectorAll(".neumorphic");
  let submenuBotao0 = document.querySelector("#submenu_botao0");
  let submenuBotao1 = document.querySelector("#submenu_botao1");
  let submenuBotao2 = document.querySelector("#submenu_botao2");
  let submenuBotao3 = document.querySelector("#submenu_botao3");
  let submenuBotao4 = document.querySelector("#submenu_botao4");
  let submenuBotao5 = document.querySelector("#submenu_botao5");
  let submenuBotao6 = document.querySelector("#submenu_botao6");
  let submenuBotao7 = document.querySelector("#submenu_botao7");
  let submenuBotao8 = document.querySelector("#submenu_botao8");
  let submenuBotao9 = document.querySelector("#submenu_botao9");
  let submenuBotao10 = document.querySelector("#submenu_botao10");
  let submenuBotao11 = document.querySelector("#submenu_botao11");
  let submenuBotao12 = document.querySelector("#submenu_botao12");

  // Adiciona um event listener a todos os botões
  buttons.forEach((button, index) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation(); // Impede a propagação do evento para o documento
      validateStep(button);
      if (button === buttons[0]) {
        toggleSubmenu(button, submenuBotao0); // Passa o submenu do botão 1 como argumento para a função
      } else if (button === buttons[1]) {
        toggleSubmenu(button, submenuBotao1); // Passa o submenu do botão 5 como argumento para a função
      } else if (button === buttons[2]) {
        // Verifica se o botão clicado é o botão 6
        toggleSubmenu(button, submenuBotao2); // Passa o submenu do botão 6 como argumento para a função
      } else if (button === buttons[3]) {
        toggleSubmenu(button, submenuBotao3); // Passa o submenu do botão 1 como argumento para a função
      } else if (button === buttons[4]) {
        toggleSubmenu(button, submenuBotao4); // Passa o submenu do botão 5 como argumento para a função
      } else if (button === buttons[5]) {
        // Verifica se o botão clicado é o botão 6
        toggleSubmenu(button, submenuBotao5); // Passa o submenu do botão 6 como argumento para a função
      } else if (button === buttons[6]) {
        toggleSubmenu(button, submenuBotao6); // Passa o submenu do botão 1 como argumento para a função
      } else if (button === buttons[7]) {
        toggleSubmenu(button, submenuBotao7); // Passa o submenu do botão 5 como argumento para a função
      } else if (button === buttons[8]) {
        // Verifica se o botão clicado é o botão 6
        toggleSubmenu(button, submenuBotao8); // Passa o submenu do botão 6 como argumento para a função
      } else if (button === buttons[9]) {
        toggleSubmenu(button, submenuBotao9); // Passa o submenu do botão 1 como argumento para a função
      } else if (button === buttons[10]) {
        toggleSubmenu(button, submenuBotao10); // Passa o submenu do botão 5 como argumento para a função
      } else if (button === buttons[11]) {
        // Verifica se o botão clicado é o botão 6
        toggleSubmenu(button, submenuBotao11); // Passa o submenu do botão 6 como argumento para a função
      } else if (button === buttons[12]) {
        toggleSubmenu(button, submenuBotao12); // Passa o submenu do botão 1 como argumento para a função
      } else if (button === buttons[13]) {
        toggleSubmenu(button, submenuBotao13); // Passa o submenu do botão 5 como argumento para a função
      }
      // Carregar arquivos anexados
      loadAttachedFiles();
    });

    for (let i = 0; i < types.length; i++) {
      ref
        .orderByChild(types[i])
        .equalTo(code)
        .once("value", function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            const data = childSnapshot.val();
            if (data.etapas) {
              for (let i = 0; i < data.etapas.length; i++) {
                const etapaNum = data.etapas[i].etapa;
                if (
                  button.querySelector("span").innerHTML ==
                    data.etapas[i].nome &&
                  etapaNum == currentEtapaNum
                ) {
                  if (data.etapas[i].estado !== "unconfirm") {
                    if (data.etapas[i].estado == "pending") {
                      button.classList.add("pending");
                      button.querySelector(".message").textContent =
                        "PENDENTE!";
                    } else if (data.etapas[i].estado == "finished") {
                      button.classList.add("active");
                      button.querySelector(".message").textContent =
                        "CONCLUÍDO!";
                    }
                  }
                }
              }
            }
          });
        });
    }
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

function removeArquivo(sel) {
  let span = document.getElementById(sel);
  let resp = confirm("Tem certeza de que deseja excluir o arquivo?");
  if (resp == true) {
    for (let i = 0; i < types.length; i++) {
      ref
        .orderByChild(types[i])
        .equalTo(code)
        .once("value", function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            const data = childSnapshot.val();
            if (data) {
              const etapaTipo = span.getAttribute("data-etapa-tipo");
              const etapaIndex = data.etapas.findIndex(
                (d) =>
                  d.tipo === Number(etapaTipo) && d.etapa == currentEtapaNum
              );
              if (etapaIndex !== -1) {
                let files = data.etapas[etapaIndex].files;
                if (files && files.length > 0) {
                  const opcaoTipo = getOpcaoTipo(
                    Number(span.getAttribute("data-opcao"))
                  );
                  const fileIndex = files.findIndex(
                    (d) => d.opcaoTipo === opcaoTipo
                  );
                  if (fileIndex !== -1) {
                    data.etapas[etapaIndex].files.splice(fileIndex, 1);
                    childSnapshot.ref
                      .update(data)
                      .then(() => {
                        const trashSel = span.id.replace(
                          "_file_name",
                          "_trash"
                        );
                        let trashBtn = document.getElementById(trashSel);
                        span.style.display = "none";
                        trashBtn.style.display = "none";
                        alert("Arquivo excluído");
                        console.log("Data updated successfully");
                      })
                      .catch((error) => {
                        console.error("Error updating data: ", error);
                      });
                  }
                }
              }
            }
          });
        });
    }
  } else {
    alert("Operação cancelada");
  }
}
// Adiciona um event listener para capturar cliques fora do submenu e fechá-lo
document.addEventListener("click", function (event) {
  let submenuBotao0 = document.querySelector("#submenu_botao0");
  let submenuBotao1 = document.querySelector("#submenu_botao1");
  let submenuBotao2 = document.querySelector("#submenu_botao2");
  let submenuBotao3 = document.querySelector("#submenu_botao3");
  let submenuBotao4 = document.querySelector("#submenu_botao4");
  let submenuBotao5 = document.querySelector("#submenu_botao5");
  let submenuBotao6 = document.querySelector("#submenu_botao6");
  let submenuBotao7 = document.querySelector("#submenu_botao7");
  let submenuBotao8 = document.querySelector("#submenu_botao8");
  let submenuBotao9 = document.querySelector("#submenu_botao9");
  let submenuBotao10 = document.querySelector("#submenu_botao10");
  let submenuBotao11 = document.querySelector("#submenu_botao11");
  let submenuBotao12 = document.querySelector("#submenu_botao12");

  // Verifica se o clique ocorreu fora do submenu e de seus botões relacionados
  if (
    !submenuBotao0.contains(event.target) &&
    !submenuBotao1.contains(event.target) &&
    !submenuBotao2.contains(event.target) &&
    !submenuBotao3.contains(event.target) &&
    !submenuBotao4.contains(event.target) &&
    !submenuBotao5.contains(event.target) &&
    !submenuBotao6.contains(event.target) &&
    !submenuBotao7.contains(event.target) &&
    !submenuBotao8.contains(event.target) &&
    !submenuBotao9.contains(event.target) &&
    !submenuBotao10.contains(event.target) &&
    !submenuBotao11.contains(event.target) &&
    !submenuBotao12.contains(event.target)
  ) {
    submenuBotao0.style.display = "none"; // Oculta o submenu do botão 0
    submenuBotao1.style.display = "none"; // Oculta o submenu do botão 1
    submenuBotao2.style.display = "none"; // Oculta o submenu do botão 2
    submenuBotao3.style.display = "none"; // Oculta o submenu do botão 3
    submenuBotao4.style.display = "none"; // Oculta o submenu do botão 4
    submenuBotao5.style.display = "none"; // Oculta o submenu do botão 5
    submenuBotao6.style.display = "none"; // Oculta o submenu do botão 6
    submenuBotao7.style.display = "none"; // Oculta o submenu do botão 7
    submenuBotao8.style.display = "none"; // Oculta o submenu do botão 8
    submenuBotao9.style.display = "none"; // Oculta o submenu do botão 9
    submenuBotao10.style.display = "none"; // Oculta o submenu do botão 10
    submenuBotao11.style.display = "none"; // Oculta o submenu do botão 11
    submenuBotao12.style.display = "none"; // Oculta o submenu do botão 12
  }
});

const etapas = {
  "DOCUMENTOS PESSOAIS DO SÓCIO": 1,
  "CERTIFICADO DIGITAL DO SÓCIO": 2,
  "CONTRATAÇÃO DO CONTADOR": 3,
  "CONTRATAÇÃO DE SALA": 4,
  "E-CNPJ A1": 5,
  "ALTERAR CONTA DE ENERGIA PARA NOME DA EMPRESA": 6,
  "SOLICITAR INTERNET/TELEFONE": 7,
  "CONTRATAÇÃO DE ARMAZÉM LOGÍSTICO": 8,
  "COMPRA DE MÓVEIS E ELETRÔNICOS": 9,
  "ADEQUAÇÃO VISUAL DA SALA": 10,
  "CONTRATAÇÃO DE HOSPEDAGEM E DOMÍNIO": 11,
  "CRIAÇÃO DE EMAILS": 12,
  "CRIAÇÃO DE REDE SOCIAIS": 13,
  "DOCUMENTOS DA EMPRESA CONTRATO SOCIAL, CNPJ E IE": 14,
  "HABILITAÇÃO DE RADAR": 15,
  "CONTA GRÁFICA": 16,
  "CONTRATAÇÃO ADM": 17,
  "ABERTURA DE CONTA PJ BRADESCO, SANTANDER, ETC": 18,
  "CONTRATO COM EMPRESAS DE REPRESENTAÇÃO": 19,
  "CONTRATO DRA CLAUDIA": 20,
  "CONTRATO OPERADOR LOGÍSTICO": 21,
  "CONTRATO COM ARMADOR": 22,
  "CONTRATO COM SERASA": 23,
  "CONTRATO COM MAINO": 24,
  "CONTRATO COM A PROSEFTUR": 25,
  "CONTRATO COM TREECOMEX": 26,
};

const opcao = {
  1: "DOCUMENTOS PESSOAIS DO SÓCIO",
  2: "CERTIFICADO DIGITAL DO SÓCIO",
  3: "CONTRATAÇÃO DO CONTADOR",
  4: "CONTRATAÇÃO DE SALA",
  5: "E-CNPJ A1",
  6: "ALTERAR CONTA DE ENERGIA PARA NOME DA EMPRESA",
  7: "SOLICITAR INTERNET/TELEFONE",
  8: "CONTRATAÇÃO DE ARMAZÉM LOGÍSTICO",
  9: "COMPRA DE MÓVEIS E ELETRÔNICOS",
  10: "ADEQUAÇÃO VISUAL DA SALA",
  11: "CONTRATAÇÃO DE HOSPEDAGEM E DOMÍNIO",
  12: "CRIAÇÃO DE EMAILS",
  13: "CRIAÇÃO DE REDE SOCIAIS",
  14: "DOCUMENTOS DA EMPRESA CONTRATO SOCIAL, CNPJ E IE",
  15: "HABILITAÇÃO DE RADAR",
  16: "CONTA GRÁFICA",
  17: "CONTRATAÇÃO ADM",
  18: "ABERTURA DE CONTA PJ BRADESCO, SANTANDER, ETC",
  19: "CONTRATO COM EMPRESAS DE REPRESENTAÇÃO",
  20: "CONTRATO DRA CLAUDIA",
  21: "CONTRATO OPERADOR LOGÍSTICO",
  22: "CONTRATO COM ARMADOR",
  23: "CONTRATO COM SERASA",
  24: "CONTRATO COM MAINO",
  25: "CONTRATO COM A PROSEFTUR",
  26: "CONTRATO COM TREECOMEX",
};

function getEtapaTipo(x) {
  return etapas[x];
}

function getOpcaoTipo(x) {
  return opcao[x];
}

function getFormatedDate() {
  let date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const fmt = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
  return fmt;
}
