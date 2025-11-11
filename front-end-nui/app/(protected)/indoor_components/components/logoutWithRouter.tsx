
export function logoutWithRouter() {
  localStorage.removeItem("token");
  localStorage.removeItem("profile");
  window.location.href = "/login"; // full page reload
}
