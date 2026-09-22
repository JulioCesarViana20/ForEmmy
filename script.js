const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

function bindPersonalData() {
  $$("[data-person]").forEach((element) => { element.textContent = siteData[element.dataset.person]; });
  $$("[data-content]").forEach((element) => { element.textContent = siteData[element.dataset.content]; });
}

function placeholder(label, className = "memory-placeholder") {
  const element = document.createElement("div");
  element.className = className;
  element.textContent = label;
  return element;
}

function media(item, className) {
  if (!item.src) return placeholder(item.image || item.label, className);
  const image = document.createElement("img");
  image.className = className;
  image.src = item.src;
  image.alt = item.caption || item.title || item.label;
  image.loading = "lazy";
  return image;
}



function renderGallery() {
  const gallery = $("#gallery-grid");
  siteData.gallery.forEach((item) => {
    const card = document.createElement("button");
    card.className = "gallery-card";
    card.type = "button";
    card.setAttribute("aria-label", `Abrir ${item.label}`);
    card.append(media(item, "gallery-placeholder"));
    const caption = document.createElement("span");
    caption.className = "gallery-caption";
    caption.textContent = item.caption;
    card.append(caption);
    card.addEventListener("click", () => openLightbox(item));
    gallery.append(card);
  });
}

function renderAdmire() {
  siteData.admire.forEach((item) => {
    const card = document.createElement("article");
    card.className = "admire-card reveal";
    card.innerHTML = `<span class="admire-number">${item.number} —</span><h3>${item.title}</h3><p>${item.text}</p>`;
    $("#admire-grid").append(card);
  });
}

function renderMoments() {
  siteData.moments.forEach((item) => {
    const card = document.createElement("article");
    card.className = "moment-card reveal";
    card.append(media(item, "gallery-placeholder moment-visual"));
    card.insertAdjacentHTML("beforeend", `<div class="moment-meta"><span>${item.date}</span><span>memória</span></div><h3>${item.title}</h3><p>${item.text}</p>`);
    $("#moments-grid").append(card);
  });
}

function startCountdown() {
  const target = new Date(siteData.birthday);
  const countdown = $("#countdown");
  const message = $("#birthday-message");
  const tick = () => {
    const difference = target.getTime() - Date.now();
    if (difference <= 0) {
      countdown.hidden = true;
      message.hidden = false;
      return;
    }
    const values = { days: Math.floor(difference / 86400000), hours: Math.floor(difference / 3600000) % 24, minutes: Math.floor(difference / 60000) % 60, seconds: Math.floor(difference / 1000) % 60 };
    Object.entries(values).forEach(([key, value]) => { $(`[data-time="${key}"]`).textContent = String(value).padStart(2, "0"); });
  };
  tick();
  setInterval(tick, 1000);
}

function openLightbox(item) {
  const visual = $("#lightbox-visual");
  visual.replaceChildren();
  if (item.src) {
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.caption || item.label;
    visual.append(image);
  } else {
    visual.textContent = item.label;
  }
  $("#lightbox-caption").textContent = item.caption;
  $("#lightbox").hidden = false;
  document.body.classList.add("locked");
  $("#lightbox-close").focus();
}

function closeLightbox() { $("#lightbox").hidden = true; document.body.classList.remove("locked"); }

function setupInteractions() {
  const intro = $("#intro-screen");
  const shell = $("#site-shell");
  $("#enter-button").addEventListener("click", () => {
    intro.classList.add("is-exiting");
    shell.classList.add("is-visible");
    shell.setAttribute("aria-hidden", "false");
    document.body.classList.remove("locked");
    setTimeout(() => $("#top").focus(), 1000);
  });
  $("#reveal-button").addEventListener("click", () => {
    $("#final-prelude").hidden = true;
    $("#final-tease").hidden = true;
    $("#reveal-button").hidden = true;
    $("#final-message").hidden = false;
  });
  $("#lightbox-close").addEventListener("click", closeLightbox);
  $("#lightbox").addEventListener("click", (event) => { if (event.target.id === "lightbox") closeLightbox(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !$("#lightbox").hidden) closeLightbox(); });
  const toggle = $("#menu-toggle");
  toggle.addEventListener("click", () => { const open = $("#site-nav").classList.toggle("is-open"); toggle.setAttribute("aria-expanded", open); });
  $$(".site-nav a").forEach((link) => link.addEventListener("click", () => $("#site-nav").classList.remove("is-open")));
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: .12 });
  $$(".reveal").forEach((element) => observer.observe(element));
}

bindPersonalData();
renderGallery();
renderAdmire();
renderMoments();
startCountdown();
setupInteractions();
setupReveal();
