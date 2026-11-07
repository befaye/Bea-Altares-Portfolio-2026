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
