We are creating svg icons for scientific applications.

The icons are 1000x1000 by default (viewBox="0 0 1000 1000").

You need to create new icons and take care they match current design. When receiving a request check that it is not a mistake and that a similar icon already exists !

For each icon that is requested create a new PR. Only commit the SVG.

## Workflow

1. **Check for duplicates**: Before creating any icon, search `src/` for similar existing icons (by name and by visual concept). If a match exists, tell the user instead of creating a duplicate.
2. **Create the SVG** in the appropriate `src/<category>/` directory.
3. **Build**: Run `npm run build` and verify it succeeds. Check the optimized output in `svg/` to make sure nothing was lost.
4. **Commit only the SVG** (the source file in `src/`). Do not commit build artifacts.
5. **Create a PR** on a dedicated branch.

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
- Standard bond length for carbon chains is ~250 units with 120° angles between consecutive bonds and stroke-width 36

### Magnifier / search icons

When creating a magnifier (search) icon, **always copy the exact magnifier geometry** from an existing reference icon. Do not simplify or approximate the coordinates.

- Reference magnifier: `src/cheminfo/search-sdf.svg` (outer ring + handle)
- Reference inner ring: `src/bio/search-dna.svg` (double-ring magnifier)
- Outer ring: stroke-width `46.91`, centered at ~(419, 349), radius ~319
- Inner ring: stroke-width `21.586`, radius ~262
- Handle: stroke-width `46.908`, polyline from lens to bottom-right with rounded cap
- Only replace the content inside the lens (text, symbols, etc.)

### NMR spectra

- 1H-like spectra: continuous baseline with peaks (triangular shapes of varying heights), include multiplet features like doublets
- 13C-like spectra: a horizontal baseline with separate vertical lines rising from it
- Vertical lines for 13C should have the same stroke-width as the baseline
