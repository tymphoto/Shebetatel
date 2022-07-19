const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const addForm = document.getElementById('addForm');
const userPosts = document.getElementById('userPosts');
const editForm = document.getElementById('editForm');

registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
  const response = await fetch('/register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    window.location.href = 'http://localhost:3000';
  } else {
    registerForm.insertAdjacentHTML('beforeend', `
    <p class="mt-3">Такой логин уже существует</p>
    `);
  }
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData);
  const response = await fetch('/login', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    window.location.href = 'http://localhost:3000';
  } else {
    loginForm.insertAdjacentHTML('beforeend', `
    <p class="mt-3">Неверный логин или пароль</p>
    `);
  }
});

addForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('/new', {
    method: 'post',
    body: new FormData(addForm),
  });
  window.location.href = 'http://localhost:3000';
});

userPosts?.addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.dataset.delete) {
    const id = e.target.dataset.delete;
    const div = document.getElementById(`div-${id}`);
    const response = await fetch(`/${id}`, {
      method: 'delete',
    });
    if (response.ok) {
      div.remove();
    }
  }
});

editForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = editForm.querySelector('button');
  const id = button.dataset.update;
  const response = await fetch(`/edit/${id}`, {
    method: 'put',
    body: new FormData(editForm),
  });
  if (response.ok) {
    window.location.href = 'http://localhost:3000/lk';
  }
});
