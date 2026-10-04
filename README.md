# Alen Abraham — Portfolio

A responsive, dark-themed student portfolio built with HTML, CSS, and vanilla JavaScript. It introduces Alen, presents the skills he is learning, and provides a place for future projects and contact details.

## Run locally

There is no build step or package installation. Open `index.html` in a browser, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

The page loads Tailwind CSS and Google Fonts from CDNs, so those styles and fonts need an internet connection. The portfolio's custom styling and interactions live in `styles.css` and `script.js`.

## Features

- Responsive layout for desktop, tablet, and mobile.
- Intro section with a 3D terminal-style panel and links to portfolio sections.
- Skills carousel with eased wheel scrolling, touch swipes, and Left/Right arrow-key controls when a skill is focused.
- Hover effects, scroll reveals, and support for reduced-motion preferences.
- Projects placeholder for work that will be added later.
- Email link to [alenabraham2008@gmail.com](mailto:alenabraham2008@gmail.com).

## Project files

- `index.html` — page content and section structure.
- `styles.css` — responsive layout, colors, and animations.
- `script.js` — carousel, pointer effects, scroll effects, and mobile navigation.

## Update the skills carousel

In `index.html`, add a button with the `skill-node` class inside `#skillsOrbit`. The carousel calculates card positions and looping from the number of skill buttons, so no rotation values need to be edited in JavaScript.

Each button should have an accessible `aria-label` and follow the existing structure for its count, icon, and skill name. Update the count labels so their numbers and descriptions stay in order. Existing `node-html`, `node-css`, `node-js`, and `node-c` classes also provide individual card colors; a new skill can use the default card style or receive its own class and styling in `styles.css`.

## Add projects

The Projects section currently explains that no projects have been published yet. Replace that placeholder in `index.html` with project entries as work becomes available. Include a short description, the technologies used, and links or screenshots when you have them.

## Personal details

Update the title, description, About text, email link, and footer in `index.html` when those details change. Visual design and responsive breakpoints can be adjusted in `styles.css`.
