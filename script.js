const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

// หากมีไฟล์ images/profile.jpg ระบบจะแสดงเป็นรูปประจำตัวอัตโนมัติ
const profileBox = document.querySelector('.profile-placeholder');
const profileImage = new Image();
profileImage.src = 'images/profile.jpg';
profileImage.onload = () => profileBox.classList.add('has-image');
