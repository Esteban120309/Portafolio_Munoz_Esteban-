document.addEventListener('DOMContentLoaded', () => {

  // 1. MODO OSCURO / CLARO
  const themeToggleBtn = document.getElementById('theme-toggle');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIcon = document.getElementById('theme-toggle-light-icon');

  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    lightIcon.classList.remove('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    darkIcon.classList.remove('hidden');
  }

  themeToggleBtn.addEventListener('click', () => {
    darkIcon.classList.toggle('hidden');
    lightIcon.classList.toggle('hidden');

    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
  });


  // 2. MENÚ MÓVIL
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });


  // 3. AÑO DINÁMICO
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  // 4. VALIDACIÓN ESTRICTA DEL CAMPO NOMBRE (SOLO LETRAS Y ESPACIOS)
  const nameInput = document.getElementById('name');
  const nameError = document.getElementById('name-error');
  const contactForm = document.getElementById('contact-form');

  // RegEx: Solo acepta letras (incluye acentos españoles y Ñ) y espacios
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  // Prevenir tipeo de números y símbolos en tiempo real
  nameInput.addEventListener('keydown', (e) => {
    const key = e.key;
    const isAllowedControlKey = [
      'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ].includes(key);

    if (isAllowedControlKey) return;

    // Denegar si la tecla presionada no es letra o espacio
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(key)) {
      e.preventDefault();
      showNameError(true);
    }
  });

  // Sanitización si pega texto con números/símbolos o escribe con métodos de entrada especiales
  nameInput.addEventListener('input', () => {
    // Eliminar todo lo que no sea letra o espacio
    const cleanValue = nameInput.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    
    if (nameInput.value !== cleanValue) {
      nameInput.value = cleanValue;
      showNameError(true);
    } else if (nameInput.value.trim() === '' || nameRegex.test(nameInput.value)) {
      showNameError(false);
    }
  });

  function showNameError(show) {
    if (show) {
      nameError.classList.remove('hidden');
      nameInput.classList.add('border-red-500', 'focus:ring-red-500');
      nameInput.classList.remove('border-gray-300', 'dark:border-gray-700', 'focus:ring-brand-500');
    } else {
      nameError.classList.add('hidden');
      nameInput.classList.remove('border-red-500', 'focus:ring-red-500');
      nameInput.classList.add('border-gray-300', 'dark:border-gray-700', 'focus:ring-brand-500');
    }
  }


  // 5. MANEJO Y ENVÍO DEL FORMULARIO DE CONTACTO
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameValue = nameInput.value.trim();
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formStatus = document.getElementById('form-status');

    let isValid = true;

    // Validar Nombre
    if (nameValue === '' || !nameRegex.test(nameValue)) {
      showNameError(true);
      nameInput.classList.add('invalid-shake');
      setTimeout(() => nameInput.classList.remove('invalid-shake'), 300);
      isValid = false;
    } else {
      showNameError(false);
    }

    // Validar Correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailError.classList.remove('hidden');
      emailInput.classList.add('border-red-500');
      isValid = false;
    } else {
      emailError.classList.add('hidden');
      emailInput.classList.remove('border-red-500');
    }

    // Validar Mensaje
    if (messageInput.value.trim() === '') {
      messageError.classList.remove('hidden');
      messageInput.classList.add('border-red-500');
      isValid = false;
    } else {
      messageError.classList.add('hidden');
      messageInput.classList.remove('border-red-500');
    }

    // Si todo está correcto
    if (isValid) {
      formStatus.classList.remove('hidden', 'bg-red-100', 'text-red-700');
      formStatus.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900/50', 'dark:text-green-300');
      formStatus.textContent = '¡Gracias! Tu mensaje ha sido enviado exitosamente.';

      contactForm.reset();

      setTimeout(() => {
        formStatus.classList.add('hidden');
      }, 5000);
    }
  });

});