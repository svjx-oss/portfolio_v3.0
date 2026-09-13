function channel(value: number) {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(foreground: string, background: string) {
  const colors = [foreground, background].map((hex) => {
    const value = parseInt(hex.slice(1), 16);
    return [value >> 16 & 255, value >> 8 & 255, value & 255].map(channel);
  });
  const luminance = colors.map((color) =>
    0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]
  );
  return (Math.max(...luminance) + 0.05) /
    (Math.min(...luminance) + 0.05);
}
