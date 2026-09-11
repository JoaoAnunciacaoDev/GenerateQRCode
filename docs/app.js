"use strict";
const $ = (selector) => document.querySelector(selector);
const form = $("#qr-form");
const content = $("#content");
const nameInput = $("#name");
const canvas = $("#qr-canvas");
const download = $("#download");
const empty = $("#empty");
const status = $("#status");
const size = $("#size");
const foreground = $("#foreground");
const background = $("#background");
let generated = false;

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

function luminance(hex) {
  const rgb = hex.match(/[a-f\d]{2}/gi).map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function generate(announce = true) {
  const value = content.value.trim();
  if (!value) {
    generated = false;
    resetPreview();
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
    const pixels = Number(size.value);
    const scale = Math.floor(pixels / (count + quietZone * 2));
    const offset = Math.floor((pixels - count * scale) / 2);
    canvas.width = canvas.height = pixels;
    const context = canvas.getContext("2d");
    context.fillStyle = background.value;
    context.fillRect(0, 0, pixels, pixels);
    context.fillStyle = foreground.value;
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          context.fillRect(offset + col * scale, offset + row * scale, scale, scale);
        }
      }
    }
    download.href = canvas.toDataURL("image/png");
    updateFilename();
    canvas.hidden = false;
    download.hidden = false;
    empty.hidden = true;
    generated = true;
    status.className = "";
    if (announce) status.textContent = `QR Code pronto! PNG de ${pixels} × ${pixels} px.`;
  } catch (error) {
    resetPreview();
    status.className = "error";
    status.textContent = typeof qrcode === "undefined"
      ? "Não foi possível carregar o gerador. Recarregue a página."
      : "Não foi possível gerar o código. Tente um link ou texto mais curto.";
  }
}

function updateCustomization() {
  const dark = luminance(foreground.value);
  const light = luminance(background.value);
  $("#contrast-warning").hidden = light > dark && (light + 0.05) / (dark + 0.05) >= 4.5;
  if (generated) generate(false);
}

content.addEventListener("input", () => { generated = false; resetPreview(); });
nameInput.addEventListener("input", updateFilename);
size.addEventListener("input", updateCustomization);
// Apply native color selections on commit, without hiding the preview or announcing status.
[foreground, background].forEach((input) => input.addEventListener("change", updateCustomization));
form.addEventListener("submit", (event) => { event.preventDefault(); generate(); });
