document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("hasResults")) {
    const scrollPos = localStorage.getItem("scrollPos_indexRoute");
    if (scrollPos) window.scrollTo(0, scrollPos);
  }
});

window.onbeforeunload = () => {
  localStorage.setItem("scrollPos_indexRoute", window.scrollY);
};
