/* ═══════════════════════════════════════════
   🌸 Ward Shop - Checkout and Cart Logic
   ═══════════════════════════════════════════ */

let allProducts = [];
let appliedCoupon = null;
let selectedPayment = 'cod'; // Default: Cash on delivery
let currentStep = 1;
let lastSavedOrder = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Set minimum date for delivery to today
  const dateInput = document.getElementById('deliveryDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Load products list
  allProducts = await loadProducts();

  // Initialize Cart Review
  initCartPage();
});

function initCartPage() {
  const items = Cart.getItems();
  const checkoutLayout = document.getElementById('checkoutLayout');
  const checkoutStepper = document.getElementById('checkoutStepper');
  const emptyCartState = document.getElementById('emptyCartState');

  if (items.length === 0) {
    if (checkoutLayout) checkoutLayout.style.display = 'none';
    if (checkoutStepper) checkoutStepper.style.display = 'none';
    if (emptyCartState) emptyCartState.classList.remove('hidden');
    return;
  }

  if (checkoutLayout) checkoutLayout.style.display = 'grid';
  if (checkoutStepper) checkoutStepper.style.display = 'flex';
  if (emptyCartState) emptyCartState.classList.add('hidden');

  renderCartItems();
  recalculateSummary();
}

function renderCartItems() {
  const cartItemsList = document.getElementById('cartItemsList');
  if (!cartItemsList) return;

  const items = Cart.getItems();
  
  cartItemsList.innerHTML = items.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    if (!product) return '';

    const optionsStr = [];
    if (item.options.color) optionsStr.push(`اللون: ${item.options.color}`);
    if (item.options.size) optionsStr.push(`الحجم: ${item.options.size}`);
    if (item.greeting) optionsStr.push(`الرسالة: "${item.greeting}"`);
    
    const detailsHtml = optionsStr.length > 0
      ? `<div class="item-details" style="margin-top: 0.25rem; font-size: 0.8rem; color: var(--color-text-light);">
           ${optionsStr.join(' | ')}
         </div>`
      : '';

    return `
      <div class="cart-item">
        <img src="${product.images[0]}" alt="${product.name}">
        <div class="cart-item-info">
          <div class="item-name">${product.name}</div>
          <div class="item-details" style="font-size: 0.85rem; color: var(--color-gold);">${product.category}</div>
          ${detailsHtml}
        </div>
        <div class="quantity-selector" style="margin-bottom: 0;">
          <button onclick="changeCartQty(${product.id}, -1)">−</button>
          <input type="number" value="${item.quantity}" min="1" max="${product.quantity}" readonly>
          <button onclick="changeCartQty(${product.id}, 1)">+</button>
        </div>
        <div class="cart-item-price">
          ${formatPrice(product.price * item.quantity)}
        </div>
        <button class="delete-btn" onclick="removeCartItem(${product.id})" title="حذف">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  }).join('');
}

function changeCartQty(productId, delta) {
  const items = Cart.getItems();
  const item = items.find(i => i.productId === productId);
  if (!item) return;

  const product = allProducts.find(p => p.id === productId);
  const maxStock = product ? product.quantity : 99;

  const newQty = item.quantity + delta;
  if (newQty >= 1 && newQty <= maxStock) {
    Cart.updateQuantity(productId, newQty);
    initCartPage();
  } else if (newQty > maxStock) {
    showToast(`الكمية المتاحة في المخزن هي ${maxStock} فقط`, 'warning');
  }
}

function removeCartItem(productId) {
  Cart.removeItem(productId);
  initCartPage();
}

function recalculateSummary() {
  const subtotal = Cart.getTotal(allProducts);
  const count = Cart.getCount();

  // Delivery: Free if subtotal >= 30, else 3 JOD
  const deliveryCost = subtotal >= 30 ? 0 : 3;

  // Coupon discount
  let discountAmount = 0;
  if (appliedCoupon) {
    const calc = Coupons.applyDiscount(appliedCoupon.code, subtotal);
    discountAmount = calc.discount;
  }

  const grandTotal = subtotal + deliveryCost - discountAmount;

  // Render elements
  const summaryCount = document.getElementById('summaryCount');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryDelivery = document.getElementById('summaryDelivery');
  const summaryTotal = document.getElementById('summaryTotal');

  if (summaryCount) summaryCount.textContent = `${count} منتجات`;
  if (summarySubtotal) summarySubtotal.textContent = formatPrice(subtotal);
  if (summaryDiscount) summaryDiscount.textContent = `-${formatPrice(discountAmount)}`;
  if (summaryDelivery) {
    summaryDelivery.textContent = deliveryCost === 0 ? 'مجاني' : formatPrice(deliveryCost);
    if (deliveryCost === 0) {
      summaryDelivery.style.color = 'var(--color-success)';
      summaryDelivery.style.fontWeight = 'bold';
    } else {
      summaryDelivery.style.color = '';
      summaryDelivery.style.fontWeight = '';
    }
  }
  if (summaryTotal) summaryTotal.textContent = formatPrice(grandTotal);
}

function applyCoupon() {
  const input = document.getElementById('couponCode');
  const msg = document.getElementById('couponMessage');
  if (!input || !msg) return;

  const code = input.value.trim().toUpperCase();
  if (!code) {
    msg.style.display = 'block';
    msg.style.color = 'var(--color-danger)';
    msg.textContent = 'الرجاء إدخال كود كوبون صالح';
    return;
  }

  const coupon = Coupons.validate(code);
  if (coupon) {
    appliedCoupon = coupon;
    msg.style.display = 'block';
    msg.style.color = 'var(--color-success)';
    msg.textContent = `تم تطبيق الكوبون (${coupon.discount}${coupon.type === 'percent' ? '%' : ' د.أ'} خصم) ✓`;
    recalculateSummary();
  } else {
    appliedCoupon = null;
    msg.style.display = 'block';
    msg.style.color = 'var(--color-danger)';
    msg.textContent = 'الكوبون غير صحيح أو منتهي الصلاحية';
    recalculateSummary();
  }
}

function selectPaymentMethod(element) {
  document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
  selectedPayment = element.dataset.method;

  const bankDetails = document.getElementById('bankDetails');
  const cardDetails = document.getElementById('cardDetails');

  if (selectedPayment === 'bank') {
    if (bankDetails) bankDetails.style.display = 'block';
    if (cardDetails) cardDetails.style.display = 'none';
  } else if (selectedPayment === 'card') {
    if (bankDetails) bankDetails.style.display = 'none';
    if (cardDetails) cardDetails.style.display = 'block';
  } else {
    if (bankDetails) bankDetails.style.display = 'none';
    if (cardDetails) cardDetails.style.display = 'none';
  }
}

function goToStep(step) {
  if (step === 2) {
    const items = Cart.getItems();
    if (items.length === 0) {
      showToast('سلتك فارغة! يرجى إضافة منتجات أولاً', 'error');
      return;
    }
  }

  currentStep = step;

  // Toggle step indicators
  document.querySelectorAll('.step').forEach((el, idx) => {
    const num = idx + 1;
    if (num < step) {
      el.classList.remove('active');
      el.classList.add('completed');
    } else if (num === step) {
      el.classList.add('active');
      el.classList.remove('completed');
    } else {
      el.classList.remove('active');
      el.classList.remove('completed');
    }
  });

  // Toggle step lines
  const line1 = document.getElementById('stepLine1');
  const line2 = document.getElementById('stepLine2');
  if (line1) {
    if (step > 1) line1.classList.add('completed');
    else line1.classList.remove('completed');
  }
  if (line2) {
    if (step > 2) line2.classList.add('completed');
    else line2.classList.remove('completed');
  }

  // Toggle step contents
  document.querySelectorAll('.step-content').forEach((el, idx) => {
    if (idx + 1 === step) el.classList.add('active');
    else el.classList.remove('active');
  });

  // Handle right summary sidebar visibility
  const summaryBlock = document.getElementById('checkoutSummary');
  if (summaryBlock) {
    if (step === 3) {
      summaryBlock.style.display = 'none';
      document.getElementById('checkoutLayout').style.gridTemplateColumns = '1fr';
    } else {
      summaryBlock.style.display = 'block';
      // Reset layout to 2 columns on desktop
      if (window.innerWidth > 768) {
        document.getElementById('checkoutLayout').style.gridTemplateColumns = '2fr 1fr';
      } else {
        document.getElementById('checkoutLayout').style.gridTemplateColumns = '1fr';
      }
    }
  }

  window.scrollTo(0, 0);
}

async function submitOrder() {
  const form = document.getElementById('checkoutForm');
  const nameInput = document.getElementById('custName');
  const phoneInput = document.getElementById('custPhone');
  const cityInput = document.getElementById('custCity');
  const dateInput = document.getElementById('deliveryDate');
  const timeSelect = document.getElementById('deliveryTime');

  let isValid = true;

  // Simple validation
  const validateField = (input) => {
    if (!input) return;
    if (!input.checkValidity()) {
      input.classList.add('error');
      isValid = false;
    } else {
      input.classList.remove('error');
    }
  };

  validateField(nameInput);
  validateField(phoneInput);
  validateField(cityInput);
  validateField(dateInput);
  validateField(timeSelect);

  // Custom Name and Phone Validation
  if (nameInput && nameInput.value.trim().length < 3) {
    nameInput.classList.add('error');
    isValid = false;
  }
  if (phoneInput) {
    const phoneVal = phoneInput.value.trim().replace(/\D/g, ''); // strip non-digits
    if (phoneVal.length < 9 || phoneVal.length > 15) {
      phoneInput.classList.add('error');
      isValid = false;
    }
  }

  if (!isValid) {
    showToast('يرجى تعبئة الحقول المطلوبة بشكل صحيح (الاسم 3 أحرف على الأقل، ورقم الهاتف صحيح)', 'error');
    return;
  }

  // Double check cart not empty
  const cartItems = Cart.getItems();
  if (cartItems.length === 0) {
    showToast('السلة فارغة', 'error');
    return;
  }

  // Calculations
  const subtotal = Cart.getTotal(allProducts);
  const deliveryCost = subtotal >= 30 ? 0 : 3;
  let discountAmount = 0;
  if (appliedCoupon) {
    const calc = Coupons.applyDiscount(appliedCoupon.code, subtotal);
    discountAmount = calc.discount;
  }
  const grandTotal = subtotal + deliveryCost - discountAmount;

  // Construct Order Object
  const orderObj = {
    customerName: nameInput.value.trim(),
    customerPhone: phoneInput.value.trim(),
    customerCity: cityInput.value.trim(),
    deliveryDate: dateInput.value,
    deliveryTime: timeSelect.value,
    orderNotes: document.getElementById('orderNotes')?.value.trim() || '',
    paymentMethod: selectedPayment,
    subtotal: subtotal,
    deliveryCost: deliveryCost,
    discount: discountAmount,
    total: grandTotal,
    couponCode: appliedCoupon ? appliedCoupon.code : null,
    items: cartItems.map(item => {
      const p = allProducts.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        name: p ? p.name : 'منتج غير معروف',
        price: p ? p.price : 0,
        quantity: item.quantity,
        greeting: item.greeting || '',
        options: item.options || {}
      };
    })
  };

  // Save order to Firestore/LocalStorage
  const saved = await Orders.save(orderObj);
  lastSavedOrder = saved;

  // Populate Receipt UI
  document.getElementById('receiptOrderId').textContent = saved.id;
  document.getElementById('receiptName').textContent = saved.customerName;
  document.getElementById('receiptPhone').textContent = saved.customerPhone;
  document.getElementById('receiptDate').textContent = `${saved.deliveryDate} (${saved.deliveryTime})`;
  document.getElementById('receiptTotal').textContent = formatPrice(saved.total);

  // Clear Cart
  Cart.clear();

  // Move to Step 3
  goToStep(3);
  showToast('تم تسجيل طلبك بنجاح! 🌸', 'success');
}

function openWhatsAppReceipt() {
  if (!lastSavedOrder) return;

  const paymentNames = {
    cod: 'الدفع عند الاستلام',
    card: 'بطاقة دفع (فيزا / ماستركارد)',
    bank: 'تحويل بنكي'
  };

  let message = `🌸 *طلب جديد من متجر وَرد* 🌸\n\n`;
  message += `*رقم الطلب:* ${lastSavedOrder.id}\n`;
  message += `*الاسم:* ${lastSavedOrder.customerName}\n`;
  message += `*الجوال:* ${lastSavedOrder.customerPhone}\n`;
  message += `*التوصيل إلى:* ${lastSavedOrder.customerCity}\n`;
  message += `*تاريخ ووقت التوصيل:* ${lastSavedOrder.deliveryDate} | ${lastSavedOrder.deliveryTime}\n`;
  message += `*طريقة الدفع:* ${paymentNames[lastSavedOrder.paymentMethod] || lastSavedOrder.paymentMethod}\n`;
  
  if (lastSavedOrder.orderNotes) {
    message += `*ملاحظات:* ${lastSavedOrder.orderNotes}\n`;
  }
  
  message += `\n*المنتجات:*\n`;
  lastSavedOrder.items.forEach(item => {
    message += `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})\n`;
    if (item.greeting) {
      message += `  _رسالة التهنئة:_ "${item.greeting}"\n`;
    }
  });

  message += `\n*مجموع المنتجات:* ${formatPrice(lastSavedOrder.subtotal)}\n`;
  if (lastSavedOrder.discount > 0) {
    message += `*خصم الكوبون (${lastSavedOrder.couponCode}):* -${formatPrice(lastSavedOrder.discount)}\n`;
  }
  message += `*التوصيل:* ${lastSavedOrder.deliveryCost === 0 ? 'مجاني' : formatPrice(lastSavedOrder.deliveryCost)}\n`;
  message += `*المجموع الكلي:* ${formatPrice(lastSavedOrder.total)}\n\n`;
  message += `شكرًا لكم، يرجى تأكيد الطلب والبدء في التجهيز.`;

  sendWhatsAppNotification(message);
}
