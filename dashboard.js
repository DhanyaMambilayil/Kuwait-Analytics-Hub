import { auth, db } from "./firebase-config.js";
import { DASHBOARDS } from "./dashboards.js";

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

window.addEventListener("DOMContentLoaded", () => {
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
  const categoryNavItems = [...document.querySelectorAll(".category-nav")];

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

  function createRow(item) {
    const row = document.createElement("div");
    row.className = "dashboard-row";

    row.innerHTML = `
      <div class="dashboard-name-cell">
        <div class="dashboard-icon">${item.icon || "D"}</div>
        <strong>${item.title}</strong>
      </div>

      <div>
        <span class="category-pill">${item.category}</span>
      </div>

      <div class="dashboard-description">
        ${item.description}
      </div>

      <div>
        <a class="view-button"
           href="${item.url}"
           target="_blank"
           rel="noopener noreferrer">
          View Dashboard <span>›</span>
        </a>
      </div>
    `;

    return row;
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
    filtered.forEach(item => dashboardList.appendChild(createRow(item)));
  }

  function showDashboardSection() {
    passwordSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    changePasswordNav.classList.remove("active");
  }

  function showPasswordSection() {
    dashboardSection.classList.add("hidden");
    passwordSection.classList.remove("hidden");

    categoryNavItems.forEach(item => item.classList.remove("active"));
    changePasswordNav.classList.add("active");

    passwordMessage.textContent = "";
    passwordMessage.className = "form-message";
    changePasswordForm.reset();
    currentPasswordInput.focus();
  }

  dashboardSearch.addEventListener("input", renderDashboards);

  categoryNavItems.forEach(button => {
    button.addEventListener("click", () => {
      showDashboardSection();

      categoryNavItems.forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      activeCategory = button.dataset.category || "All";
      sectionTitle.textContent =
        activeCategory === "All"
          ? "All Dashboards"
          : `${activeCategory} Dashboards`;

      renderDashboards();
    });
  });

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

      const displayName = permissions.name || user.email || "User";

      userName.textContent = displayName;
      userRole.textContent =
        permissions.admin === true ? "Administrator" : "Authorised User";
      avatar.textContent = getInitials(displayName);

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

