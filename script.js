const toggle = document.getElementById("themeToggle");
const body = document.body;

toggle.addEventListener("click", () => {
  body.classList.toggle("light");
  body.classList.toggle("dark");

  const isDark = body.classList.contains("dark");
  toggle.textContent = isDark ? "🌙" : "☀️";
  toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
});
