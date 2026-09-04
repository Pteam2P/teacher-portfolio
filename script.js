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

// ระบบจัดการและสลับรูปโปรไฟล์ (ลำดับความสำคัญ: png -> jpg -> jpeg -> webp)
const profileBox = document.getElementById('profileBox');
const supportedExtensions = ['png', 'jpg', 'jpeg', 'webp'];

let primaryImageSrc = '';
let secondaryImageSrc = '';
let hasPrimary = false;
let hasSecondary = false;
let currentImageState = 1;

// ฟังก์ชันตรวจสอบไฟล์ภาพแบบทีละไฟล์ตามลำดับ (Sequential Check)
function checkSingleImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}

async function findAvailableImage(baseName) {
  for (const ext of supportedExtensions) {
    const testSrc = `images/${baseName}.${ext}`;
    const exists = await checkSingleImage(testSrc);
    if (exists) {
      return testSrc;
    }
  }
  return '';
}

// โหลดรูปโปรไฟล์และตั้งค่าการสลับรูป
async function initProfileImages() {
  if (!profileBox) return;

  primaryImageSrc = await findAvailableImage('profile');
  
  if (primaryImageSrc) {
    hasPrimary = true;
    profileBox.classList.add('has-image');
    profileBox.style.backgroundImage = `url("${primaryImageSrc}")`;

    secondaryImageSrc = await findAvailableImage('profile-2');
    if (secondaryImageSrc) {
      hasSecondary = true;
      profileBox.classList.add('can-toggle');
    }
  }
}

initProfileImages();

// สลับรูปเมื่อคลิก
if (profileBox) {
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
}
