document.addEventListener("DOMContentLoaded", () => {
  // Initialize dashboard structure and links
  initDashboardLayout();
  // Setup SPA navigation click listeners
  setupSpaNavigation();
  // Setup 404 redirection for non-navigation buttons and links
  setupRedirectTo404();
});

// Reusable function to initialize or refresh the layout
function initDashboardLayout() {
  const role = localStorage.getItem("userRole") || "couple";
  const userName = localStorage.getItem("userName") || "Jane & David";
  const userTitle = localStorage.getItem("userTitle") || "Couple";
  const userEmail = localStorage.getItem("userEmail") || "couple@stackly.com";

  // Check if we are currently inside a subdirectory (admin, couple, guest, planner)
  const isSubdir =
    window.location.pathname.includes("/admin/") ||
    window.location.pathname.includes("/couple/") ||
    window.location.pathname.includes("/guest/") ||
    window.location.pathname.includes("/planner/");

  const loginPath = isSubdir ? "../../login.html" : "../login.html";

  // Navigation Menu Definitions per Role
  const menus = {
    admin: [
      { name: "Overview", icon: "dashboard", url: "dashboard.html" },
      {
        name: "User Management",
        icon: "group",
        url: "admin/user-management.html",
      },
      {
        name: "Content Moderation",
        icon: "gavel",
        url: "admin/content-moderation.html",
      },
      {
        name: "System Health",
        icon: "monitor_heart",
        url: "admin/system-health.html",
      },
      {
        name: "Platform Settings",
        icon: "settings",
        url: "admin/platform-settings.html",
      },
    ],
    couple: [
      { name: "Overview", icon: "dashboard", url: "dashboard.html" },
      { name: "My Story", icon: "auto_stories", url: "couple/my-story.html" },
      { name: "Guest List", icon: "group", url: "couple/guest-list.html" },
      { name: "Vendor Team", icon: "list_alt", url: "couple/vendor-team.html" },
      {
        name: "Budget Tracker",
        icon: "account_balance_wallet",
        url: "couple/budget-tracker.html",
      },
      {
        name: "Gift Registry",
        icon: "redeem",
        url: "couple/gift-registry.html",
      },
    ],
    guest: [
      { name: "Overview", icon: "dashboard", url: "dashboard.html" },
      { name: "My Invitation", icon: "mail", url: "guest/my-invitation.html" },
      {
        name: "RSVP Status",
        icon: "event_available",
        url: "guest/rsvp-status.html",
      },
      {
        name: "Weekend Schedule",
        icon: "calendar_today",
        url: "guest/weekend-schedule.html",
      },
      {
        name: "Travel & Stay",
        icon: "flight_land",
        url: "guest/travel-and-stay.html",
      },
      {
        name: "Gift Registry",
        icon: "redeem",
        url: "guest/guest-gift-registry.html",
      },
    ],
    planner: [
      { name: "Overview", icon: "dashboard", url: "dashboard.html" },
      { name: "Leads", icon: "leaderboard", url: "planner/leads.html" },
      { name: "Clients", icon: "assignment_ind", url: "planner/clients.html" },
      {
        name: "Master Schedule",
        icon: "calendar_month",
        url: "planner/master-schedule.html",
      },
      { name: "Financials", icon: "payments", url: "planner/financials.html" },
    ],
  };

  const currentRoleMenu = menus[role] || menus.couple;
  const currentFilename = window.location.pathname.substring(
    window.location.pathname.lastIndexOf("/") + 1,
  );

  // Helper to resolve navigation links based on current depth
  function resolveUrl(itemUrl) {
    if (itemUrl === "dashboard.html") {
      return isSubdir ? "../dashboard.html" : "dashboard.html";
    }
    if (isSubdir) {
      return "../" + itemUrl;
    } else {
      return itemUrl;
    }
  }

  // 2. Build Sidebar Navigation Items
  let navItemsHtml = "";
  currentRoleMenu.forEach((item) => {
    const resolvedUrl = resolveUrl(item.url);
    const itemFilename =
      resolvedUrl.substring(resolvedUrl.lastIndexOf("/") + 1) ||
      "dashboard.html";

    // Highlight if active
    let isActive = false;
    if (
      currentFilename === itemFilename ||
      (currentFilename === "" && itemFilename === "dashboard.html")
    ) {
      isActive = true;
    }

    navItemsHtml += `
      <a class="sidebar-nav-link ${isActive ? "active" : ""}" href="${resolvedUrl}">
        <span class="material-symbols-outlined">${item.icon}</span>
        <span>${item.name}</span>
      </a>
    `;
  });

  // User Avatars (different mock avatars based on role)
  const avatars = {
    admin:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    couple:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=200",
    planner:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    guest:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  };
  const activeAvatar = avatars[role] || avatars.couple;

  // 3. Create elements and inject structure
  const mainContent =
    document.querySelector(".dashboard-content") ||
    document.querySelector("main");
  if (!mainContent) return;

  const wrapper = document.getElementById("dashboard-wrapper");
  if (wrapper) {
    // 3a. Inject Sidebar
    const sidebarHtml = `
      <aside class="dashboard-sidebar" id="dashboardSidebar">
        <div class="px-4 py-2 d-flex align-items-center justify-content-between border-bottom border-outline-variant">
          <div>
            <a href="../../../index.html" class="logo-wrapper">
              <img
                src="../../../assets/images/logoStackly.webp"
                width="150"
                alt="stackly-logo"
                class="logo-img"
              />
            </a>
            <style>
              .logo-img {
                width: 150px;
                filter: brightness(0) saturate(100%) invert(37%) sepia(18%)
                  saturate(820%) hue-rotate(292deg) brightness(92%) contrast(90%);
              }
            </style>
          </div>
          <button class="btn btn-sm d-lg-none text-primary" id="sidebarCloseBtn">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav class="flex-grow-1 px-3 py-4 overflow-y-auto">
          ${navItemsHtml}
        </nav>
        
        <div class="p-3 border-top border-outline-variant">
          <div class="d-flex align-items-center gap-3 p-2 bg-light rounded-3">
            <img class="rounded-circle" src="${activeAvatar}" alt="${userName}" style="width: 40px; height: 40px; object-fit: cover;">
            <div class="min-w-0">
              <p class="mb-0 fw-bold text-truncate small">${userName}</p>
              <p class="mb-0 text-muted small text-truncate" style="font-size: 10px">${userTitle}</p>
            </div>
          </div>
        </div>
      </aside>
    `;

    // 3b. Inject Top Header Bar
    const headerHtml = `
      <header class="dashboard-header">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-link d-lg-none p-0 text-primary" id="sidebarToggleBtn">
            <span class="material-symbols-outlined" style="font-size: 28px">menu</span>
          </button>
          <h5 class="text-primary mb-0 fw-bold font-playfair-display d-none d-sm-block">
            ${
              currentRoleMenu.find((item) => {
                const res = resolveUrl(item.url);
                return (
                  res.substring(res.lastIndexOf("/") + 1) === currentFilename
                );
              })?.name || "Dashboard"
            }
          </h5>
        </div>
        
        <div class="d-flex align-items-center gap-3">
          <div class="position-relative d-none d-md-block" style="width: 250px;">
            <input type="text" class="form-control form-control-sm rounded-pill ps-4" placeholder="Search..." style="background-color: var(--color-surface-low); border: 1px solid var(--color-outline);">
            <span class="material-symbols-outlined position-absolute text-muted small" style="left: 10px; top: 50%; transform: translateY(-50%); font-size: 16px;">search</span>
          </div>
          
          <button class="btn btn-sm btn-light rounded-circle p-2 position-relative text-muted">
            <span class="material-symbols-outlined" style="font-size: 20px;">notifications</span>
            <span class="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle" style="top: 8px; right: 2px;"></span>
          </button>
          
          <div class="dropdown">
            <button class="btn btn-sm p-0 rounded-circle border-0 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img class="rounded-circle border border-primary-light" src="${activeAvatar}" alt="${userName}" style="width: 32px; height: 32px; object-fit: cover;">
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-outline-variant p-2" style="border-radius: 12px; width: 220px;">
              <li class="px-3 py-2 border-bottom border-outline-variant mb-2">
                <p class="mb-0 fw-bold text-truncate small">${userName}</p>
                <p class="mb-0 text-muted small text-truncate" style="font-size: 11px;">${userEmail}</p>
              </li>
              <li>
                <a class="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2" href="#">
                  <span class="material-symbols-outlined" style="font-size: 18px;">person</span> Profile Settings
                </a>
              </li>
              <li>
                <a class="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2 text-danger" href="#" id="logoutBtn">
                  <span class="material-symbols-outlined" style="font-size: 18px;">logout</span> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
    `;

    // Check if the DOM structure is already wrapped and initialized
    const existingSidebar = document.getElementById("dashboardSidebar");
    const existingHeader = document.querySelector(".dashboard-header");

    if (existingSidebar && existingHeader) {
      // Re-render only inner elements to preserve structural wrapper reference
      existingSidebar.outerHTML = sidebarHtml;
      existingHeader.outerHTML = headerHtml;
    } else {
      // Inject sidebar at wrapper beginning
      const sidebarContainer = document.createElement("div");
      sidebarContainer.innerHTML = sidebarHtml;
      wrapper.insertBefore(
        sidebarContainer.firstElementChild,
        wrapper.firstChild,
      );

      // Create main container block
      const mainSection = document.createElement("div");
      mainSection.className = "dashboard-main";

      // Inject header
      const headerContainer = document.createElement("div");
      headerContainer.innerHTML = headerHtml;
      mainSection.appendChild(headerContainer.firstElementChild);

      // Move mainContent into mainSection
      const mainContentClone = mainContent.cloneNode(true);
      mainSection.appendChild(mainContentClone);

      // Swap out the original content structure
      mainContent.replaceWith(mainSection);
    }

    // 4. Toggle Sidebar for mobile responsive views
    const sidebar = document.getElementById("dashboardSidebar");
    const toggleBtn = document.getElementById("sidebarToggleBtn");
    const closeBtn = document.getElementById("sidebarCloseBtn");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.add("show");
      });
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("show");
      });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth < 992 &&
        sidebar &&
        sidebar.classList.contains("show")
      ) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove("show");
        }
      }
    });

    // 5. Logout logic
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userTitle");
        localStorage.removeItem("userEmail");
        window.location.href = loginPath;
      });
    }

    // Trigger visual fade-in
    requestAnimationFrame(() => {
      wrapper.classList.add("layout-loaded");
    });
  }
}

// SPA Navigation Router
function setupSpaNavigation() {
  document.addEventListener("click", async (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      link.target === "_blank"
    )
      return;

    // Resolve relative URL to absolute URL immediately
    const targetUrl = new URL(href, window.location.href);

    // Only intercept links within the same origin
    if (targetUrl.origin !== window.location.origin) return;

    const pathname = targetUrl.pathname;

    // Check if it is a dashboard internal link
    const isDashboardLink =
      pathname.includes("/dashboard.html") ||
      pathname.includes("/admin/") ||
      pathname.includes("/couple/") ||
      pathname.includes("/guest/") ||
      pathname.includes("/planner/");

    if (!isDashboardLink) return;

    e.preventDefault();
    await loadSpaPage(targetUrl.href);
  });

  // Handle back/forward navigation
  window.addEventListener("popstate", async (e) => {
    if (e.state && e.state.url) {
      await loadSpaPage(e.state.url, false);
    } else {
      window.location.reload();
    }
  });
}

// Load SPA Page content
async function loadSpaPage(url, pushState = true) {
  try {
    const mainSection = document.querySelector(".dashboard-main");
    if (mainSection) {
      mainSection.style.opacity = "0";
    }

    // Small delay to let opacity fade-out finish
    await new Promise((resolve) => setTimeout(resolve, 150));

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch target page content.");
    const htmlText = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const newContent = doc.querySelector(".dashboard-content");

    if (!newContent) {
      window.location.href = url;
      return;
    }

    // Update title
    document.title = doc.title || document.title;

    // Update history URL state (using absolute/fully resolved URLs)
    if (pushState) {
      window.history.pushState({ url }, "", url);
    }

    // Remove previously injected SPA styles/links to avoid memory/style leak and style conflicts
    document
      .querySelectorAll("[data-spa-injected]")
      .forEach((el) => el.remove());

    // Inject styles and stylesheets from the new document
    const newStyles = doc.querySelectorAll('link[rel="stylesheet"], style');
    newStyles.forEach((style) => {
      // Check if it already exists in the current document to avoid double-loading common styles (like bootstrap, dashboard.css)
      const isCommon = Array.from(
        document.querySelectorAll('link[rel="stylesheet"], style'),
      ).some((existing) => {
        if (style.tagName === "LINK" && existing.tagName === "LINK") {
          return style.getAttribute("href") === existing.getAttribute("href");
        }
        if (style.tagName === "STYLE" && existing.tagName === "STYLE") {
          return style.textContent === existing.textContent;
        }
        return false;
      });

      if (!isCommon) {
        const clone = style.cloneNode(true);
        clone.setAttribute("data-spa-injected", "true");
        document.head.appendChild(clone);
      }
    });

    // Swap content
    const currentContent = document.querySelector(".dashboard-content");
    if (currentContent) {
      currentContent.replaceWith(newContent.cloneNode(true));
    }

    // Scroll window back to top on page transition
    window.scrollTo({ top: 0, behavior: "instant" });

    // Re-initialize layout configuration & relative links
    initDashboardLayout();

    // Re-execute all scripts from the fetched document, excluding common/layout scripts
    const scripts = doc.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const src = oldScript.getAttribute("src") || "";
      // Exclude Bootstrap and dashboard-layout to prevent duplicate initialization
      if (
        src.includes("bootstrap.bundle") ||
        src.includes("dashboard-layout.js")
      ) {
        return;
      }

      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      document.body.appendChild(newScript);
      newScript.remove();
    });

    // Re-trigger global loads for newly mounted visual elements
    document.dispatchEvent(new Event("DOMContentLoaded"));
    window.dispatchEvent(new Event("load"));

    // Fade-in new content
    if (mainSection) {
      mainSection.style.opacity = "1";
    }
  } catch (err) {
    console.error("SPA Loader Error: ", err);
    window.location.href = url;
  }
}

// Redirect all non-essential buttons and links in the dashboard to 404.html
function setupRedirectTo404() {
  document.addEventListener(
    "click",
    (e) => {
      // Find closest link or button
      const element = e.target.closest("a, button");
      if (!element) return;

      // Check if it's one of the navigation/essential controls we want to allow:
      // 1. Sidebar navigation links
      if (element.classList.contains("sidebar-nav-link")) return;

      // 2. Sidebar mobile responsive toggles
      if (element.id === "sidebarToggleBtn" || element.id === "sidebarCloseBtn")
        return;
      if (
        element.closest("#sidebarToggleBtn") ||
        element.closest("#sidebarCloseBtn")
      )
        return;

      // 3. User profile dropdown toggle
      if (
        element.getAttribute("data-bs-toggle") === "dropdown" ||
        element.classList.contains("dropdown-toggle")
      )
        return;
      if (element.closest(".dropdown-toggle")) return;

      // 4. Logout action
      if (element.id === "logoutBtn" || element.closest("#logoutBtn")) return;

      // Allow logo navigation
      if (
        element.classList.contains("logo-wrapper") ||
        element.closest(".logo-wrapper")
      )
        return;
      // Resolve path to pages/common/404.html dynamically
      const isSubdir =
        window.location.pathname.includes("/admin/") ||
        window.location.pathname.includes("/couple/") ||
        window.location.pathname.includes("/guest/") ||
        window.location.pathname.includes("/planner/");

      const path404 = isSubdir ? "../../common/404.html" : "../common/404.html";

      e.preventDefault();
      e.stopPropagation();
      window.location.href = path404;
    },
    true,
  ); // Use capture phase to intercept early
}
