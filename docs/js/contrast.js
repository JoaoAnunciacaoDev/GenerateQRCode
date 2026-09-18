function luminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((part) => {
    const value = Number.parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function hasReadableContrast(foreground, background) {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const ratio = (backgroundLuminance + 0.05) / (foregroundLuminance + 0.05);

  return backgroundLuminance > foregroundLuminance && ratio >= 4.5;
}
