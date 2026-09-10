/**
 * ABHISHEK M O — PORTFOLIO JAVASCRIPT
 * Interactive functionality: Theme toggle, Project filtering, Lightbox,
 * Copy-to-clipboard toast, Scrollspy, and Mobile Navigation.
 */

(function () {
  "use strict";

  // ---------------------------------------------------------
  // 1. THEME SWITCHER (DARK / LIGHT)
  // ---------------------------------------------------------
  var themeToggle = document.getElementById("themeToggle");
  var savedTheme = localStorage.getItem("theme");

  if (!savedTheme) {
    savedTheme = "light"; // Default to classy, radiant light theme
  }

  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      var nextTheme = currentTheme === "light" ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
    });
  }

  // ---------------------------------------------------------
  // 2. MOBILE NAVIGATION TOGGLE
  // ---------------------------------------------------------
  var menuToggle = document.getElementById("menuToggle");
  var primaryNav = document.getElementById("primaryNav");

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    primaryNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        primaryNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------------------------------------------------------
  // 3. PROJECT CATEGORY FILTERING
  // ---------------------------------------------------------
  var filterBtns = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      var filter = btn.getAttribute("data-filter");

      projectCards.forEach(function (card) {
        var category = card.getAttribute("data-category") || "";
        var shouldShow = filter === "all" || category.indexOf(filter) !== -1;

        if (shouldShow) {
          card.style.display = card.classList.contains("project-card--featured") && window.innerWidth > 840 ? "grid" : "flex";
          card.style.opacity = "0";
          card.style.transform = "translateY(10px)";
          setTimeout(function () {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 30);
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Handle responsive layout reset for featured cards
  window.addEventListener("resize", function () {
    projectCards.forEach(function (card) {
      if (card.style.display !== "none") {
        if (card.classList.contains("project-card--featured") && window.innerWidth > 840) {
          card.style.display = "grid";
        } else {
          card.style.display = "flex";
        }
      }
    });
  });

  // ---------------------------------------------------------
  // 4. SCREENSHOT LIGHTBOX MODAL
  // ---------------------------------------------------------
  var lightboxModal = document.getElementById("lightboxModal");
  var lightboxOverlay = document.getElementById("lightboxOverlay");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxTitle = document.getElementById("lightboxTitle");
  var lightboxDesc = document.getElementById("lightboxDesc");
  var lightboxUrl = document.getElementById("lightboxUrl");

  function openLightbox(imgSrc, title, desc, url) {
    if (!lightboxModal) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
    if (lightboxUrl) {
      lightboxUrl.textContent = url || "screenshot-preview.png";
    }
    lightboxModal.classList.add("is-open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("is-open");
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(function () {
      lightboxImg.src = "";
    }, 300);
  }

  document.querySelectorAll(".lightbox-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var imgSrc = trigger.getAttribute("data-img") || trigger.querySelector("img").src;
      var title = trigger.getAttribute("data-title") || "";
      var desc = trigger.getAttribute("data-desc") || "";
      var mockupUrlEl = trigger.closest(".project-mockup") ? trigger.closest(".project-mockup").querySelector(".mockup-url span") : null;
      var url = mockupUrlEl ? mockupUrlEl.textContent : "";
      openLightbox(imgSrc, title, desc, url);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightboxModal && lightboxModal.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  // ---------------------------------------------------------
  // 5. TOAST NOTIFICATION & COPY EMAIL
  // ---------------------------------------------------------
  var toastNotification = document.getElementById("toastNotification");
  var toastMessage = document.getElementById("toastMessage");
  var toastTimer = null;

  function showToast(message) {
    if (!toastNotification) return;
    if (toastMessage) toastMessage.textContent = message;
    toastNotification.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastNotification.classList.remove("is-shown");
    }, 3200);
  }

  function copyText(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMsg);
      }).catch(function () {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    var tempInput = document.createElement("textarea");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand("copy");
      showToast(successMsg);
    } catch (err) {
      showToast("Email: " + text);
    }
    document.body.removeChild(tempInput);
  }

  var copyEmailBtn = document.getElementById("copyEmailBtn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", function () {
      var email = copyEmailBtn.getAttribute("data-email") || "moabhishek039@gmail.com";
      copyText(email, "Copied email: " + email);
    });
  }

  document.querySelectorAll(".btn-copy-card").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var text = btn.getAttribute("data-copy") || "moabhishek039@gmail.com";
      copyText(text, "Copied to clipboard: " + text);
    });
  });

  // ---------------------------------------------------------
  // 6. SCROLLSPY & FLOATING BACK-TO-TOP BUTTON
  // ---------------------------------------------------------
  var floatingTopBtn = document.getElementById("floatingTopBtn");
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", function () {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Toggle Floating Top Button
    if (floatingTopBtn) {
      if (scrollY > 450) {
        floatingTopBtn.classList.add("is-visible");
      } else {
        floatingTopBtn.classList.remove("is-visible");
      }
    }

    // Scrollspy navigation highlight
    var currentSectionId = "";
    sections.forEach(function (sec) {
      var secTop = sec.offsetTop - 120;
      var secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentSectionId = sec.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
      var href = link.getAttribute("href");
      if (href === "#" + currentSectionId) {
        link.classList.add("is-active");
      }
    });
  }, { passive: true });

  if (floatingTopBtn) {
    floatingTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

})();
