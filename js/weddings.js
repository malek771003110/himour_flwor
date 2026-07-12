/* ═══════════════════════════════════════════
   🌸 Ward Shop - Wedding Page Logic
   ═══════════════════════════════════════════ */

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
  'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80',
  'https://images.unsplash.com/photo-1519225495810-7517c244ac5e?w=800&q=80',
  'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&q=80'
];

let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Set minimum date for bookings to today
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Render gallery
  renderGallery();

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});

function renderGallery() {
  const grid = document.getElementById('weddingsGallery');
  if (!grid) return;

  grid.innerHTML = GALLERY_IMAGES.map((img, idx) => `
    <div class="gallery-item fade-up" onclick="openLightbox(${idx})">
      <img src="${img}" alt="تزيين سيارة زفاف ${idx + 1}" loading="lazy">
    </div>
  `).join('');

  initScrollAnimations();
}

// ── Lightbox Actions ──
function openLightbox(index) {
  const lightbox = document.getElementById('galleryLightbox');
  const img = document.getElementById('lightboxImage');
  
  if (!lightbox || !img) return;

  currentImageIndex = index;
  img.src = GALLERY_IMAGES[currentImageIndex];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function nextLightboxImage() {
  currentImageIndex = (currentImageIndex + 1) % GALLERY_IMAGES.length;
  document.getElementById('lightboxImage').src = GALLERY_IMAGES[currentImageIndex];
}

function prevLightboxImage() {
  currentImageIndex = (currentImageIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  document.getElementById('lightboxImage').src = GALLERY_IMAGES[currentImageIndex];
}

// ── Select Package from card ──
function selectPackage(packageName) {
  const select = document.getElementById('bookPackage');
  if (select) {
    select.value = packageName;
  }
  
  const formSection = document.getElementById('booking');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// ── Submit Booking ──
async function submitBooking() {
  const nameInput = document.getElementById('bookName');
  const phoneInput = document.getElementById('bookPhone');
  const packageSelect = document.getElementById('bookPackage');
  const dateInput = document.getElementById('bookDate');
  const modelInput = document.getElementById('carModel');
  const timeInput = document.getElementById('bookTime');
  const notesText = document.getElementById('bookNotes');

  // Basic Validation
  if (!nameInput.value.trim() || !phoneInput.value.trim() || !packageSelect.value || !dateInput.value || !modelInput.value.trim() || !timeInput.value) {
    showToast('الرجاء تعبئة كافة الحقول المطلوبة', 'error');
    return;
  }

  // Custom Name and Phone Validation
  if (nameInput.value.trim().length < 3) {
    showToast('الرجاء إدخال اسم صحيح (3 أحرف على الأقل)', 'error');
    return;
  }
  const phoneVal = phoneInput.value.trim().replace(/\D/g, '');
  if (phoneVal.length < 9 || phoneVal.length > 15) {
    showToast('الرجاء إدخال رقم هاتف صحيح', 'error');
    return;
  }

  // Construct Booking Object
  const bookingObj = {
    customerName: nameInput.value.trim(),
    customerPhone: phoneInput.value.trim(),
    selectedPackage: packageSelect.value,
    eventDate: dateInput.value,
    carModel: modelInput.value.trim(),
    bookingTime: timeInput.value,
    notes: notesText ? notesText.value.trim() : ''
  };

  // Save Booking via global Bookings object in app.js
  const saved = await Bookings.save(bookingObj);

  // Form Reset
  document.getElementById('bookingForm').reset();

  showToast('تم إرسال طلب الحجز بنجاح! 💍', 'success');

  // Build and Send WhatsApp detail message
  let message = `💍 *حجز جديد لتجهيز سيارة زفاف* 💍\n\n`;
  message += `*رقم الحجز:* ${saved.id}\n`;
  message += `*الاسم:* ${saved.customerName}\n`;
  message += `*الجوال:* ${saved.customerPhone}\n`;
  message += `*الباقة المختارة:* ${saved.selectedPackage}\n`;
  message += `*تاريخ المناسبة:* ${saved.eventDate}\n`;
  message += `*وقت التجهيز:* ${saved.bookingTime}\n`;
  message += `*نوع وموديل السيارة:* ${saved.carModel}\n`;
  if (saved.notes) {
    message += `*ملاحظات:* ${saved.notes}\n`;
  }
  message += `\nيرجى تأكيد الحجز وتنسيق الموعد بالتفصيل مع العريس.`;

  // Delay opening WhatsApp slightly to allow Toast to display
  setTimeout(() => {
    sendWhatsAppNotification(message);
  }, 1000);
}
