"use strict";
const form = document.querySelector("#qr-form");
const content = document.querySelector("#content");
const nameInput = document.querySelector("#name");
const canvas = document.querySelector("#qr-canvas");
const download = document.querySelector("#download");
const empty = document.querySelector("#empty");
const status = document.querySelector("#status");

function resetPreview() {
  canvas.hidden = true;
  download.hidden = true;
  download.removeAttribute("href");
  empty.hidden = false;
  status.textContent = "";
  status.className = "";
}

function updateFilename() {
  const name = nameInput.value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  download.download = `${name || "qr-code"}.png`;
}

content.addEventListener("input", resetPreview);
nameInput.addEventListener("input", updateFilename);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  resetPreview();
  const value = content.value.trim();
  if (!value) {
    status.textContent = "Digite um link ou texto para gerar o código.";
    status.className = "error";
    content.focus();
    return;
  }
  try {
    const qr = qrcode(0, "M");
    qr.addData(value, "Byte");
    qr.make();
    const count = qr.getModuleCount();
    const quietZone = 4;
    const scale = Math.max(4, Math.ceil(1024 / (count + quietZone * 2)));
    canvas.width = canvas.height = (count + quietZone * 2) * scale;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000000";
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) context.fillRect((col + quietZone) * scale, (row + quietZone) * scale, scale, scale);
      }
    }
    download.href = canvas.toDataURL("image/png");
    updateFilename();
    canvas.hidden = false;
    download.hidden = false;
    empty.hidden = true;
    status.textContent = "QR Code pronto! Baixe a imagem e teste com a câmera do celular.";
  } catch (error) {
    status.className = "error";
    status.textContent = typeof qrcode === "undefined"
      ? "Não foi possível carregar o gerador. Recarregue a página."
      : "Não foi possível gerar o código. Tente um link ou texto mais curto.";
  }
});
