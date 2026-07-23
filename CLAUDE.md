# JTSdigitil

Static marketing site for JTSdigitil, a freelance web design/dev business run by Jack Strawbridge. Promotes an existing portfolio site and offers to build websites for other businesses.

## Stack
Plain HTML/CSS, no build step, no framework. Deployable as-is to Netlify, Vercel, or GitHub Pages.

## Files
- `index.html` — home page (hero, services, portfolio teaser, CTA)
- `pricing.html` — 3-tier pricing (Starter / Business / Custom)
- `contact.html` — contact form (Formspree) + direct email
- `styles.css` — shared styles for all pages

## To-do before launch
- Replace `[Placeholder]` text: portfolio case study + screenshot, pricing figures, location, contact email
- Replace `YOUR_FORM_ID` in contact.html with a real Formspree form ID (formspree.io, free tier)
- Add real portfolio screenshot image
- Update copyright email/domain if different from jtsdigitil.com

## Conventions
- Colors/spacing defined as CSS variables at top of styles.css — edit there to re-theme
- Keep pages single-file, no JS framework unless a real need comes up (e.g. animations)
- Mobile breakpoint at 768px
