import { auth, db } from "./firebase-config.js";
import { DASHBOARDS } from "./dashboards.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const loadingScreen = document.getElementById("loading-screen");
const portal = document.getElementById("portal");
const welcomeMessage = document.getElementById("welcome-message");
const portalMessage = document.getElementById("portal-message");
const logoutButton = document.getElementById("logout-button");
const dashboardGrid = document.getElementById("dashboard-grid");
const dashboardSearch = document.getElementById("dashboard-search");

let visibleDashboards = [];

function createCard(item) {
  const card = document.createElement("a");
  card.className = "dashboard-card";
  card.href = item.url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.dataset.search = `${item.title} ${item.description} ${item.category}`.toLowerCase();

  card.innerHTML = `
    <div class="card-top">
      <div class="card-icon">${item.icon}</div>
      <span class="category-badge">${item.category}</span>
    </div>
    <h3>${item.title}</h3>
    <p>${item.description}</p>
    <span class="open-link">Open dashboard →</span>
  `;

  return card;
}

function renderDashboards(items) {
  dashboardGrid.innerHTML = "";

  if (items.length === 0) {
    portalMessage.textContent = "No dashboards match your search.";
    return;
  }

  portalMessage.textContent = "";
  items.forEach((item) => dashboardGrid.appendChild(createCard(item)));
}

function getAllowedDashboards(permissions) {
  return DASHBOARDS.filter((item) => {
    if (!item.active || !item.url || item.url.startsWith("PASTE_")) return false;
    return permissions.admin === true || permissions[item.permissionKey] === true;
  });
}

dashboardSearch.addEventListener("input", () => {
  const query = dashboardSearch.value.trim().toLowerCase();
  const filtered = visibleDashboards.filter((item) =>
    `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query)
  );
  renderDashboards(filtered);
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  try {
    const snapshot = await getDoc(doc(db, "users", user.uid));

    if (!snapshot.exists()) {
      throw new Error("User permission document not found.");
    }

    const permissions = snapshot.data();
    visibleDashboards = getAllowedDashboards(permissions);

    welcomeMessage.textContent = `Welcome, ${permissions.name || user.email}`;
    renderDashboards(visibleDashboards);

    if (visibleDashboards.length === 0) {
      portalMessage.textContent = "No dashboards are currently assigned to your account.";
    }

    loadingScreen.classList.add("hidden");
    portal.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    loadingScreen.innerHTML = `
      <div class="error-panel">
        <h2>Access could not be loaded</h2>
        <p>Please confirm that your Firestore user document uses your Firebase Authentication UID.</p>
        <button id="error-logout" class="logout-button" type="button">Return to login</button>
      </div>
    `;
    document.getElementById("error-logout").addEventListener("click", async () => {
      await signOut(auth);
      window.location.replace("index.html");
    });
  }
});

logoutButton.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("index.html");
});
