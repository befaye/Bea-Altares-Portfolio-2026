const mediaDialog = document.querySelector("#media-dialog");
const mediaStage = document.querySelector("#media-dialog-stage");
const mediaCaption = document.querySelector("#media-dialog-caption");
const previousButton = document.querySelector("[data-gallery-previous]");
const nextButton = document.querySelector("[data-gallery-next]");
const closeButton = document.querySelector("[data-dialog-close]");
const galleryImages = Array.from(document.querySelectorAll("main img:not(.video-thumbnail)"));
let currentImageIndex = -1;

galleryImages.forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `View image larger: ${image.alt}`);
});

function showImage(index) {
  currentImageIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[currentImageIndex];
  const enlargedImage = document.createElement("img");
  enlargedImage.src = image.currentSrc || image.src;
  enlargedImage.alt = image.alt;
  mediaStage.replaceChildren(enlargedImage);
  mediaCaption.textContent = image.alt;
  previousButton.hidden = galleryImages.length < 2;
  nextButton.hidden = galleryImages.length < 2;
}

function openImage(image) {
  showImage(galleryImages.indexOf(image));
  mediaDialog.showModal();
  closeButton.focus();
}

function openVideo(videoId, title) {
  if (!/^[\w-]{11}$/.test(videoId)) {
    throw new Error("Invalid YouTube video ID.");
  }

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.title = title;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  mediaStage.replaceChildren(iframe);
  mediaCaption.textContent = title;
  previousButton.hidden = true;
  nextButton.hidden = true;
  mediaDialog.showModal();
  closeButton.focus();
}

function closeMediaDialog() {
  mediaStage.replaceChildren();
  mediaCaption.textContent = "";
  currentImageIndex = -1;
}

document.addEventListener("click", (event) => {
  const videoButton = event.target.closest("[data-video-id]");
  if (videoButton) {
    openVideo(videoButton.dataset.videoId, videoButton.getAttribute("aria-label").replace(/^Play | video$/g, ""));
    return;
  }

  const image = event.target.closest("main img:not(.video-thumbnail)");
  if (image) {
    event.preventDefault();
    openImage(image);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("main img[role='button']") && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openImage(event.target);
    return;
  }

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
