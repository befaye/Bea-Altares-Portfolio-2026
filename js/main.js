const mediaDialog = document.querySelector("#media-dialog");
const mediaStage = document.querySelector("#media-dialog-stage");
const mediaCaption = document.querySelector("#media-dialog-caption");
const mediaCount = document.querySelector("#media-dialog-count");
const mediaLinks = document.querySelector("#media-dialog-links");
const previousButton = document.querySelector("[data-gallery-previous]");
const nextButton = document.querySelector("[data-gallery-next]");
const closeButton = document.querySelector("[data-dialog-close]");
let currentGallery = [];
let currentImageIndex = -1;

const heroArt = document.querySelector(".hero-art");
if (heroArt && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const heroShape = heroArt.querySelector(".hero-art-shape");
  if (!heroShape) throw new Error("Hero portrait container is missing its animated circle.");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = 0;

  function easeHeroCircle() {
    currentX += (targetX - currentX) * 0.075;
    currentY += (targetY - currentY) * 0.075;
    if (Math.abs(targetX - currentX) < 0.1) currentX = targetX;
    if (Math.abs(targetY - currentY) < 0.1) currentY = targetY;

    heroArt.style.setProperty("--offset-x", `${currentX.toFixed(2)}px`);
    heroArt.style.setProperty("--offset-y", `${currentY.toFixed(2)}px`);

    if (currentX !== targetX || currentY !== targetY) {
      animationFrame = requestAnimationFrame(easeHeroCircle);
    } else {
      animationFrame = 0;
    }
  }

  function moveHeroCircle(event) {
    if (event.pointerType === "touch") return;
    const bounds = heroArt.getBoundingClientRect();
    const diameter = heroShape.getBoundingClientRect().width;
    const maxX = Math.max(0, (bounds.width - diameter) / 2);
    const maxY = Math.max(0, (bounds.height - diameter) / 2);
    targetX = Math.max(-maxX, Math.min(maxX, event.clientX - bounds.left - bounds.width / 2));
    targetY = Math.max(-maxY, Math.min(maxY, event.clientY - bounds.top - bounds.height / 2));
    if (!animationFrame) animationFrame = requestAnimationFrame(easeHeroCircle);
  }

  function centerHeroCircle() {
    targetX = 0;
    targetY = 0;
    if (!animationFrame) animationFrame = requestAnimationFrame(easeHeroCircle);
  }

  heroArt.addEventListener("pointermove", moveHeroCircle);
  heroArt.addEventListener("pointerleave", centerHeroCircle);
}

const heroName = document.querySelector(".hero-name");
const heroSelection = heroName?.querySelector(".hero-name-selection");
if (heroName && heroSelection) {
  let activeLetter = null;

  function selectHeroLetter(letter) {
    if (letter === activeLetter) return;
    activeLetter?.classList.remove("is-active");
    activeLetter = letter;
    if (!activeLetter) {
      heroSelection.classList.remove("is-visible");
      return;
    }

    activeLetter.classList.add("is-active");
    const nameBounds = heroName.getBoundingClientRect();
    const letterBounds = activeLetter.getBoundingClientRect();
    heroSelection.style.left = `${letterBounds.left - nameBounds.left - 4}px`;
    heroSelection.style.top = `${letterBounds.top - nameBounds.top - 3}px`;
    heroSelection.style.width = `${letterBounds.width + 8}px`;
    heroSelection.style.height = `${letterBounds.height + 6}px`;
    heroSelection.dataset.label = `${activeLetter.textContent} / ${Math.round(letterBounds.height)}px`;
    heroSelection.classList.add("is-visible");
  }

  heroName.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    selectHeroLetter(target?.closest(".hero-name-letter") ?? null);
  });

  heroName.addEventListener("pointerleave", () => selectHeroLetter(null));
  heroName.addEventListener("click", (event) => {
    const letter = event.target.closest(".hero-name-letter");
    if (!letter) return;
    letter.classList.remove("is-kicked");
    void letter.offsetWidth;
    letter.classList.add("is-kicked");
    letter.addEventListener("animationend", () => letter.classList.remove("is-kicked"), { once: true });
  });
}

function showImage(index) {
  currentImageIndex = (index + currentGallery.length) % currentGallery.length;
  const image = currentGallery[currentImageIndex];
  const enlargedImage = document.createElement("img");
  enlargedImage.src = image.src;
  enlargedImage.alt = image.alt;
  mediaStage.replaceChildren(enlargedImage);
  mediaCaption.textContent = image.alt;
  mediaCount.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
  previousButton.hidden = currentGallery.length < 2;
  nextButton.hidden = currentGallery.length < 2;
}

function openGallery(gallerySet) {
  currentGallery = Array.from(gallerySet.querySelectorAll("[data-gallery-items] img"), (image) => ({
    src: image.getAttribute("src"),
    alt: image.alt,
  }));
  if (currentGallery.length === 0) {
    throw new Error("Cannot open an empty image gallery.");
  }

  const links = Array.from(gallerySet.querySelectorAll("[data-gallery-links] a"), (source) => {
    const link = document.createElement("a");
    link.href = source.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = source.textContent;
    return link;
  });
  mediaLinks.replaceChildren(...links);
  mediaLinks.hidden = links.length === 0;
  showImage(0);
  mediaDialog.showModal();
  closeButton.focus();
}

function openVideo(videoId, title) {
  const player = document.createElement("iframe");
  player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&playsinline=1`;
  player.title = title;
  player.allow = "autoplay; encrypted-media; picture-in-picture";
  player.referrerPolicy = "strict-origin-when-cross-origin";
  player.allowFullscreen = true;
  mediaStage.replaceChildren(player);
  mediaCaption.textContent = title;
  mediaCount.textContent = "";
  mediaLinks.replaceChildren();
  mediaLinks.hidden = true;
  previousButton.hidden = true;
  nextButton.hidden = true;
  currentGallery = [];
  currentImageIndex = -1;
  mediaDialog.showModal();
  closeButton.focus();
}

function closeMediaDialog() {
  mediaStage.replaceChildren();
  mediaCaption.textContent = "";
  mediaCount.textContent = "";
  mediaLinks.replaceChildren();
  mediaLinks.hidden = true;
  previousButton.hidden = false;
  nextButton.hidden = false;
  currentGallery = [];
  currentImageIndex = -1;
}

document.addEventListener("click", (event) => {
  const videoTrigger = event.target.closest("[data-video-trigger]");
  if (videoTrigger) {
    openVideo(videoTrigger.dataset.videoId, videoTrigger.dataset.videoTitle);
    return;
  }

  const trigger = event.target.closest("[data-gallery-trigger]");
  if (!trigger) return;

  const gallerySet = trigger.closest("[data-gallery-set]");
  if (!gallerySet) {
    throw new Error("Image gallery trigger is missing its gallery set.");
  }
  openGallery(gallerySet);
});

document.addEventListener("keydown", (event) => {
  if (!mediaDialog.open) return;
  if (event.key === "Escape") {
    event.preventDefault();
    mediaDialog.close();
    return;
  }
  if (currentImageIndex < 0) return;
  if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
  if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
});

previousButton.addEventListener("click", () => showImage(currentImageIndex - 1));
nextButton.addEventListener("click", () => showImage(currentImageIndex + 1));
closeButton.addEventListener("click", () => mediaDialog.close());
mediaDialog.addEventListener("close", closeMediaDialog);
mediaDialog.addEventListener("click", (event) => {
  if (event.target === mediaDialog) mediaDialog.close();
});

const navigationLinks = Array.from(document.querySelectorAll(".nav-links a"));
const observedSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const navigationObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio);
    if (visibleSections.length === 0) return;

    const activeId = visibleSections[0].target.id;
    navigationLinks.forEach((link) => {
      if (link.hash === `#${activeId}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, {
    rootMargin: "-20% 0px -65% 0px",
    threshold: [0, 0.1, 0.25, 0.5],
  });
  observedSections.forEach((section) => navigationObserver.observe(section));
}
