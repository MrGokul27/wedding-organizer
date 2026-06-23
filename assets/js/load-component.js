document.addEventListener("DOMContentLoaded", async () => {
  const headerContainer = document.getElementById("header-container");
  const footerContainer = document.getElementById("footer-container");

  const isInsidePages = window.location.pathname.includes("/pages/");

  const headerPath = isInsidePages
    ? "./common/header.html"
    : "./pages/common/header.html";

  const footerPath = isInsidePages
    ? "./common/footer.html"
    : "./pages/common/footer.html";

  // ── Load Header ──
  if (headerContainer) {
    const headerRes = await fetch(headerPath);
    let headerHTML = await headerRes.text();

    // Fix asset and link paths when inside /pages/
    if (isInsidePages) {
      headerHTML = headerHTML
        .replace(/src="assets\//g, 'src="../assets/')
        .replace(/href="assets\//g, 'href="../assets/')
        .replace(/href="index\.html"/g, 'href="../index.html"')
        .replace(/href="pages\//g, 'href="');
    }

    headerContainer.innerHTML = headerHTML;

    // ── Set active nav link based on current URL ──
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const normHref = href.replace(/^\.\.\//, "").replace(/\/$/, "");
      const normPath = currentPath.replace(/\/$/, "");

      let isActive = false;
      if (normHref === "" || normHref === "index.html") {
        // Home is active only on root / index.html
        isActive =
          normPath === "/" ||
          normPath.endsWith("/index.html") ||
          (!normPath.includes("/pages/") && normPath !== "/");
      } else if (normHref && normPath.includes(normHref)) {
        isActive = true;
      }

      if (isActive) link.classList.add("nav-active");
    });

    // ── Scroll / inner-page nav visibility ──
    const nav = document.getElementById("mainNav");
    if (nav) {
      const isInner = document.body.classList.contains("inner-page");

      // Inner pages: always show scrolled style
      if (isInner) {
        nav.classList.add("scrolled");
      }

      const handleScroll = () => {
        if (!isInner) {
          nav.classList.toggle("scrolled", window.scrollY > 50);
        }
      };
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
  }

  // ── Load Footer ──
  if (footerContainer) {
    const footerRes = await fetch(footerPath);
    let footerHTML = await footerRes.text();

    if (isInsidePages) {
      footerHTML = footerHTML
        .replace(/src="assets\//g, 'src="../assets/')
        .replace(/href="assets\//g, 'href="../assets/')
        .replace(/href="index\.html"/g, 'href="../index.html"')
        .replace(/href="pages\//g, 'href="');
    }

    footerContainer.innerHTML = footerHTML;
  }
});
