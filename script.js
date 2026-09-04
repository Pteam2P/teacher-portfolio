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

// ระบบจัดการและสลับรูปโปรไฟล์ (รองรับทั้ง .png, .jpg, .jpeg, .webp)
const profileBox = document.getElementById('profileBox');
const supportedExtensions = ['png', 'jpg', 'jpeg', 'webp'];

let primaryImageSrc = '';
let secondaryImageSrc = '';
let hasPrimary = false;
let hasSecondary = false;
let currentImageState = 1;

// ฟังก์ชันช่วยค้นหาไฟล์ภาพตามนามสกุลที่รองรับ
function detectImage(baseName) {
  return new Promise((resolve) => {
    let checkedCount = 0;
    let foundSrc = '';

    supportedExtensions.forEach((ext) => {
      const img = new Image();
      const testSrc = `images/${baseName}.${ext}`;
      img.src = testSrc;
      img.onload = () => {
        if (!foundSrc) {
          foundSrc = testSrc;
          resolve(foundSrc);
        }
      };
      img.onerror = () => {
        checkedCount++;
        if (checkedCount === supportedExtensions.length && !foundSrc) {
          resolve('');
        }
      };
    });
  });
}

// ตรวจหาไฟล์ profile และ profile-2
async function initProfileImages() {
  primaryImageSrc = await detectImage('profile');
  
  if (primaryImageSrc) {
    hasPrimary = true;
    profileBox.classList.add('has-image');
    profileBox.style.backgroundImage = `url("${primaryImageSrc}")`;

    secondaryImageSrc = await detectImage('profile-2');
    if (secondaryImageSrc) {
      hasSecondary = true;
      profileBox.classList.add('can-toggle');
    }
  }
}

initProfileImages();

// คลิกสลับรูปหากมีทั้ง 2 รูป
profileBox.addEventListener('click', () => {
  if (!hasPrimary || !hasSecondary) return;
  
  if (currentImageState === 1) {
    profileBox.style.backgroundImage = `url("${secondaryImageSrc}")`;
    currentImageState = 2;
  } else {
    profileBox.style.backgroundImage = `url("${primaryImageSrc}")`;
    currentImageState = 1;
  }
});
