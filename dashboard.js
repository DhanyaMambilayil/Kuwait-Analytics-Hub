import { auth, db } from "./firebase-config.js";
import { DASHBOARDS } from "./dashboards.js?v=26";

import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
  updatePassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const ICONS = {
  all: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  retail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.8"/><path d="M21 14l-5.5-4.5L11 14"/></svg>',
  wholesale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3l4 4-4 4"/><path d="M17 21l-4-4 4-4"/><path d="M3 7h10"/><path d="M11 17h10"/></svg>',
  corporate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="9" height="18"/><rect x="13" y="8" width="7" height="13"/><path d="M7.5 7h2M7.5 11h2M7.5 15h2"/></svg>',
  customer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="8.5" r="2.4"/><path d="M15.5 14.2c2.6.4 4.5 2.7 4.5 5.3"/></svg>',
  market: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"/></svg>',
  contests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2.5 14.8 8.6 21.5 9.3 16.5 13.8 18 20.5 12 17 6 20.5 7.5 13.8 2.5 9.3 9.2 8.6"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  signout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 21 7.5 12 13 3 7.5"/><path d="M3 12.5l9 5.5 9-5.5"/><path d="M3 17.5l9 5.5 9-5.5"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>'
};

const CATEGORY_STYLES = {
  "retail": { icon: "retail", tone: "" },
  "wholesale": { icon: "wholesale", tone: "" },
  "corporate": { icon: "corporate", tone: "gold" },
  "customer analytics": { icon: "customer", tone: "teal" },
  "market intelligence": { icon: "market", tone: "teal" },
  "contests": { icon: "contests", tone: "purple" }
};

function getCategoryStyle(category) {
  const key = String(category || "").trim().toLowerCase();
  return CATEGORY_STYLES[key] || { icon: "grid", tone: "" };
}

function paintIcon(el) {
  const key = el.dataset.icon;
  if (key && ICONS[key]) {
    el.innerHTML = ICONS[key];
  }
}

function paintAllIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach(paintIcon);
}

window.addEventListener("DOMContentLoaded", () => {
  paintAllIcons();

  const loadingScreen = document.getElementById("loading-screen");
  const portal = document.getElementById("portal");
  const logoutButton = document.getElementById("logout-button");

  const dashboardSection = document.getElementById("dashboard-section");
  const passwordSection = document.getElementById("password-section");
  const changePasswordNav = document.getElementById("change-password-nav");

  const dashboardList = document.getElementById("dashboard-list");
  const dashboardSearch = document.getElementById("dashboard-search");
  const portalMessage = document.getElementById("portal-message");
  const userName = document.getElementById("user-name");
  const userRole = document.getElementById("user-role");
  const avatar = document.getElementById("avatar");
  const sectionTitle = document.getElementById("section-title");
  const categoryNavigation = document.getElementById("category-navigation");
  const statDashboards = document.getElementById("stat-dashboards");
  const statCategories = document.getElementById("stat-categories");
  const statUpdated = document.getElementById("stat-updated");
  const statWelcome = document.getElementById("stat-welcome");

  const changePasswordForm = document.getElementById("change-password-form");
  const currentPasswordInput = document.getElementById("current-password");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const passwordMessage = document.getElementById("password-message");
  const changePasswordButton = document.getElementById("change-password-button");

  let visibleDashboards = [];
  let activeCategory = "All";

  function showFatalError(message, error = null) {
    if (error) console.error(error);

    if (loadingScreen) {
      loadingScreen.innerHTML = `
        <div class="error-panel">
          <h2>Access could not be loaded</h2>
          <p>${message}</p>
          <button id="error-logout" class="view-button" type="button">
            Return to login
          </button>
        </div>
      `;

      document.getElementById("error-logout")?.addEventListener("click", async () => {
        await signOut(auth);
        window.location.replace("./index.html");
      });
    }
  }

  const requiredElements = {
    loadingScreen,
    portal,
    logoutButton,
    dashboardSection,
    passwordSection,
    changePasswordNav,
    dashboardList,
    dashboardSearch,
    portalMessage,
    userName,
    userRole,
    avatar,
    sectionTitle,
    categoryNavigation,
    statDashboards,
    statCategories,
    statUpdated,
    statWelcome,
    changePasswordForm,
    currentPasswordInput,
    newPasswordInput,
    confirmPasswordInput,
    passwordMessage,
    changePasswordButton
  };

  const missingElements = Object.entries(requiredElements)
    .filter(([, element]) => !element)
    .map(([name]) => name);

  if (missingElements.length > 0) {
    showFatalError(
      `The page layout and JavaScript are out of sync. Missing elements: ${missingElements.join(", ")}.`
    );
    return;
  }

  function getInitials(name) {
    return String(name || "User")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join("") || "U";
  }

  function getAllowedDashboards(permissions) {
    return DASHBOARDS.filter(item => {
      if (!item.active || !item.url || item.url.startsWith("PASTE_")) {
        return false;
      }

      return permissions.admin === true ||
             permissions[item.permissionKey] === true;
    });
  }


  function getDashboardCode(item) {
    const title = String(item.title || "").trim().toLowerCase();

    const exactCodes = {
      "retail performance": "R",
      "wholesale": "W",
      "corporate desk": "C",
      "customer base": "CB",
      "competitive presence": "CP",
      "bec win-back": "BEC",
      "aae win-back": "AAE"
    };

    if (exactCodes[title]) {
      return exactCodes[title];
    }

    const words = String(item.title || "Dashboard")
      .replace(/[^a-zA-Z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return words
      .slice(0, 2)
      .map(word => word[0])
      .join("")
      .toUpperCase();
  }

  function createCard(item) {
    const card = document.createElement("div");
    card.className = "dashboard-card";

    const style = getCategoryStyle(item.category);
    const toneAttr = style.tone ? ` data-tone="${style.tone}"` : "";

    card.innerHTML = `
      <div class="dashboard-icon">${getDashboardCode(item)}</div>

      <span class="category-pill"${toneAttr}>${item.category}</span>

      <strong class="dashboard-title">${item.title}</strong>

      <p class="dashboard-description">${item.description}</p>

      <a class="view-button"
         href="${item.url}"
         target="_blank"
         rel="noopener noreferrer">
        View Dashboard <span>→</span>
      </a>

      <div class="dashboard-decor" data-icon="${style.icon}"></div>
    `;

    paintAllIcons(card);

    return card;
  }

  function getCategoryNavItems() {
    return [...document.querySelectorAll(".category-nav")];
  }

  function selectCategory(category, selectedButton) {
    showDashboardSection();

    getCategoryNavItems().forEach(item => item.classList.remove("active"));
    selectedButton.classList.add("active");

    activeCategory = category || "All";
    sectionTitle.textContent =
      activeCategory === "All"
        ? "All Dashboards"
        : `${activeCategory} Dashboards`;

    dashboardSearch.value = "";
    renderDashboards();
  }

  function renderCategoryNavigation() {
    const categories = [...new Set(
      visibleDashboards
        .map(item => String(item.category || "").trim())
        .filter(Boolean)
    )];

    categoryNavigation.innerHTML = "";

    categories.forEach(category => {
      const button = document.createElement("button");
      button.className = "nav-item category-nav";
      button.type = "button";
      button.dataset.category = category;

      const icon = document.createElement("span");
      icon.className = "nav-icon";
      icon.dataset.icon = getCategoryStyle(category).icon;
      paintIcon(icon);

      const label = document.createElement("b");
      label.textContent = category;

      button.append(icon, label);
      button.addEventListener("click", () => selectCategory(category, button));
      categoryNavigation.appendChild(button);
    });

    const allButton = document.querySelector(
      '.category-nav[data-category="All"]'
    );

    if (allButton) {
      allButton.onclick = () => selectCategory("All", allButton);
    }
  }

  function renderDashboards() {
    const query = dashboardSearch.value.trim().toLowerCase();

    const filtered = visibleDashboards.filter(item => {
      const categoryMatches =
        activeCategory === "All" ||
        String(item.category).toLowerCase() === activeCategory.toLowerCase();

      const searchableText =
        `${item.title} ${item.description} ${item.category}`.toLowerCase();

      return categoryMatches && searchableText.includes(query);
    });

    dashboardList.innerHTML = "";

    if (filtered.length === 0) {
      portalMessage.textContent = visibleDashboards.length === 0
        ? "No dashboards are currently assigned to your account."
        : "No dashboards match your selection.";
      return;
    }

    portalMessage.textContent = "";
    filtered.forEach(item => dashboardList.appendChild(createCard(item)));
  }

  function renderStats(displayName) {
    const categoryCount = new Set(
      visibleDashboards.map(item => String(item.category || "").trim()).filter(Boolean)
    ).size;

    statDashboards.textContent = String(visibleDashboards.length);
    statCategories.textContent = String(categoryCount);

    const now = new Date();
    statUpdated.textContent = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const firstName = String(displayName || "there").split(" ")[0];
    statWelcome.textContent = `${firstName}!`;
  }

  function showDashboardSection() {
    passwordSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    changePasswordNav.classList.remove("active");
  }

  function showPasswordSection() {
    dashboardSection.classList.add("hidden");
    passwordSection.classList.remove("hidden");

    getCategoryNavItems().forEach(item => item.classList.remove("active"));
    changePasswordNav.classList.add("active");

    passwordMessage.textContent = "";
    passwordMessage.className = "form-message";
    changePasswordForm.reset();
    currentPasswordInput.focus();
  }

  dashboardSearch.addEventListener("input", renderDashboards);

  changePasswordNav.addEventListener("click", showPasswordSection);

  changePasswordForm.addEventListener("submit", async event => {
    event.preventDefault();

    passwordMessage.textContent = "";
    passwordMessage.className = "form-message";

    const user = auth.currentUser;
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!user || !user.email) {
      passwordMessage.classList.add("error");
      passwordMessage.textContent =
        "Your session has expired. Please sign in again.";
      return;
    }

    if (newPassword.length < 8) {
      passwordMessage.classList.add("error");
      passwordMessage.textContent =
        "The new password must contain at least 8 characters.";
      return;
    }

    if (newPassword !== confirmPassword) {
      passwordMessage.classList.add("error");
      passwordMessage.textContent =
        "The new passwords do not match.";
      return;
    }

    if (currentPassword === newPassword) {
      passwordMessage.classList.add("error");
      passwordMessage.textContent =
        "The new password must be different from the current password.";
      return;
    }

    changePasswordButton.disabled = true;
    changePasswordButton.textContent = "Updating...";

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      changePasswordForm.reset();
      passwordMessage.classList.add("success");
      passwordMessage.textContent = "Password changed successfully.";
    } catch (error) {
      console.error(error);
      passwordMessage.classList.add("error");

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        passwordMessage.textContent = "The current password is incorrect.";
      } else if (error.code === "auth/weak-password") {
        passwordMessage.textContent = "Please choose a stronger password.";
      } else if (error.code === "auth/too-many-requests") {
        passwordMessage.textContent =
          "Too many attempts. Please wait and try again.";
      } else {
        passwordMessage.textContent =
          "The password could not be changed. Please try again.";
      }
    } finally {
      changePasswordButton.disabled = false;
      changePasswordButton.textContent = "Change Password";
    }
  });

  logoutButton.addEventListener("click", async () => {
    await signOut(auth);
    window.location.replace("./index.html");
  });

  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location.replace("./index.html");
      return;
    }

    try {
      const userDocument = await getDoc(doc(db, "users", user.uid));

      if (!userDocument.exists()) {
        throw new Error(`No Firestore document exists at users/${user.uid}.`);
      }

      const permissions = userDocument.data();
      visibleDashboards = getAllowedDashboards(permissions);
      renderCategoryNavigation();

      const displayName = permissions.name || user.email || "User";

      userName.textContent = displayName;
      userRole.textContent =
        permissions.admin === true ? "Administrator" : "Authorised User";
      avatar.textContent = getInitials(displayName);

      renderStats(displayName);
      renderDashboards();

      loadingScreen.classList.add("hidden");
      portal.classList.remove("hidden");
    } catch (error) {
      showFatalError(
        error.message || "Unable to read your access permissions.",
        error
      );
    }
  });
});
