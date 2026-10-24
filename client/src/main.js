const form = document.querySelector('#status-form');
const result = document.querySelector('#result');
const button = document.querySelector('#check-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  button.disabled = true;
  result.textContent = 'Загрузка...';
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    result.textContent =
      `Статус: ${data.status} | сервис: ${data.service} | ` +
      `версия: ${data.version} | время: ${data.timestamp}`;
  } catch (err) {
    result.textContent = 'Ошибка запроса: ' + err.message;
  } finally {
    button.disabled = false;
  }
});