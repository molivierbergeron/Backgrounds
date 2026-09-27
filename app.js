const nav = document.querySelector("#round-nav");
const gallery = document.querySelector("#gallery");
const viewer = document.querySelector("#viewer");
const viewerImage = document.querySelector("#viewer-image");
const viewerTitle = document.querySelector("#viewer-title");
const viewerDownload = document.querySelector("#viewer-download");
let activeImages = [];
let activeIndex = 0;

const encodePath = (value) => value.split("/").map(encodeURIComponent).join("/");

function showImage(index) {
  activeIndex = (index + activeImages.length) % activeImages.length;
  const image = activeImages[activeIndex];
  const original = encodePath(image.original);
  viewerImage.src = original;
  viewerImage.alt = image.filename;
  viewerTitle.textContent = image.filename;
  viewerDownload.href = original;
  viewerDownload.download = image.filename;
}

function openViewer(group, index) {
  activeImages = group.files;
  showImage(index);
  viewer.showModal();
}

function closeViewer() { viewer.close(); }

function imageCard(group, image, index) {
  const original = encodePath(image.original);
  const thumbnail = encodePath(image.thumbnail);
  const article = document.createElement("article");
  article.className = "card";
  const openButton = document.createElement("button");
  openButton.className = "image-button";
  openButton.type = "button";
  openButton.setAttribute("aria-label", `Agrandir ${image.filename}`);
  const preview = document.createElement("img");
  preview.src = thumbnail;
  preview.alt = "";
  preview.loading = "lazy";
  openButton.append(preview);
  openButton.addEventListener("click", () => openViewer(group, index));

  const footer = document.createElement("div");
  footer.className = "card-footer";
  const filename = document.createElement("span");
  filename.className = "filename";
  filename.title = image.filename;
  filename.textContent = image.filename;
  const download = document.createElement("a");
  download.className = "download-link";
  download.href = original;
  download.download = image.filename;
  download.textContent = "Télécharger";
  footer.append(filename, download);
  article.append(openButton, footer);
  return article;
}

for (const group of window.galleryGroups) {
  const navLink = document.createElement("a");
  navLink.href = `#${group.id}`;
  navLink.textContent = `${group.label} · ${group.files.length}`;
  nav.append(navLink);

  const section = document.createElement("section");
  section.className = "round";
  section.id = group.id;
  const heading = document.createElement("div");
  heading.className = "round-heading";
  const title = document.createElement("h2");
  title.textContent = group.label;
  const count = document.createElement("span");
  count.className = "image-count";
  count.textContent = `${group.files.length} images`;
  heading.append(title, count);
  const grid = document.createElement("div");
  grid.className = "grid";
  group.files.forEach((image, index) => grid.append(imageCard(group, image, index)));
  section.append(heading, grid);
  gallery.append(section);
}

document.querySelector("#viewer-close").addEventListener("click", closeViewer);
document.querySelector("#viewer-previous").addEventListener("click", () => showImage(activeIndex - 1));
document.querySelector("#viewer-next").addEventListener("click", () => showImage(activeIndex + 1));
viewer.addEventListener("click", (event) => { if (event.target === viewer) closeViewer(); });
document.addEventListener("keydown", (event) => {
  if (!viewer.open) return;
  if (event.key === "ArrowLeft") showImage(activeIndex - 1);
  if (event.key === "ArrowRight") showImage(activeIndex + 1);
});
