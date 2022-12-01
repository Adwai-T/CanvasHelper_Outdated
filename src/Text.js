//--- Text
export function drawText(ctx, text, x, y, color, font, align) {
  if (color) ctx.fillStyle = color;
  if (font) ctx.font = font;
  if (align) ctx.textAlign = align;
  ctx.fillText(text, x, y);
}
