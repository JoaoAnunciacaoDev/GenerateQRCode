export function drawQrCode({ value, pixels, foreground, background, canvas }) {
  if (typeof globalThis.qrcode !== "function") {
    throw new Error("QR_LIBRARY_UNAVAILABLE");
  }

  const qr = globalThis.qrcode(0, "M");
  qr.addData(value, "Byte");
  qr.make();

  const moduleCount = qr.getModuleCount();
  const quietZone = 4;
  const scale = Math.floor(pixels / (moduleCount + quietZone * 2));
  const offset = Math.floor((pixels - moduleCount * scale) / 2);

  canvas.width = pixels;
  canvas.height = pixels;

  const context = canvas.getContext("2d");
  context.fillStyle = background;
  context.fillRect(0, 0, pixels, pixels);
  context.fillStyle = foreground;

  for (let row = 0; row < moduleCount; row += 1) {
    for (let column = 0; column < moduleCount; column += 1) {
      if (qr.isDark(row, column)) {
        context.fillRect(offset + column * scale, offset + row * scale, scale, scale);
      }
    }
  }

  return canvas.toDataURL("image/png");
}
