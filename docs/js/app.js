import { hasReadableContrast } from "./contrast.js";
import { elements } from "./dom.js";
import { createPngFilename } from "./filename.js";
import { drawQrCode } from "./qr-generator.js";

let hasGeneratedCode = false;

function clearStatus() {
  elements.status.textContent = "";
  elements.status.className = "";
}

function resetPreview() {
  elements.canvas.hidden = true;
  elements.download.hidden = true;
  elements.download.removeAttribute("href");
  elements.empty.hidden = false;
  clearStatus();
}

function updateFilename() {
  elements.download.download = createPngFilename(elements.nameInput.value);
}

function generate(announce = true) {
  const value = elements.content.value.trim();

  if (!value) {
    hasGeneratedCode = false;
    resetPreview();
    elements.status.textContent = "Digite um link ou texto para gerar o código.";
    elements.status.className = "error";
    elements.content.focus();
    return;
  }

  const pixels = Number(elements.size.value);

  try {
    elements.download.href = drawQrCode({
      value,
      pixels,
      foreground: elements.foreground.value,
      background: elements.background.value,
      canvas: elements.canvas,
    });
    updateFilename();
    elements.canvas.hidden = false;
    elements.download.hidden = false;
    elements.empty.hidden = true;
    hasGeneratedCode = true;
    elements.status.className = "";

    if (announce) {
      elements.status.textContent = `QR Code pronto! PNG de ${pixels} × ${pixels} px.`;
    }
  } catch (error) {
    resetPreview();
    elements.status.className = "error";
    elements.status.textContent = error.message === "QR_LIBRARY_UNAVAILABLE"
      ? "Não foi possível carregar o gerador. Recarregue a página."
      : "Não foi possível gerar o código. Tente um link ou texto mais curto.";
  }
}

function updateCustomization() {
  elements.contrastWarning.hidden = hasReadableContrast(
    elements.foreground.value,
    elements.background.value,
  );

  if (hasGeneratedCode) {
    generate(false);
  }
}

elements.content.addEventListener("input", () => {
  hasGeneratedCode = false;
  resetPreview();
});
elements.nameInput.addEventListener("input", updateFilename);
elements.size.addEventListener("input", updateCustomization);
[elements.foreground, elements.background].forEach((input) => {
  input.addEventListener("change", updateCustomization);
});
elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  generate();
});

updateFilename();
updateCustomization();
