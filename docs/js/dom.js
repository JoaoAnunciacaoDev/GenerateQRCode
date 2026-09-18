export function getElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Elemento não encontrado: ${selector}`);
  }

  return element;
}

export const elements = {
  form: getElement("#qr-form"),
  content: getElement("#content"),
  nameInput: getElement("#name"),
  canvas: getElement("#qr-canvas"),
  download: getElement("#download"),
  empty: getElement("#empty"),
  status: getElement("#status"),
  size: getElement("#size"),
  foreground: getElement("#foreground"),
  background: getElement("#background"),
  contrastWarning: getElement("#contrast-warning"),
};
