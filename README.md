# cheminfo-font

Contains a list of symbol used in cheminfo.

## Add new fonts

Just create new files in the `src` directory. They must have a 1000x1000 size. The filename will become the icon name.  
Inkscape has a template for this: File => Templates => Fontforge Glyph

## Build the fonts

Run `npm run build`.  
The fonts will be generated in the `docs` directory along with a CSS and HTML files. Just open the file `docs/index.html` in your browser to see the result.
