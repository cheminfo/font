We are creating svg icons for scientific applications.

The icons are 1000x1000 by default (viewBox="0 0 1000 1000").

You need to create new icons and take care they match current design. When receiving a request check that it is not a mistake and that a similar icon already exists !

For each icon that is requested create a new PR. Only commit the SVG.

## Project structure

- Source SVGs go in `src/<category>/` (e.g. `src/nmr/prediction.svg`)
- Run `npm run build` to generate optimized SVGs in `svg/` and React components

## SVG coordinate system

SVG uses (0,0) at the **top-left** with y increasing **downward**. This is the opposite of standard math coordinates where y increases upward. When translating from a reference image or math diagram to SVG, vertical directions are flipped: "up" means decreasing y, "down" means increasing y. Arc sweep directions are also affected: sweep-flag=1 is visually clockwise in SVG but corresponds to counter-clockwise in standard math.

## Design guidelines

- Use `fill="currentColor" stroke="currentColor"` so icons adapt to context
- Common SVG attributes: `stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="22.926"`
- Keep stroke widths consistent within an icon. Prefer thin lines (stroke-width 20-28) for a clean look
- Ensure all elements stay within the 0-1000 viewBox (account for stroke width)
- **Fill the canvas**: icons should use as much of the 1000×1000 space as possible. Scale elements up so the content spans most of the viewBox, leaving only a small margin (~30-50 units) around the edges
- Labels and graphic elements must never overlap. Distribute elements evenly within the available space so that spacing between all elements (and between elements and the icon boundary) is visually balanced

### Molecule representation

- Use a hexagon for benzene rings with a thin stroke
- Prefer an aromatic circle inside the hexagon over Kekulé double bonds
- The aromatic circle should have the same stroke-width as the hexagon
- Add substituent bonds extending from vertices to make it look more molecular
- Bond length and hexagon size should be scaled to fit the molecule within the 1000×1000 viewBox. The hexagon side length must always equal the chain bond length. Typical values are ~250 units for simple molecules or ~140 units when more elements need to fit
- C-C-C bond angles are always 120°
- Substituent bonds on a hexagon must go along the **radial direction** (from center through vertex, outward), making 120° with both adjacent edges. Never use edge prolongation (which gives 180° with one edge and 60° with the other)
- For a 30° zigzag chain (bonds at 30° from horizontal), use a **flat-side hexagon** (vertices at 30°, 90°, 150°, 210°, 270°, 330°) and attach the chain at the 30° vertex along its radial direction (121, -70)
- All molecule lines within an icon (hexagon edges, bonds, aromatic circle) should use the same stroke-width for consistency
- **Stroke-width scales with bond length**: use `stroke-width ≈ bond_length / 6`. Examples: bond 150 → stroke 26, bond 140 → stroke 24, bond 217 → stroke 36. Larger molecules get thicker lines so they look visually balanced

### Arrows

Arrows are filled shapes (`stroke="none"`) composed of a rectangular shaft and a triangular head. All single arrows must use these consistent dimensions:

- **Shaft width**: 50 units (x from 475 to 525, centered on x=500)
- **Head width**: 240 units (x from 380 to 620)
- **Head height**: 150 units (distance from wing baseline to tip)

Example downward arrow path: `M 475,290 L 475,570 L 380,570 L 500,720 L 620,570 L 525,570 L 525,290 Z` — the shaft runs from y=290 to y=570, and the head from y=570 to y=720.

The shaft length varies per icon to fill available space, but the head dimensions (width 240, height 150) must stay constant across all icons.

For **bidirectional arrows** (e.g. converter icon), use narrower arrows side by side: shaft width 40, head width 180, head height 130.

### Text labels

All chemical text labels (CCC, CCCC, .mol, .smi, .sdf) must use **font-size 280**, `font-family="sans-serif"`, `font-weight="bold"`, `text-anchor="middle"`, and `stroke="none"`.

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
