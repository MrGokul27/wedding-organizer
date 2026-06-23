document.addEventListener("DOMContentLoaded", async () => {
  const headerContainer = document.getElementById("header-container");
  const footerContainer = document.getElementById("footer-container");

  // Check if current page is inside /pages/
  const isInsidePages = window.location.pathname.includes("/pages/");

  const headerPath = isInsidePages
    ? "./common/header.html"
    : "./pages/common/header.html";

  const footerPath = isInsidePages
    ? "./common/footer.html"
    : "./pages/common/footer.html";

  if (headerContainer) {
    const header = await fetch(headerPath);
    headerContainer.innerHTML = await header.text();

    const nav = document.getElementById("mainNav");

    if (nav) {
      const handleScroll = () => {
        nav.classList.toggle("scrolled", window.scrollY > 50);
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll);
    }
  }

  if (footerContainer) {
    const footer = await fetch(footerPath);
    footerContainer.innerHTML = await footer.text();
  }
});
