We are creating svg icons for scientific applications.

The icons are 1000x1000 by default (viewBox="0 0 1000 1000").

You need to create new icons and take care they match current design. When receiving a request check that it is not a mistake and that a similar icon already exists !

For each icon that is requested create a new PR. Only commit the SVG.

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

- Use a hexagon for benzene rings with a thin stroke (e.g. stroke-width 24-28)
- Prefer an aromatic circle inside the hexagon over Kekulé double bonds
- The aromatic circle should have the same stroke-width as the hexagon
- Add substituent bonds extending from vertices to make it look more molecular
- Bond length and hexagon size should be scaled to fit the molecule within the 1000×1000 viewBox. The hexagon side length must always equal the chain bond length. Typical values are ~250 units for simple molecules or ~140 units when more elements need to fit
- C-C-C bond angles are always 120°
- Substituent bonds on a hexagon must go along the **radial direction** (from center through vertex, outward), making 120° with both adjacent edges. Never use edge prolongation (which gives 180° with one edge and 60° with the other)
- For a 30° zigzag chain (bonds at 30° from horizontal), use a **flat-side hexagon** (vertices at 30°, 90°, 150°, 210°, 270°, 330°) and attach the chain at the 30° vertex along its radial direction (121, -70)
- All molecule lines within an icon (hexagon edges, bonds, aromatic circle) should use the same stroke-width for consistency

### Mass spectra

All mass spectrum icons must use the exact same axis from `src/mass/impurities.svg`:

- Baseline: `M 42.643,722.441 L 932.372,722.441` with stroke-width 45.698
- Arrow upper: `M 894.811,683.405 L 946.433,722.441`
- Arrow lower: `M 946.433,722.441 L 894.811,761.664`
- m/z label: `<text x="716" y="953" text-anchor="middle" font-family="sans-serif" font-size="180" stroke="none">m/z</text>`
- Peaks start from baseline y=722 and use stroke-linecap="round" with stroke-width 30
- Text labels (e.g. charge states) go above peaks, never below the baseline (to avoid overlap with the m/z label)

### Magnifier icons

When creating magnifier/search icons, copy the exact lens and handle geometry from `src/cheminfo/search-sdf.svg`. Center text inside the lens at the geometric center of the outer ring (approximately x=419, y=349) using `text-anchor="middle" dominant-baseline="central"`.

### Preview workflow

After every icon change, always run `npm run build` and then open the preview page (`/tmp/exercise-icons-test.html` or `docs/index.html`) so the user can visually verify the result.

### NMR spectra

- 1H-like spectra: continuous baseline with peaks (triangular shapes of varying heights), include multiplet features like doublets
- 13C-like spectra: a horizontal baseline with separate vertical lines rising from it
- Vertical lines for 13C should have the same stroke-width as the baseline
