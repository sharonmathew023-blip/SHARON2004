const toggle = document.getElementById("themeToggle");
const body = document.body;

toggle.onclick = () => {
  body.classList.toggle("light");
  body.classList.toggle("dark");

  toggle.textContent = body.classList.contains("dark") ? "🌙" : "☀️";
};
