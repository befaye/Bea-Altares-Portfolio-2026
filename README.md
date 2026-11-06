# Bea Altares Portfolio

A single-page, static portfolio for GitHub Pages. It uses plain HTML and CSS, relative asset paths, and no build step or external framework.

## Preview and deployment

Open `index.html` locally, or publish the repository's `main` branch from the repository root in GitHub Pages settings. The site includes `.nojekyll` so Pages does not run Jekyll.

After adding assets or links, test every destination and check the page at 375px wide. Hard-refresh after publishing to bypass GitHub Pages' asset cache; increment the stylesheet's `?v=` query when deploying a CSS change.

Images open in an accessible gallery; video thumbnails open a YouTube player only after a click. Keep video files on YouTube rather than committing the local MP4s: the current `group advocacy.mp4` is about 468 MB, exceeding GitHub's 100 MB per-file limit, and the local videos together are far above the site's 25 MB target. The local `assets/videos/` folder is ignored by Git and is not published with the site.

## Add your images

The site now has an `assets/images/` folder. JPG and PNG are fine to upload; WebP is recommended for smaller downloads. Keep images under 1600 px on the longest edge and aim for under 300 KB each. The image checklist and suggested filenames are in [`assets/images/README.md`](./assets/images/README.md).

## Content still needed

Remaining items:

- A 1200×630 Open Graph image. Add its `og:image` metadata after the image is saved.

Video, audio, Restaurant Branding, Social Media Promotional Content, NU Wizards Circle, and photography images are connected. All four NUWC post cards show their uploaded image(s); post 1 has two Facebook links. Contact links are set. The 2024 Portfolio links to Behance. The resume is saved at `assets/pdf/BeatrizFaye_Altares_Resume.pdf`. Keep the resume PDF under 1 MB and the complete published site under 25 MB.

Photography remains inside Design, not as a separate section. On desktop, Design is ordered as NU Wizards Circle on row 1, Social Media Promotional Content and Photography on row 2, then Restaurant Branding and the 2024 Portfolio on row 3. Work appears in this order: Design, Video & Animation, Audio.
