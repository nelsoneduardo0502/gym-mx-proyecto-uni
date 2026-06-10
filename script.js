const capacityRange = document.getElementById('capacityRange');
const peopleCount = document.getElementById('peopleCount');
const heroPeople = document.getElementById('heroPeople');
const occupationLabel = document.getElementById('occupationLabel');
const trafficLight = document.getElementById('trafficLight');
const clientTable = document.getElementById('clientTable');
const addClientBtn = document.getElementById('addClientBtn');
const machineList = document.getElementById('machineList');
const generateTip = document.getElementById('generateTip');
const smartRecommendation = document.getElementById('smartRecommendation');
const openQrBtn = document.getElementById('openQrBtn');
const closeQrBtn = document.getElementById('closeQrBtn');
const qrModal = document.getElementById('qrModal');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

const defaultClients = [
  { name: 'Juan Pérez', plan: 'Premium', attendance: 'Alta', status: 'Activo' },
  { name: 'María López', plan: 'Básica', attendance: 'Media', status: 'Activo' },
  { name: 'Carlos Ramírez', plan: 'Estudiante', attendance: 'Baja', status: 'Riesgo' },
  { name: 'Ana Torres', plan: 'Premium', attendance: 'Alta', status: 'Activo' },
  { name: 'Luis Gómez', plan: 'Básica', attendance: 'Baja', status: 'Seguimiento' }
];

const demoNames = ['Sofía Herrera', 'Diego Morales', 'Valeria Cruz', 'Andrés Rivera', 'Fernanda Silva'];
let demoIndex = 0;

const machines = [
  { name: 'Caminadora 2', use: 92, status: 'Revisión urgente' },
  { name: 'Polea alta', use: 78, status: 'Programar mantenimiento' },
  { name: 'Bicicleta 4', use: 61, status: 'Uso estable' },
  { name: 'Prensa de pierna', use: 84, status: 'Lubricación sugerida' }
];

const tips = [
  'El horario de 8:00 p.m. está cerca de saturación. Se recomienda promover asistencia a las 5:00 p.m. o 9:30 p.m.',
  'Hay clientes con baja asistencia. Se recomienda enviar recordatorio automático y una promoción de renovación.',
  'La caminadora 2 tiene uso elevado. Conviene programar revisión antes de que genere fallas.',
  'Las membresías Premium tienen mejor retención. Se recomienda ofrecer upgrade a usuarios frecuentes.',
  'El horario de 6:00 a.m. tiene baja ocupación. Se puede lanzar una promoción matutina.'
];

function getClients() {
  const saved = localStorage.getItem('gymcontrol_clients');
  return saved ? JSON.parse(saved) : defaultClients;
}

function saveClients(clients) {
  localStorage.setItem('gymcontrol_clients', JSON.stringify(clients));
}

function statusClass(status) {
  if (status === 'Activo') return 'ok';
  if (status === 'Seguimiento') return 'warn';
  return 'danger';
}

function renderClients() {
  const clients = getClients();
  clientTable.innerHTML = clients.map(client => `
    <tr>
      <td>${client.name}</td>
      <td>${client.plan}</td>
      <td>${client.attendance}</td>
      <td><span class="badge ${statusClass(client.status)}">${client.status}</span></td>
    </tr>
  `).join('');

  document.getElementById('membershipCount').textContent = clients.length + 123;
  document.getElementById('riskCount').textContent = clients.filter(c => c.status !== 'Activo').length + 5;
}

function renderMachines() {
  machineList.innerHTML = machines.map(machine => `
    <div class="machine-item">
      <div>
        <strong>${machine.name}</strong>
        <small>${machine.use}% uso</small>
      </div>
      <div class="progress"><span style="--w:${machine.use}%"></span></div>
      <small>${machine.status}</small>
    </div>
  `).join('');
}

function updateCapacity(value) {
  const people = Number(value);
  peopleCount.textContent = people;
  heroPeople.textContent = people;

  trafficLight.classList.remove('low', 'medium', 'high');

  if (people <= 30) {
    trafficLight.classList.add('low');
    occupationLabel.textContent = 'Ocupación baja';
  } else if (people <= 58) {
    trafficLight.classList.add('medium');
    occupationLabel.textContent = 'Ocupación media';
  } else {
    trafficLight.classList.add('high');
    occupationLabel.textContent = 'Ocupación alta';
  }
}

capacityRange.addEventListener('input', event => {
  updateCapacity(event.target.value);
});

addClientBtn.addEventListener('click', () => {
  const clients = getClients();
  const name = demoNames[demoIndex % demoNames.length];
  demoIndex++;

  clients.unshift({
    name,
    plan: demoIndex % 2 === 0 ? 'Premium' : 'Básica',
    attendance: demoIndex % 3 === 0 ? 'Baja' : 'Media',
    status: demoIndex % 3 === 0 ? 'Seguimiento' : 'Activo'
  });

  saveClients(clients.slice(0, 8));
  renderClients();
});

generateTip.addEventListener('click', () => {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  smartRecommendation.textContent = randomTip;
});

openQrBtn.addEventListener('click', () => {
  qrModal.classList.add('show');
  qrModal.setAttribute('aria-hidden', 'false');
});

closeQrBtn.addEventListener('click', () => {
  qrModal.classList.remove('show');
  qrModal.setAttribute('aria-hidden', 'true');
});

qrModal.addEventListener('click', event => {
  if (event.target === qrModal) {
    qrModal.classList.remove('show');
    qrModal.setAttribute('aria-hidden', 'true');
  }
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('show'));
});

renderClients();
renderMachines();
updateCapacity(capacityRange.value);

// Animación al tocar tarjetas en celular/tablet
const interactiveCards = document.querySelectorAll('.feature-card, .zachman-grid article');

function animateCardTap(card, clientX, clientY) {
  const rect = card.getBoundingClientRect();
  const x = clientX ? clientX - rect.left : rect.width / 2;
  const y = clientY ? clientY - rect.top : rect.height / 2;

  card.style.setProperty('--tap-x', `${x}px`);
  card.style.setProperty('--tap-y', `${y}px`);

  card.classList.remove('is-tapped');
  void card.offsetWidth; // reinicia la animación aunque toques rápido varias veces
  card.classList.add('is-tapped');

  if ('vibrate' in navigator) {
    navigator.vibrate(18); // vibración ligera en Android; en iPhone puede no activarse
  }

  clearTimeout(card.tapTimer);
  card.tapTimer = setTimeout(() => {
    card.classList.remove('is-tapped');
  }, 700);
}

interactiveCards.forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');

  card.addEventListener('pointerdown', event => {
    animateCardTap(card, event.clientX, event.clientY);
  });

  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      animateCardTap(card);
    }
  });
});
