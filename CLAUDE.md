We are creating svg icons for scientific applications.

The icons are 1000x1000 by default (viewBox="0 0 1000 1000").

You need to create new icons and take care they match current design.

When you create a new icon you need to render it as an image to evaluate the quality and then improve the SVG. Use `rsvg-convert` to render to PNG.

For each icon that is requested create a new PR. Only commit the SVG and in the pr provide a rendered image of the icon.

## Project structure

- Source SVGs go in `src/<category>/` (e.g. `src/nmr/prediction.svg`)
- Run `npm run build` to generate optimized SVGs in `svg/` and React components

## Design guidelines

- Use `fill="currentColor" stroke="currentColor"` so icons adapt to context
- Common SVG attributes: `stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="22.926"`
- Keep stroke widths consistent within an icon. Prefer thin lines (stroke-width 20-28) for a clean look
- Ensure all elements stay within the 0-1000 viewBox (account for stroke width)
- Labels and graphic elements must never overlap. Distribute elements evenly within the available space so that spacing between all elements (and between elements and the icon boundary) is visually balanced

### Molecule representation

- Use a hexagon for benzene rings with a thin stroke (e.g. stroke-width 24)
- Prefer an aromatic circle inside the hexagon over Kekulé double bonds
- The aromatic circle should have the same stroke-width as the hexagon
- Add substituent bonds extending from vertices to make it look more molecular

### NMR spectra

- 1H-like spectra: continuous baseline with peaks (triangular shapes of varying heights), include multiplet features like doublets
- 13C-like spectra: a horizontal baseline with separate vertical lines rising from it
- Vertical lines for 13C should have the same stroke-width as the baseline
