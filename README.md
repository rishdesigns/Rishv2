# Rishabh Saxena — Header Section

This folder contains a responsive, production-ready header section converted from a Figma design.

Files added
- index.html — main markup
- styles.css — responsive styles, dark grid background, animations
- script.js — infinite auto-scroll (requestAnimationFrame), lightbox, keyboard & touch support

 Notes
 - Images are referenced from the `Assets` folder (logo.svg, ui1.jpg, ui2.jpg, ...). Replace names if your assets differ.
 - Fonts: this project expects `Geist.woff2` / `Geist.woff` to be placed in the `Assets/` folder. If you don't have Geist, the styles will fall back to `Inter` and system sans-serif fonts.
 - To obtain Geist, add your licensed font files to `Assets/` or change `styles.css` to use an available font.
- Auto-scroll is disabled on very small screens (<=420px) to allow manual swipe.
- No external libraries used.

How to view
1. Place your assets in the `Assets/` folder next to these files.
2. Open `index.html` in your browser.

Customization
- Adjust colors in `styles.css :root` variables.
- Tweak scroll speed by editing `speed` in `script.js`.

Accessibility
- Lightbox supports keyboard navigation and ESC to close.
