import { auth, db } from "./firebase-config.js";
import { DASHBOARDS } from "./dashboards.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const loadingScreen = document.getElementById("loading-screen");
const portal = document.getElementById("portal");
const logoutButton = document.getElementById("logout-button");
const dashboardList = document.getElementById("dashboard-list");
const dashboardSearch = document.getElementById("dashboard-search");
const portalMessage = document.getElementById("portal-message");
const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const avatar = document.getElementById("avatar");
const sectionTitle = document.getElementById("section-title");
const navItems = [...document.querySelectorAll(".nav-item")];

let visibleDashboards = [];
let activeCategory = "All";

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0,2).map(x => x[0].toUpperCase()).join("") || "U";
}

function allowedDashboards(permissions) {
  return DASHBOARDS.filter(item =>
    item.active &&
    item.url &&
    !item.url.startsWith("PASTE_") &&
    (permissions.admin === true || permissions[item.permissionKey] === true)
  );
}

function row(item) {
  const el = document.createElement("div");
  el.className = "dashboard-row";
  el.innerHTML = `
    <div class="dashboard-name-cell">
      <div class="dashboard-icon">${item.icon || "D"}</div>
      <strong>${item.title}</strong>
    </div>
    <div><span class="category-pill">${item.category}</span></div>
    <div class="dashboard-description">${item.description}</div>
    <div><a class="view-button" href="${item.url}" target="_blank" rel="noopener noreferrer">View Dashboard <span>›</span></a></div>`;
  return el;
}

function render() {
  const q = dashboardSearch.value.trim().toLowerCase();
  const items = visibleDashboards.filter(item => {
    const categoryOk = activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase();
    const text = `${item.title} ${item.description} ${item.category}`.toLowerCase();
    return categoryOk && text.includes(q);
  });

  dashboardList.innerHTML = "";
  if (!items.length) {
    portalMessage.textContent = "No dashboards match your selection.";
    return;
  }
  portalMessage.textContent = "";
  items.forEach(item => dashboardList.appendChild(row(item)));
}

dashboardSearch.addEventListener("input", render);

navItems.forEach(button => {
  button.addEventListener("click", () => {
    navItems.forEach(x => x.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    sectionTitle.textContent = activeCategory === "All" ? "All Dashboards" : `${activeCategory} Dashboards`;
    render();
  });
});

onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) throw new Error("User permission document not found.");

    const permissions = snap.data();
    visibleDashboards = allowedDashboards(permissions);

    const displayName = permissions.name || user.email || "User";
    userName.textContent = displayName;
    userRole.textContent = permissions.admin === true ? "Administrator" : "Authorised User";
    avatar.textContent = initials(displayName);

    render();
    if (!visibleDashboards.length) portalMessage.textContent = "No dashboards are currently assigned to your account.";

    loadingScreen.classList.add("hidden");
    portal.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    loadingScreen.innerHTML = `<div class="error-panel"><h2>Access could not be loaded</h2><p>Please confirm that your Firestore user document uses your Firebase Authentication UID.</p><button id="error-logout" class="view-button">Return to login</button></div>`;
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
