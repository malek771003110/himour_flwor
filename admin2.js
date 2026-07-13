/* ═══════════════════════════════════════════
   🌸 Ward Shop - Admin Panel JavaScript
   ═══════════════════════════════════════════ */

let adminProducts = [];
let selectedOrderId = null;
let selectedBookingId = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Check if admin is logged in
  if (checkAdminLoggedIn()) {
    await showDashboard();
  } else {
    showLogin();
  }
});

// ── Auth Management ──
function checkAdminLoggedIn() {
  return localStorage.getItem('ward_admin_logged_in') === 'true';
}

function showLogin() {
  document.getElementById('adminLoginBlock').style.display = 'flex';
  document.getElementById('adminLayoutBlock').style.display = 'none';
}

async function showDashboard() {
  document.getElementById('adminLoginBlock').style.display = 'none';
  document.getElementById('adminLayoutBlock').style.display = 'flex';

  // Load products list into local array
  adminProducts = await loadProducts();

  // Load section data
  await loadOverviewData();
  await renderOrdersTable();
  renderProductsTable();
  await renderBookingsTable();
}

async function handleLogin() {
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value.trim();
  const errorMsg = document.getElementById('loginError');

  // If Firebase Auth is available
  if (window.auth) {
    try {
      const email = user.includes('@') ? user : `${user}@ward-shop.com`;
      await window.auth.signInWithEmailAndPassword(email, pass);
      localStorage.setItem('ward_admin_logged_in', 'true');
      if (errorMsg) errorMsg.style.display = 'none';
      await showDashboard();
      showToast('تم تسجيل الدخول بنجاح عبر Firebase ✓', 'success');
      return;
    } catch (firebaseErr) {
      console.warn("Firebase Auth failed, trying local fallback:", firebaseErr);
    }
  }

  if (user === STORE_CONFIG.adminUsername && pass === STORE_CONFIG.adminPassword) {
    localStorage.setItem('ward_admin_logged_in', 'true');
    if (errorMsg) errorMsg.style.display = 'none';
    await showDashboard();
    showToast('تم تسجيل الدخول بنجاح ✓', 'success');
  } else {
    if (errorMsg) {
      errorMsg.style.display = 'block';
      // Add shake animation to login card
      const card = document.querySelector('.login-card');
      if (card) {
        card.style.animation = 'none';
        setTimeout(() => card.style.animation = 'searchSlideDown 0.3s ease', 10);
      }
    }
    showToast('فشل تسجيل الدخول!', 'error');
  }
}

async function handleLogout() {
  if (window.auth) {
    try {
      await window.auth.signOut();
    } catch (e) {
      console.warn("Firebase Auth logout failed:", e);
    }
  }
  localStorage.removeItem('ward_admin_logged_in');
  showToast('تم تسجيل الخروج', 'info');
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

// ── Navigation ──
async function switchAdminSection(sectionName, linkElement) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
  
  // Show target section
  const targetSec = document.getElementById(`sec-${sectionName}`);
  if (targetSec) targetSec.classList.add('active');

  // Update navbar links active class
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  if (linkElement) {
    linkElement.classList.add('active');
  } else {
    // Find link manually by text or content
    const links = document.querySelectorAll('.sidebar-nav a');
    links.forEach(a => {
      if (a.textContent.includes(sectionName === 'overview' ? 'الرئيسية' : sectionName === 'orders' ? 'الطلبات' : sectionName === 'products' ? 'المنتجات' : 'حجوزات')) {
        a.classList.add('active');
      }
    });
  }

  // Update Header Title
  const titles = {
    overview: 'الرئيسية',
    orders: 'إدارة الطلبات',
    products: 'إدارة المنتجات',
    weddings: 'حجوزات الأعراس'
  };
  document.getElementById('adminSectionTitle').textContent = titles[sectionName] || 'لوحة التحكم';

  // If mobile, close sidebar
  const sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.remove('active');

  // Refresh data
  if (sectionName === 'overview') await loadOverviewData();
  else if (sectionName === 'orders') await renderOrdersTable();
  else if (sectionName === 'products') renderProductsTable();
  else if (sectionName === 'weddings') await renderBookingsTable();

  window.scrollTo(0, 0);
}

function toggleAdminSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.toggle('active');
}

// ── Overview Section Data ──
async function loadOverviewData() {
  const orders = await Orders.getAll();
  const bookings = await Bookings.getAll();

  // 1. Sales (delivered total)
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const salesTotal = deliveredOrders.reduce((total, o) => total + o.total, 0);
  document.getElementById('statSales').textContent = `${salesTotal} ${STORE_CONFIG.currency}`;

  // 2. Orders Count
  document.getElementById('statOrders').textContent = orders.length;

  // 3. Weddings Count
  document.getElementById('statWeddings').textContent = bookings.length;

  // 4. Out of stock products
  const outOfStockCount = adminProducts.filter(p => p.quantity <= 3).length;
  const oosElem = document.getElementById('statOutOfStock');
  oosElem.textContent = outOfStockCount;
  if (outOfStockCount > 0) {
    oosElem.parentElement.parentElement.style.border = '1px solid rgba(239, 68, 68, 0.3)';
  } else {
    oosElem.parentElement.parentElement.style.border = '';
  }

  // Render recent 5 orders
  renderRecentOrders(orders);
}

function renderRecentOrders(orders) {
  const tbody = document.getElementById('recentOrdersTbody');
  if (!tbody) return;

  const sortedRecent = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  if (sortedRecent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-text-light);">لا توجد طلبات مسجلة بعد.</td></tr>`;
    return;
  }

  const statusNames = {
    new: '<span class="status-badge status-new"><i class="fas fa-asterisk"></i> جديد</span>',
    processing: '<span class="status-badge status-processing"><i class="fas fa-spinner fa-spin"></i> قيد التجهيز</span>',
    delivered: '<span class="status-badge status-delivered"><i class="fas fa-check"></i> تم التوصيل</span>',
    cancelled: '<span class="status-badge status-cancelled"><i class="fas fa-ban"></i> ملغي</span>'
  };

  tbody.innerHTML = sortedRecent.map(o => `
    <tr>
      <td><strong style="font-family: monospace; color: var(--color-primary);">${o.id}</strong></td>
      <td>${o.customerName}</td>
      <td>${o.customerCity}</td>
      <td>${o.deliveryDate}</td>
      <td style="font-weight: 700;">${o.total} ${STORE_CONFIG.currency}</td>
      <td>${statusNames[o.status] || o.status}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" style="padding: 0.25rem 0.75rem;" onclick="openOrderDetails('${o.id}')">
          <i class="fas fa-eye"></i> عرض التفاصيل
        </button>
      </td>
    </tr>
  `).join('');
}

// ── Orders Section ──
async function renderOrdersTable() {
  const tbody = document.getElementById('ordersTbody');
  if (!tbody) return;

  const orders = await Orders.getAll();
  const filter = document.getElementById('orderStatusFilter')?.value || 'all';

  let filtered = [...orders];
  if (filter !== 'all') {
    filtered = filtered.filter(o => o.status === filter);
  }

  // Sort: newest first
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--color-text-light);">لا توجد طلبات تطابق الفلتر المحدد.</td></tr>`;
    return;
  }

  const statusNames = {
    new: '<span class="status-badge status-new">جديد</span>',
    processing: '<span class="status-badge status-processing">قيد التجهيز</span>',
    delivered: '<span class="status-badge status-delivered">تم التوصيل</span>',
    cancelled: '<span class="status-badge status-cancelled">ملغي</span>'
  };

  const paymentNames = {
    cod: 'عند الاستلام',
    card: 'بطاقة دفع (فيزا / ماستركارد)',
    bank: 'تحويل بنكي'
  };

  tbody.innerHTML = filtered.map(o => `
    <tr>
      <td><strong style="font-family: monospace; color: var(--color-primary);">${o.id}</strong></td>
      <td style="font-weight: 600;">${o.customerName}</td>
      <td><a href="tel:${o.customerPhone}" style="color: var(--color-primary);">${o.customerPhone}</a></td>
      <td>${o.customerCity}</td>
      <td>${o.deliveryDate} (${o.deliveryTime})</td>
      <td style="font-weight: 700; color: var(--color-primary);">${o.total} ${STORE_CONFIG.currency}</td>
      <td style="font-size: 0.8rem;">${paymentNames[o.paymentMethod] || o.paymentMethod}</td>
      <td>${statusNames[o.status] || o.status}</td>
      <td>
        <div style="display: flex; gap: 0.25rem;">
          <button class="btn btn-sm btn-outline-primary" style="padding: 0.25rem 0.5rem;" onclick="openOrderDetails('${o.id}')" title="تفاصيل">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm" style="background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 0.25rem 0.5rem;" onclick="quickUpdateOrderStatus('${o.id}', 'delivered')" title="تم التوصيل">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-sm" style="background: rgba(239, 68, 68, 0.08); color: #ef4444; padding: 0.25rem 0.5rem;" onclick="quickUpdateOrderStatus('${o.id}', 'cancelled')" title="إلغاء">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function quickUpdateOrderStatus(orderId, status) {
  await Orders.updateStatus(orderId, status);
  showToast(`تم تحديث حالة الطلب إلى: ${status === 'delivered' ? 'تم التوصيل' : 'ملغي'}`, 'success');
  await renderOrdersTable();
  await loadOverviewData();
}

async function openOrderDetails(orderId) {
  const order = await Orders.getById(orderId);
  if (!order) return;

  selectedOrderId = orderId;
  const modal = document.getElementById('adminOrderModal');
  const body = document.getElementById('orderModalBody');

  if (!modal || !body) return;

  const paymentNames = {
    cod: 'الدفع عند الاستلام',
    card: 'بطاقة دفع (فيزا / ماستركارد)',
    bank: 'تحويل بنكي'
  };

  const statusOpts = `
    <select id="modalOrderStatusSelect" class="form-control" style="width: auto; display: inline-block; margin-right: 0.5rem;" onchange="updateOrderDetailsStatus('${order.id}')">
      <option value="new" ${order.status === 'new' ? 'selected' : ''}>جديد</option>
      <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>قيد التجهيز</option>
      <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التوصيل</option>
      <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
    </select>
  `;

  let itemsHtml = order.items.map(item => `
    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px dotted rgba(0,0,0,0.05); font-size: 0.9rem;">
      <span>${item.name} <strong>x${item.quantity}</strong> ${item.greeting ? `<br><small style="color:var(--color-primary-light);">الرسالة: "${item.greeting}"</small>` : ''}</span>
      <span>${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
      <div>
        <h4 style="font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">معلومات العميل</h4>
        <div class="detail-row"><span>الاسم:</span> <strong>${order.customerName}</strong></div>
        <div class="detail-row"><span>الجوال:</span> <strong>${order.customerPhone}</strong></div>
        <div class="detail-row"><span>العنوان:</span> <strong>${order.customerCity}</strong></div>
        <div class="detail-row"><span>طريقة الدفع:</span> <strong>${paymentNames[order.paymentMethod] || order.paymentMethod}</strong></div>
      </div>
      <div>
        <h4 style="font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">تفاصيل التوصيل والموعد</h4>
        <div class="detail-row"><span>رقم الفاتورة:</span> <strong style="font-family: monospace;">${order.id}</strong></div>
        <div class="detail-row"><span>التاريخ المفضل:</span> <strong>${order.deliveryDate}</strong></div>
        <div class="detail-row"><span>الفترة المفضلة:</span> <strong>${order.deliveryTime}</strong></div>
        <div class="detail-row"><span>تاريخ تسجيل الطلب:</span> <strong>${new Date(order.date).toLocaleString('ar-JO')}</strong></div>
      </div>
    </div>
    
    <div class="form-group" style="background: #fafafa; padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(0,0,0,0.05);">
      <label><strong>حالة الطلب الحالية:</strong></label>
      ${statusOpts}
    </div>

    ${order.orderNotes ? `
      <div style="margin-bottom: 1.5rem; padding: 0.75rem 1rem; background: rgba(245, 158, 11, 0.05); border-right: 3px solid var(--color-warning); border-radius: var(--radius-sm);">
        <strong>ملاحظات العميل:</strong> ${order.orderNotes}
      </div>
    ` : ''}

    <h4 style="font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 0.25rem;">المنتجات المطلوبة</h4>
    <div style="margin-bottom: 1.5rem;">
      ${itemsHtml}
    </div>

    <div style="background: #fdfdfd; padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(0,0,0,0.03); max-width: 320px; margin-right: auto;">
      <div class="detail-row"><span>مجموع المنتجات:</span> <span>${formatPrice(order.subtotal)}</span></div>
      ${order.discount > 0 ? `<div class="detail-row" style="color:var(--color-danger);"><span>خصم الكوبون (${order.couponCode || ''}):</span> <span>-${formatPrice(order.discount)}</span></div>` : ''}
      <div class="detail-row"><span>تكلفة التوصيل:</span> <span>${order.deliveryCost === 0 ? 'مجاني' : formatPrice(order.deliveryCost)}</span></div>
      <div class="detail-row" style="font-size: 1.1rem; font-weight: bold; color: var(--color-primary); border-top: 2px solid rgba(200,67,106,0.1); padding-top: 0.5rem;">
        <span>المجموع الكلي:</span> <span>${formatPrice(order.total)}</span>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

async function updateOrderDetailsStatus(orderId) {
  const select = document.getElementById('modalOrderStatusSelect');
  if (select) {
    await Orders.updateStatus(orderId, select.value);
    showToast('تم حفظ حالة الطلب الجديدة', 'success');
    await renderOrdersTable();
    await loadOverviewData();
  }
}

function printInvoice() {
  if (!selectedOrderId) return;
  const content = document.getElementById('orderModalBody').innerHTML;
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة طلب ${selectedOrderId} - متجر وَرد</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
        body { font-family: 'Tajawal', sans-serif; padding: 30px; direction: rtl; text-align: right; color: #333; }
        .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #C8436A; padding-bottom: 15px; }
        .invoice-header h1 { color: #C8436A; font-size: 1.8rem; margin: 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        h4 { color: #C8436A; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        select { display: none !important; } /* Hide status select in print */
        label { display: none !important; }
        .no-print { display: none !important; }
        .btn, button { display: none !important; }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <h1>🌸 فاتورة مبيعات متجر وَرد 🌸</h1>
        <p>${STORE_CONFIG.address} | جوال: ${STORE_CONFIG.phone}</p>
      </div>
      ${content}
      <div style="text-align: center; margin-top: 50px; font-size: 0.85rem; color: #888; border-top: 1px dashed #ddd; padding-top: 15px;">
        شكرًا لشرائكم من متجرنا. نسعد بخدمتكم دائماً!
      </div>
      <script>
        setTimeout(() => {
          window.print();
          window.close();
        }, 300);
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function printOrdersList() {
  const content = document.getElementById('ordersTbody').innerHTML;
  const filterVal = document.getElementById('orderStatusFilter')?.value || 'all';
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>تقرير مبيعات متجر وَرد</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
        body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; text-align: right; }
        h1 { text-align: center; color: #C8436A; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ccc; padding: 10px; text-align: right; font-size: 0.85rem; }
        th { background-color: #f2f2f2; color: #333; }
        .status-badge { font-weight: bold; }
        button, div[style*="display: flex; gap: 0.25rem"] { display: none !important; } /* Hide action column buttons */
        th:last-child, td:last-child { display: none !important; } /* Hide option column */
      </style>
    </head>
    <body>
      <h1>تقرير المبيعات والطلبات (${filterVal === 'all' ? 'جميع الطلبات' : 'حالة: ' + filterVal})</h1>
      <p style="text-align: center; color: #666;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-JO')}</p>
      <table>
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>العميل</th>
            <th>الجوال</th>
            <th>المدينة / الحي</th>
            <th>تاريخ التوصيل</th>
            <th>المجموع</th>
            <th>طريقة الدفع</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${content}
        </tbody>
      </table>
      <script>
        setTimeout(() => {
          window.print();
          window.close();
        }, 300);
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// ── Wedding Bookings Section ──
async function renderBookingsTable() {
  const tbody = document.getElementById('bookingsTbody');
  if (!tbody) return;

  const bookings = await Bookings.getAll();
  const filter = document.getElementById('bookingStatusFilter')?.value || 'all';

  let filtered = [...bookings];
  if (filter !== 'all') {
    filtered = filtered.filter(b => b.status === filter);
  }

  // Sort: newest first
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--color-text-light);">لا توجد حجوزات تطابق الفلتر المحدد.</td></tr>`;
    return;
  }

  const statusNames = {
    pending: '<span class="status-badge status-processing">قيد الانتظار</span>',
    confirmed: '<span class="status-badge status-delivered">تم التأكيد</span>',
    completed: '<span class="status-badge status-delivered" style="background:rgba(34,197,94,0.2); color:#15803d;">تم التجهيز</span>',
    cancelled: '<span class="status-badge status-cancelled">ملغى</span>'
  };

  tbody.innerHTML = filtered.map(b => `
    <tr>
      <td><strong style="font-family: monospace; color: var(--color-primary);">${b.id}</strong></td>
      <td style="font-weight: 600;">${b.customerName}</td>
      <td><a href="tel:${b.customerPhone}" style="color: var(--color-primary);">${b.customerPhone}</a></td>
      <td>${b.carModel}</td>
      <td style="font-weight: 600; color: var(--color-gold-dark);">${b.selectedPackage}</td>
      <td>${b.eventDate} | <strong dir="ltr">${b.bookingTime}</strong></td>
      <td style="font-size: 0.8rem; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.notes || ''}">${b.notes || '<span style="color:#ccc;">لا يوجد</span>'}</td>
      <td>${statusNames[b.status] || b.status}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" style="padding: 0.25rem 0.5rem;" onclick="openBookingDetails('${b.id}')">
          <i class="fas fa-edit"></i> تفاصيل وتعديل
        </button>
      </td>
    </tr>
  `).join('');
}

async function openBookingDetails(bookingId) {
  const bookings = await Bookings.getAll();
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;

  selectedBookingId = bookingId;
  const modal = document.getElementById('adminBookingModal');
  const body = document.getElementById('bookingModalBody');

  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
      <div>
        <h4 style="font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">معلومات العريس</h4>
        <div class="detail-row"><span>رقم الحجز:</span> <strong style="font-family: monospace;">${booking.id}</strong></div>
        <div class="detail-row"><span>الاسم بالكامل:</span> <strong>${booking.customerName}</strong></div>
        <div class="detail-row"><span>رقم الجوال:</span> <strong>${booking.customerPhone}</strong></div>
        <div class="detail-row"><span>تاريخ تقديم الطلب:</span> <strong>${new Date(booking.date).toLocaleDateString('ar-JO')}</strong></div>
      </div>
      <div>
        <h4 style="font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">تفاصيل التزيين والسيارة</h4>
        <div class="detail-row"><span>الباقة المطلوبة:</span> <strong style="color:var(--color-gold-dark);">${booking.selectedPackage}</strong></div>
        <div class="detail-row"><span>نوع وموديل السيارة:</span> <strong>${booking.carModel}</strong></div>
        <div class="detail-row"><span>تاريخ التجهيز المطلوب:</span> <strong>${booking.eventDate}</strong></div>
        <div class="detail-row"><span>وقت البدء بالتجهيز:</span> <strong dir="ltr">${booking.bookingTime}</strong></div>
      </div>
    </div>

    ${booking.notes ? `
      <div style="margin-bottom: 1.5rem; padding: 0.75rem 1rem; background: rgba(245, 158, 11, 0.05); border-right: 3px solid var(--color-warning); border-radius: var(--radius-sm);">
        <strong>ملاحظات العميل الخاصة:</strong> ${booking.notes}
      </div>
    ` : ''}

    <div class="form-group">
      <label for="modalBookingStatusSelect"><strong>حالة حجز الموعد:</strong></label>
      <select id="modalBookingStatusSelect" class="form-control" style="width: auto; display: inline-block;">
        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>تم التأكيد</option>
        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>تم التجهيز</option>
        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>ملغى</option>
      </select>
    </div>

    <div class="form-group">
      <label for="modalBookingNotes"><strong>ملاحظات الإدارة الداخلية (تظهر للموظفين فقط):</strong></label>
      <textarea id="modalBookingNotes" class="form-control" style="min-height: 80px;" placeholder="اكتب أي ملاحظات للورشة، أو اتفاقيات خاصة بالألوان مع العريس...">${booking.notesInternal || ''}</textarea>
    </div>
  `;

  // Attach event to Save button
  const saveBtn = document.getElementById('btnSaveBookingChanges');
  if (saveBtn) {
    saveBtn.onclick = saveBookingDetailsChanges;
  }

  modal.classList.add('active');
}

async function saveBookingDetailsChanges() {
  if (!selectedBookingId) return;

  const statusSelect = document.getElementById('modalBookingStatusSelect');
  const internalNotes = document.getElementById('modalBookingNotes');

  if (statusSelect && internalNotes) {
    await Bookings.updateStatus(selectedBookingId, statusSelect.value);
    
    // Save internal note custom field
    const bookings = await Bookings.getAll();
    const booking = bookings.find(b => b.id === selectedBookingId);
    if (booking) {
      booking.notesInternal = internalNotes.value.trim();
      if (window.db) {
        try {
          await window.db.collection('bookings').doc(selectedBookingId).update({ notesInternal: booking.notesInternal });
        } catch (e) {
          console.warn("Firestore error updating booking internal notes:", e);
        }
      }
      localStorage.setItem(Bookings.KEY, JSON.stringify(bookings));
    }

    showToast('تم حفظ تغييرات حجز الزفاف بنجاح ✓', 'success');
    closeAdminModal('adminBookingModal');
    await renderBookingsTable();
    await loadOverviewData();
  }
}

// ── Products Management Section ──
function renderProductsTable() {
  const tbody = document.getElementById('productsTbody');
  if (!tbody) return;

  if (adminProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--color-text-light);">لا توجد منتجات مسجلة.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminProducts.map(p => `
    <tr>
      <td><img src="${p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600'}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: var(--radius-sm);"></td>
      <td style="font-weight: 600;">${p.name} <br><small style="color:var(--color-text-light); font-family: monospace;">${p.nameEn}</small></td>
      <td><span class="status-badge" style="background: rgba(212,168,83,0.1); color: var(--color-gold-dark);">${p.category}</span></td>
      <td style="font-weight: 700; color: var(--color-primary);">${p.price} ${STORE_CONFIG.currency}</td>
      <td style="color: var(--color-text-light); text-decoration: line-through;">${p.originalPrice > p.price ? p.originalPrice + ' ' + STORE_CONFIG.currency : '-'}</td>
      <td>
        <strong style="color: ${p.quantity <= 3 ? '#ef4444' : '#22c55e'}">${p.quantity} قطع</strong>
        ${p.quantity === 0 ? '<br><small class="text-danger">منتهي</small>' : ''}
      </td>
      <td><i class="fas fa-star text-gold"></i> ${p.rating} (${p.reviews})</td>
      <td>
        <div style="display: flex; gap: 0.25rem;">
          <button class="btn btn-sm btn-outline-primary" style="padding: 0.25rem 0.5rem;" onclick="openProductEditModal(${p.id})" title="تعديل">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm" style="background: rgba(239, 68, 68, 0.08); color: #ef4444; padding: 0.25rem 0.5rem;" onclick="deleteProduct(${p.id})" title="حذف">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function deleteProduct(id) {
  if (confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المتجر؟')) {
    adminProducts = adminProducts.filter(p => p.id !== id);
    if (window.db) {
      try {
        await window.db.collection('flowers').doc(id.toString()).delete();
      } catch (e) {
        console.warn("Firestore error deleting product:", e);
      }
    }
    localStorage.setItem('ward_products_db', JSON.stringify(adminProducts));
    showToast('تم حذف المنتج بنجاح', 'success');
    renderProductsTable();
    await loadOverviewData();
  }
}

function openProductAddModal() {
  document.getElementById('productForm').reset();
  document.getElementById('prodId').value = '';
  document.getElementById('prodIsFeatured').checked = false;
  document.getElementById('productModalTitle').innerHTML = '<i class="fas fa-plus"></i> إضافة منتج جديد';
  
  document.getElementById('adminProductModal').classList.add('active');
}

function openProductEditModal(id) {
  const product = adminProducts.find(p => p.id === id);
  if (!product) return;

  document.getElementById('prodId').value = product.id;
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodNameEn').value = product.nameEn;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodStock').value = product.quantity;
  document.getElementById('prodPrice').value = product.price;
  document.getElementById('prodOrigPrice').value = product.originalPrice;
  document.getElementById('prodImages').value = product.images.join('\n');
  document.getElementById('prodOccasions').value = product.occasions ? product.occasions.join(', ') : '';
  document.getElementById('prodRating').value = product.rating || 4.5;
  document.getElementById('prodColors').value = product.colors ? product.colors.join(', ') : '';
  document.getElementById('prodSizes').value = product.sizes ? product.sizes.join(', ') : '';
  document.getElementById('prodShortDesc').value = product.shortDesc;
  document.getElementById('prodFullDesc').value = product.fullDesc;
  document.getElementById('prodIsFeatured').checked = product.isFeatured || false;

  document.getElementById('productModalTitle').innerHTML = '<i class="fas fa-edit"></i> تعديل تفاصيل المنتج';
  document.getElementById('adminProductModal').classList.add('active');
}

async function saveProductData() {
  const idInput = document.getElementById('prodId').value;
  const name = document.getElementById('prodName').value.trim();
  const nameEn = document.getElementById('prodNameEn').value.trim();
  const category = document.getElementById('prodCategory').value;
  const stock = parseInt(document.getElementById('prodStock').value) || 0;
  const price = parseFloat(document.getElementById('prodPrice').value) || 0;
  const origPriceVal = parseFloat(document.getElementById('prodOrigPrice').value);
  const origPrice = isNaN(origPriceVal) ? price : origPriceVal;
  const imagesText = document.getElementById('prodImages').value.trim();
  const occasionsText = document.getElementById('prodOccasions').value.trim();
  const rating = parseFloat(document.getElementById('prodRating').value) || 4.5;
  const colorsText = document.getElementById('prodColors').value.trim();
  const sizesText = document.getElementById('prodSizes').value.trim();
  const shortDesc = document.getElementById('prodShortDesc').value.trim();
  const fullDesc = document.getElementById('prodFullDesc').value.trim();
  const isFeatured = document.getElementById('prodIsFeatured').checked;

  // Basic image url split logic
  const images = imagesText.split(/[\n,]+/).map(url => url.trim()).filter(url => url.length > 0);

  const occasions = occasionsText ? occasionsText.split(',').map(o => o.trim()).filter(o => o.length > 0) : [];
  const colors = colorsText ? colorsText.split(',').map(c => c.trim()).filter(c => c.length > 0) : [];
  const sizes = sizesText ? sizesText.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];

  let savedProd = null;

  if (idInput === '') {
    // Add Mode
    const newId = adminProducts.length > 0 ? Math.max(...adminProducts.map(p => p.id)) + 1 : 1;
    const newProd = {
      id: newId,
      name,
      nameEn,
      category,
      shortDesc,
      fullDesc,
      price,
      originalPrice: origPrice || price,
      discount: origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0,
      quantity: stock,
      images,
      occasions,
      rating,
      reviews: 0,
      isAvailable: stock > 0,
      isFeatured,
      colors,
      sizes,
      unitPrice: price,
      currentStock: stock,
      imageUrl: images.length > 0 ? images[0] : ''
    };

    adminProducts.push(newProd);
    savedProd = newProd;
    showToast('تمت إضافة المنتج بنجاح! 🌸', 'success');
  } else {
    // Edit Mode
    const prodId = parseInt(idInput);
    const prodIndex = adminProducts.findIndex(p => p.id === prodId);
    
    if (prodIndex > -1) {
      adminProducts[prodIndex] = {
        ...adminProducts[prodIndex],
        name,
        nameEn,
        category,
        shortDesc,
        fullDesc,
        price,
        originalPrice: origPrice,
        discount: origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0,
        quantity: stock,
        images,
        occasions,
        rating,
        isAvailable: stock > 0,
        isFeatured,
        colors,
        sizes,
        unitPrice: price,
        currentStock: stock,
        imageUrl: images.length > 0 ? images[0] : ''
      };
      savedProd = adminProducts[prodIndex];
      showToast('تم تحديث تفاصيل المنتج بنجاح ✓', 'success');
    }
  }

  if (savedProd && window.db) {
    try {
      await window.db.collection('flowers').doc(savedProd.id.toString()).set(savedProd, { merge: true });
    } catch (e) {
      console.warn("Firestore error saving/updating product:", e);
    }
  }

  // Save to LocalStorage DB
  localStorage.setItem('ward_products_db', JSON.stringify(adminProducts));
  closeAdminModal('adminProductModal');
  renderProductsTable();
  await loadOverviewData();
}

// ── Modals Common Closing ──
function closeAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// ── Image Upload Handling ──
function handleImageUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const progressDiv = document.getElementById('uploadProgress');
  const textarea = document.getElementById('prodImages');
  
  progressDiv.style.display = 'block';
  progressDiv.textContent = 'جاري معالجة الصور... يرجى الانتظار';

  let processed = 0;
  const results = [];

  Array.from(files).forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      // Compress via canvas
      const img = new Image();
      img.onload = function() {
        try {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          const MAX = 800;
          if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
          else if (h > w && h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
          else if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          results[index] = canvas.toDataURL('image/jpeg', 0.65);
        } catch (err) {
          // fallback: use raw base64 if canvas fails
          results[index] = e.target.result;
        }
        processed++;
        if (processed === files.length) {
          const existing = textarea.value.trim();
          const newUrls = results.filter(Boolean).join('\n');
          textarea.value = existing ? existing + '\n' + newUrls : newUrls;
          progressDiv.style.display = 'none';
          event.target.value = '';
          showToast('تمت معالجة الصور بنجاح ✓', 'success');
        }
      };
      img.onerror = function() {
        // If image can't be loaded just use raw data
        results[index] = e.target.result;
        processed++;
        if (processed === files.length) {
          const existing = textarea.value.trim();
          const newUrls = results.filter(Boolean).join('\n');
          textarea.value = existing ? existing + '\n' + newUrls : newUrls;
          progressDiv.style.display = 'none';
          event.target.value = '';
          showToast('تمت معالجة الصور ✓', 'success');
        }
      };
      img.src = e.target.result;
    };
    reader.onerror = function() {
      processed++;
      results[index] = null;
      if (processed === files.length) {
        progressDiv.style.display = 'none';
        showToast('فشل قراءة إحدى الصور', 'error');
      }
    };
    reader.readAsDataURL(file);
  });
}
