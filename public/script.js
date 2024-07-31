let count = 0;
let socket;
const pricePerCan = 0.33;
const weightPerCan = 15; // en gramos

function updateCount() {
  document.getElementById('count').innerText = count.toString().padStart(4, '0');
}

function showSummary() {
  const totalAmount = (count * pricePerCan).toFixed(2);
  const totalWeight = (count * weightPerCan).toFixed(2);
  alert(`Latas procesadas: ${count}\nCantidad a pagar: $${totalAmount}\nPeso total aprox: ${totalWeight} gramos`);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start').addEventListener('click', startCounting);
  document.getElementById('stop').addEventListener('click', stopCounting);
  document.getElementById('reset').addEventListener('click', resetCounter);
  document.getElementById('logout').addEventListener('click', exit);

  const username = localStorage.getItem('username');
  if (username) {
    document.getElementById('username').textContent = username;
  }

  // Conectar a Socket.IO
  socket = io();

  // Manejar los datos recibidos del sensor
  socket.on('sensorData', (data) => {
    document.getElementById('status').innerText = ``;
    if (data === '0') {
      count++;
      updateCount();
    }
  });
});

function startCounting() {
  socket.emit('startCounting');
}

function stopCounting() {
  socket.emit('stopCounting');
  showSummary();
}

function resetCounter() {
  socket.emit('resetCounter');
  count = 0;
  updateCount();
}

function exit() {
  socket.emit('stopCounting');
  window.location.href = "/"; // Redirigir a la página de inicio de sesión
}
