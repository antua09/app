const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = e.target.children.user.value;
  const password = e.target.children.password.value;
  const res = await fetch("http:// 10.5.5.37:4000/api/login", {
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

register.js
const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit",async(e)=>{
  e.preventDefault();
  console.log(e.target.children.user.value)
  const res = await fetch("http:// 10.5.5.37:4000/api/register",{
    method:"POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      user: e.target.children.user.value,
      email: e.target.children.email.value,
      password: e.target.children.password.value
    })
  });
  if(!res.ok) return mensajeError.classList.toggle("escondido",false);
  const resJson = await res.json();
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
})
