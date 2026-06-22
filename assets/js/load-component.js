document.addEventListener("DOMContentLoaded", async () => {
  const headerContainer = document.getElementById("header-container");
  const footerContainer = document.getElementById("footer-container");

  if (headerContainer) {
    const header = await fetch("./pages/common/header.html");
    headerContainer.innerHTML = await header.text();

    // Navbar scroll effect
    const nav = document.getElementById("mainNav");

    if (nav) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll);
    }
  }

  if (footerContainer) {
    const footer = await fetch("./pages/common/footer.html");
    footerContainer.innerHTML = await footer.text();
  }
});
