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

const database = firebase.database();
const ref = database.ref("cadastro-orion-global");
const filesRef = database.ref("files");

const types = ["cpf", "cnpj"];

let offsetX, offsetY;
const uid = localStorage.getItem("uid");
const code = localStorage.getItem("code");
const csn = Number(window.location.pathname.match(/[0-9]+/)[0]);

function handleFileUpload(identifier) {
  const submenu = document.querySelector("#submenu_botao");
  const fileInput = submenu.querySelector(".file-input");

  if (!fileInput.files || fileInput.files.length === 0) return;

  const file = fileInput.files[0];
  const fileName = file.name;
  const reader = new FileReader();

  reader.onload = function (event) {
    const fileBlob = event.target.result;
    const optionType = getOptionType(identifier);

    const updateData = {
      identifier: code,
      optionType: optionType,
      stageNumber: csn,
      fileName: fileName,
      fileBlob: fileBlob,
      uploadBy: localStorage.getItem("email") || localStorage.getItem("uid"),
      time: getFormattedDate(),
    };

    filesRef
      .push(updateData)
      .then(() => {
        loadSubmenuData(identifier);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  reader.readAsDataURL(file);
}

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

function showSubmenu(identifier) {
  const submenus = document.querySelectorAll(".submenu");
  if (submenus[0].style != "flex") {
    submenus[0].style.display = "flex";
  }

  loadSubmenuData(identifier);
}

// Função para carregar arquivos anexados ao recarregar a página
function loadSubmenuData(identifier) {
  const submenu = document.querySelector("#submenu_botao");
  const containerData = submenu.querySelector(".container-data");
  
  let trash = submenu.querySelector("#trash");
  let attachBtn = submenu.querySelector(".attach-file-button");
  let input = submenu.querySelector(".file-input");
  let fileName = submenu.querySelector(".file-name");
  
  let uploadTime = containerData.querySelector(".upload-date");
  let uploadBy = containerData.querySelector(".uploaded-by");
  let deletedBy = containerData.querySelector(".deleted-by");
  let deletionDate = containerData.querySelector(".deletion-date");

  trash.style.display = "none";
  fileName.innerText = "-";
  
  uploadTime.innerText = "-";
  uploadBy.innerText = "-";
  deletedBy.innerText = "-";
  deletionDate.innerText = "-";

  attachBtn.onclick = () => input.click();
  input.onchange = () => handleFileUpload(identifier);

  filesRef
    .orderByChild("identifier")
    .equalTo(code)
    .once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const file = childSnapshot.val();
        if (
          file.stageNumber === csn &&
          file.optionType === getOptionType(identifier)
        ) {
          fileName.innerText = file.fileName;
          if (file.state === "removed") {
            deletedBy.innerText = file.deletedBy;
            deletionDate.innerText = file.deletionDate;
            fileName.style.display = "flex";
          } else {
            trash.onclick = () => removeFile(identifier);
            fileName.addEventListener("click", () => {
              const a = document.createElement("a");
              a.href = URL.createObjectURL(dataURItoBlob(file.fileBlob));
              a.download = file.fileName;
              a.click();
            });
            fileName.innerText = file.fileName;
            uploadTime.innerText = file.time;
            uploadBy.innerText = file.uploadBy;
            fileName.style.display = "flex";
            uploadTime.style.display = "flex";
            uploadBy.style.display = "flex";
            trash.style.display = "flex";
          }
        }
      });
    });
}

function changeButtonColor(button) {
  types.forEach((type) => {
    ref
      .orderByChild(type)
      .equalTo(code)
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data && data.etapas) {
            const etapaIndex = data.etapas.findIndex(
              (d) => d.nome === button.innerText && d.etapa === csn
            );
            if (etapaIndex !== -1) {
              const files = data.etapas[etapaIndex].files;
              if (files) {
                const fileIndex = files.findIndex(
                  (d) =>
                    d.OPCAO_TIPO === button.innerText && d.ESTADO !== "removido"
                );
                if (fileIndex !== -1) {
                  button.style.boxShadow =
                    "-0.5rem -0.5rem 1rem hsl(183, 72%, 54%), 0.5rem 0.5rem 1rem hsl(0 0% 50% / 0.5)";
                } else {
                  button.style.boxShadow =
                    "-0.5rem -0.5rem 1rem hsl(0 0% 100% / 0.75), 0.5rem 0.5rem 1rem hsl(0 0% 50% / 0.5)";
                }
              }
            }
          }
        });
      });
  });
}

window.onload = function () {
  if (!uid) {
    window.location.href = "/";
    return;
  }

  const processID = localStorage.getItem("process-id");
  if (csn === 2 && !processID) {
    window.location.href = "/botoesetapas.html";
    return;
  } else if (csn === 2) {
    document.getElementById("current-process").innerText = "Processo:";
    document.getElementById("current-process-number").innerText = processID;
    document.querySelector(".current-process-container").style.display = "flex";
  }

  types.forEach((type) => {
    ref
      .orderByChild(type)
      .equalTo(code)
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data) {
            document.getElementById("company-name").innerText =
              data.empresa.toUpperCase();
            document.getElementById("company-type").innerText =
              data.tipo.toUpperCase();
            document.getElementById("company-state").innerText =
              data.estado.toUpperCase();

            if (csn === 1) {
              const creationDate = new Date(data.dataCriacao);
              const currentDate = new Date();
              const diff = currentDate - creationDate;
              const daysPassed = 45 - Math.floor(diff / (1000 * 60 * 60 * 24));
              const remainingDays = document.querySelector(
                ".data-restante-container"
              );

              remainingDays.querySelector(
                "#hint-text-remaining"
              ).innerText = `${daysPassed.toString()} dias`;
              remainingDays.querySelector("#rest-remainer").innerText =
                "para terminar esta etapa";
              remainingDays.style.display = "flex";
            }
          }
        });
      });
  });

  const buttons = document.querySelectorAll(".neumorphic");

  buttons.forEach((button, index) => {
    setInterval(() => {
      changeButtonColor(button);
    }, 1000);

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const submenuIndex = index + 1;
      showSubmenu(submenuIndex);
    });
  });
};

function removeFile(identifier) {
  const resp = confirm("Tem certeza de que deseja excluir o arquivo?");
  if (resp === true) {
    types.forEach((type) => {
      ref
        .orderByChild(type)
        .equalTo(code)
        .once("value", (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data && data.etapas) {
              const etapaIndex = data.etapas.findIndex(
                (d) => d.tipo === identifier && d.etapa === csn
              );
              if (etapaIndex !== -1) {
                const files = data.etapas[etapaIndex].files;
                if (files && files.length > 0) {
                  const fileIndex = files.findIndex(
                    (d) => d.OPCAO_TIPO === getOpcaoTipo(identifier)
                  );
                  if (fileIndex !== -1) {
                    data.etapas[etapaIndex].files[fileIndex] = {
                      ARQUIVO_NOME: files[fileIndex].ARQUIVO_NOME,
                      OPCAO_TIPO: files[fileIndex].OPCAO_TIPO,
                      ESTADO: "removido",
                      ARQUIVO_REMOVIDO_POR: localStorage.getItem("email"),
                      DATA_DA_REMOCAO: getFormatedDate(),
                    };
                    childSnapshot.ref
                      .update(data)
                      .then(() => {
                        loadSubmenuData(identifier);
                        alert("Arquivo excluído com sucesso!");
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }
                }
              }
            }
          });
        });
    });
  } else {
    alert("Operação cancelada!");
  }
}

let draggable = document.querySelector("#submenu_botao");

function drag(event) {
  draggable.style.left = event.clientX - offsetX + "px";
  draggable.style.top = event.clientY - offsetY + "px";
}

function stopDragging(event) {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDragging);
}

draggable.addEventListener("mousedown", function (event) {
  event.preventDefault();

  offsetX = event.clientX - draggable.getBoundingClientRect().left;
  offsetY = event.clientY - draggable.getBoundingClientRect().top;

  document.addEventListener("mousemove", drag);

  document.addEventListener("mouseup", stopDragging);
});

document.addEventListener("click", function (event) {
  const submenuBotao = document.querySelector("#submenu_botao");
  if (!submenuBotao.contains(event.target)) {
    submenuBotao.style.display = "none";
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

function getOptionType(x) {
  for (let key in etapas) {
    if (etapas[key] == x) {
      return key;
    }
  }

  return null;
}

function getFormattedDate() {
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

function routeTo(pathName) {
  window.location.href = pathName;
}
