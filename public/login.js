const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = e.target.children.user.value;
  const password = e.target.children.password.value;
  // Comentar la URL interna
  // const res = await fetch("http://10.5.5.37:4000/api/login", {
  const res = await fetch("http://your-production-url/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user, password })
  });
  if (!res.ok) return mensajeError.classList.toggle("escondido", false);
  const resJson = await res.json();
  if (resJson.redirect) {
    // Guardar el nombre de usuario en localStorage
    localStorage.setItem('username', resJson.user);
    window.location.href = resJson.redirect;
  } else {
    window.location.href = "/panel_control"; 
  }
});
