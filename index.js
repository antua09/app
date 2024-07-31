import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as SocketIOServer } from 'socket.io';
import { SerialPort, ReadlineParser } from 'serialport';

// Models
const UserSchema = new mongoose.Schema({
  user: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', UserSchema, 'usuarios'); // Especificar la colección 'usuarios'

// Fix para __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Server
const app = express();
app.set('port', 4000);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/usuarios', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
app.get('/', (req, res) => res.sendFile(__dirname + '/pages/login.html'));
app.get('/register', (req, res) => res.sendFile(__dirname + '/pages/register.html'));

app.post('/api/register', async (req, res) => {
  const { user, email, password } = req.body;
  const newUser = new User({ user, email, password });
  try {
    await newUser.save();
    res.json({ redirect: '/' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

app.get("/panel_control", (req, res) => {
  // Aquí puedes manejar el envío del nombre del usuario, por ejemplo, usando cookies o sesiones
  res.sendFile(__dirname + "/pages/panel_control.html");
});

app.get("/logout", (req, res) => {
  // Aquí puedes manejar el cierre de sesión, por ejemplo, eliminando la sesión del usuario
  res.redirect("/");
});

app.post('/api/login', async (req, res) => {
  const { user, password } = req.body;
  try {
    const foundUser = await User.findOne({ user, password });
    if (foundUser) {
      res.json({ redirect: '/panel_control', user: foundUser.user });
    } else {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Start server
const server = app.listen(app.get('port'), '0.0.0.0', () => {
  console.log('Servidor corriendo en puerto', app.get('port'));
});

// Socket.IO
const io = new SocketIOServer(server);

// Configuración del puerto serie
const port = new SerialPort({ path: 'COM1', baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (data) => {
  console.log('Data:', data);
  io.emit('sensorData', data.trim());
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
