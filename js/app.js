/* ═══════════════════════════════════════════
   💐 Eshq Haymour - Core Application JS
   ═══════════════════════════════════════════ */

// ── Store Configuration ──
const STORE_CONFIG = {
  name: 'عشق حيمور',
  nameEn: 'Eshq Haymour',
  phone: '+962771003110',
  whatsapp: '962771003110',
  email: 'himour.mk@gmail.com',
  address: 'عمان، الأردن',
  currency: 'د.أ',
  mapLink: 'https://maps.app.goo.gl/ZxCykxWMk4LZY2TZ8?g_st=ic',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.748366050519!2d35.92091837593256!3d31.950618026116896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca261b0c00001%3A0x675306644485590b!2sRainbow%20St.%2C%20Amman%2C%20Jordan!5e0!3m2!1sen!2sjo!4v1719412345678!5m2!1sen!2sjo',
  adminUsername: 'himour',
  adminPassword: 'openopen'
};

let productsData = [];

const DEFAULT_PRODUCTS = [
  {
    "id": 1,
    "name": "باقة الحب الأبدي",
    "nameEn": "Eternal Love Bouquet",
    "category": "باقات ورد",
    "shortDesc": "باقة ورد أحمر فاخرة مع لمسات من الجيبسوفيلا البيضاء",
    "fullDesc": "باقة رومانسية ساحرة تتكون من 25 وردة جورية حمراء طازجة، مزينة بأغصان الجيبسوفيلا البيضاء الناعمة وأوراق اليوكاليبتوس الخضراء. مغلفة بورق كرافت فاخر وربطة ساتان ذهبية. مثالية للتعبير عن الحب والمشاعر العميقة.",
    "price": 199,
    "originalPrice": 249,
    "discount": 20,
    "quantity": 15,
    "images": [
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600",
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600",
      "https://images.unsplash.com/photo-1494336956603-39a3f0e3e160?w=600"
    ],
    "occasions": ["عيد ميلاد", "عرس", "يوم الأم"],
    "rating": 4.8,
    "reviews": 124,
    "isAvailable": true,
    "isFeatured": true,
    "colors": ["أحمر", "وردي"],
    "sizes": ["صغيرة", "وسط", "كبيرة"]
  },
  {
    "id": 2,
    "name": "باقة أنفاس الربيع",
    "nameEn": "Spring Breeze Bouquet",
    "category": "باقات ورد",
    "shortDesc": "باقة ملونة من زهور الربيع المتنوعة بألوان زاهية",
    "fullDesc": "باقة مبهجة تجمع بين أجمل زهور الربيع: التوليب، النرجس، الأقحوان، والأستر بألوان متنوعة تبعث البهجة في النفس. مغلفة بورق شفاف أنيق مع شريطة من الدانتيل. خيار مثالي لإسعاد من تحب.",
    "price": 149,
    "originalPrice": 149,
    "discount": 0,
    "quantity": 22,
    "images": [
      "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600",
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600",
      "https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=600"
    ],
    "occasions": ["عيد ميلاد", "تخرج", "يوم الأم"],
    "rating": 4.6,
    "reviews": 89,
    "isAvailable": true,
    "isFeatured": true,
    "colors": ["ملون"],
    "sizes": ["وسط", "كبيرة"]
  },
  {
    "id": 3,
    "name": "باقة الأناقة الملكية",
    "nameEn": "Royal Elegance Bouquet",
    "category": "باقات ورد",
    "shortDesc": "باقة فاخرة من الورد الأبيض والبنفسجي مع لمسات ذهبية",
    "fullDesc": "باقة ملكية فاخرة تتكون من 30 وردة بيضاء وبنفسجية، مزينة بأغصان اللافندر وأوراق الفضة المذهبة. مغلفة بصندوق مخملي أسود فاخر مع ختم ذهبي. تعبير عن الذوق الرفيع والفخامة.",
    "price": 349,
    "originalPrice": 399,
    "discount": 13,
    "quantity": 8,
    "images": [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600",
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600"
    ],
    "occasions": ["عرس", "يوم الأم"],
    "rating": 4.9,
    "reviews": 67,
    "isAvailable": true,
    "isFeatured": true,
    "colors": ["أبيض", "بنفسجي"],
    "sizes": ["كبيرة", "فاخرة"]
  },
  {
    "id": 4,
    "name": "باقة السعادة الوردية",
    "nameEn": "Pink Happiness Bouquet",
    "category": "باقات ورد",
    "shortDesc": "باقة رقيقة من الورد الوردي بدرجاته المختلفة",
    "fullDesc": "باقة ساحرة من 20 وردة وردية بدرجات متعددة من الفاتح إلى الداكن، مزينة بأغصان الفريزيا العطرة وأوراق الروسكاس. مغلفة بورق وردي شفاف وشريط ساتان أبيض. تنشر البهجة والسرور.",
    "price": 179,
    "originalPrice": 179,
    "discount": 0,
    "quantity": 18,
    "images": [
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600",
      "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600",
      "https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=600"
    ],
    "occasions": ["عيد ميلاد", "تخرج", "يوم الأم"],
    "rating": 4.7,
    "reviews": 95,
    "isAvailable": true,
    "isFeatured": true,
    "colors": ["وردي فاتح", "وردي داكن"],
    "sizes": ["صغيرة", "وسط"]
  },
  {
    "id": 5,
    "name": "وردة جورية حمراء مفردة",
    "nameEn": "Single Red Rose",
    "category": "ورود منفردة",
    "shortDesc": "وردة جورية حمراء واحدة بساق طويل في صندوق أنيق",
    "fullDesc": "وردة جورية حمراء واحدة بساق طويل (60 سم)، معبأة في صندوق شفاف أنيق مع رسالة تهنئة مطبوعة. تمثل رمز الحب الخالص. تأتي مع شريط ساتان أحمر وبطاقة تهنئة.",
    "price": 35,
    "originalPrice": 35,
    "discount": 0,
    "quantity": 50,
    "images": [
      "https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=600",
      "https://images.unsplash.com/photo-1518882906600-c5ec2ad69cbd?w=600"
    ],
    "occasions": ["عيد ميلاد", "عرس"],
    "rating": 4.5,
    "reviews": 203,
    "isAvailable": true,
    "isFeatured": false,
    "colors": ["أحمر"],
    "sizes": []
  },
  {
    "id": 6,
    "name": "ورد أبيض - 10 حبات",
    "nameEn": "White Roses - 10 stems",
    "category": "ورود منفردة",
    "shortDesc": "عشر وردات بيضاء نقية مثالية للمناسبات الرسمية",
    "fullDesc": "مجموعة من 10 وردات بيضاء نقية بسيقان طويلة، مغلفة بسيلوفان شفاف وشريط ساتان أبيض. الورد الأبيض يرمز للنقاء والسلام. مناسبة للمناسبات الرسمية وحفلات الاستقبال والتعازي.",
    "price": 89,
    "originalPrice": 110,
    "discount": 19,
    "quantity": 30,
    "images": [
      "https://images.unsplash.com/photo-1558652093-2290e2e35eba?w=600",
      "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600"
    ],
    "occasions": ["تعزية", "عرس"],
    "rating": 4.6,
    "reviews": 78,
    "isAvailable": true,
    "isFeatured": true,
    "colors": ["أبيض"],
    "sizes": []
  },
  {
    "id": 7,
    "name": "باقة ورد مجفف طبيعي",
    "nameEn": "Dried Flower Bouquet",
    "category": "ورود منفردة",
    "shortDesc": "باقة ورد مجفف طبيعي تدوم لسنوات بألوان خريفية",
    "fullDesc": "باقة فنية من الأزهار المجففة الطبيعية تشمل اللافندر المجفف، القمح، زهور القطن، وأعشاب بامباس. تدوم لسنوات دون عناية خاصة. مثالية كقطعة ديكور فاخرة أو هدية مميزة لا تذبل.",
    "price": 129,
    "originalPrice": 159,
    "discount": 19,
    "quantity": 12,
    "images": [
      "https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=600",
      "https://images.unsplash.com/photo-1595434091143-b375ced64c5e?w=600"
    ],
    "occasions": ["عيد ميلاد", "تخرج"],
    "rating": 4.4,
    "reviews": 56,
    "isAvailable": true,
    "isFeatured": false,
    "colors": ["طبيعي"],
    "sizes": ["وسط", "كبيرة"]
  },
  {
    "id": 8,
    "name": "صندوق الورد والشوكولاتة",
    "nameEn": "Rose & Chocolate Box",
    "category": "هدايا",
    "shortDesc": "صندوق فاخر يجمع بين الورد البلغاري والشوكولاتة السويسرية",
    "fullDesc": "صندوق هدية فاخر مغلف بالمخمل الأسود يحتوي على 12 وردة حمراء بلغارية طازجة مرتبة بشكل دائري حول مجموعة من أرقى أنواع الشوكولاتة السويسرية (16 قطعة). هدية مثالية تجمع بين الرومانسية والرفاهية.",
    "price": 259,
    "originalPrice": 299,
    "discount": 13,
    "quantity": 10,
    "images": [
      "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=600",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600"
    ],
    "occasions": ["عيد ميلاد", "عرس", "يوم الأم"],
    "rating": 4.9,
    "reviews": 145,
    "isAvailable": true,
    "isFeatured": true,
    "colors": ["أحمر", "وردي"],
    "sizes": []
  },
  {
    "id": 9,
    "name": "سلة الورد والفواكه الطازجة",
    "nameEn": "Flower & Fruit Basket",
    "category": "هدايا",
    "shortDesc": "سلة أنيقة من الورد الطازج والفواكه الموسمية الفاخرة",
    "fullDesc": "سلة خوص مزينة تحتوي على تشكيلة من الورد الطازج (لون حسب الاختيار) مع فواكه موسمية فاخرة: فراولة، عنب، كيوي، وتفاح أخضر. مغلفة بسيلوفان شفاف مع شريط ساتان. هدية صحية وأنيقة.",
    "price": 219,
    "originalPrice": 219,
    "discount": 0,
    "quantity": 7,
    "images": [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600",
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600"
    ],
    "occasions": ["عيد ميلاد", "يوم الأم"],
    "rating": 4.7,
    "reviews": 63,
    "isAvailable": true,
    "isFeatured": false,
    "colors": ["ملون"],
    "sizes": ["وسط", "كبيرة"]
  },
  {
    "id": 10,
    "name": "نبتة السكولنت في إناء سيراميك",
    "nameEn": "Succulent in Ceramic Pot",
    "category": "نباتات",
    "shortDesc": "نبتة سكولنت صغيرة في إناء سيراميك مصمم يدوياً",
    "fullDesc": "نبتة سكولنت (عصارية) طبيعية في إناء سيراميك مصنوع يدوياً بتصميم عصري. لا تحتاج عناية كثيرة - فقط ري خفيف مرة أسبوعياً. مثالية للمكاتب وزوايا المنزل. تأتي في عدة ألوان للإناء.",
    "price": 69,
    "originalPrice": 69,
    "discount": 0,
    "quantity": 35,
    "images": [
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600"
    ],
    "occasions": ["عيد ميلاد", "تخرج"],
    "rating": 4.3,
    "reviews": 42,
    "isAvailable": true,
    "isFeatured": false,
    "colors": ["أبيض", "رمادي", "أخضر"],
    "sizes": []
  },
  {
    "id": 11,
    "name": "نبتة البوتس المتسلقة",
    "nameEn": "Pothos Hanging Plant",
    "category": "نباتات",
    "shortDesc": "نبتة بوتس متسلقة في أصيص معلق مع حامل مكرمية",
    "fullDesc": "نبتة بوتس (لبلاب الشيطان) متسلقة في أصيص بلاستيكي أنيق مع حامل مكرمية مصنوع يدوياً. نبتة داخلية سهلة العناية تنقي الهواء وتضيف لمسة طبيعية ساحرة. طول النبتة حوالي 40 سم.",
    "price": 89,
    "originalPrice": 99,
    "discount": 10,
    "quantity": 20,
    "images": [
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600"
    ],
    "occasions": ["عيد ميلاد", "تخرج"],
    "rating": 4.5,
    "reviews": 38,
    "isAvailable": true,
    "isFeatured": false,
    "colors": [],
    "sizes": ["صغيرة", "وسط"]
  },
  {
    "id": 12,
    "name": "ورق تغليف فاخر مع شرائط",
    "nameEn": "Premium Gift Wrapping Set",
    "category": "إكسسوارات",
    "shortDesc": "طقم تغليف هدايا فاخر يحتوي على ورق وشرائط وبطاقات",
    "fullDesc": "طقم تغليف هدايا فاخر يتضمن: 5 أوراق تغليف بتصاميم متنوعة (ورود، ذهبي، فضي)، 3 شرائط ساتان بألوان مختلفة، 5 بطاقات تهنئة مع مظاريف، و10 ملصقات ذهبية. كل ما تحتاجه لتقديم هدية أنيقة.",
    "price": 45,
    "originalPrice": 55,
    "discount": 18,
    "quantity": 3,
    "images": [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600",
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600"
    ],
    "occasions": ["عيد ميلاد", "عرس", "تخرج", "يوم الأم"],
    "rating": 4.2,
    "reviews": 31,
    "isAvailable": true,
    "isFeatured": false,
    "colors": ["ذهبي", "فضي", "وردي"],
    "sizes": []
  }
];

// ── Load Products ──
async function loadProducts() {
  if (window.db) {
    try {
      const snapshot = await window.db.collection('flowers').get();
      const products = [];
      snapshot.forEach(doc => {
        let data = doc.data();
        products.push({
          id: doc.id,
          name: data.name || '',
          nameEn: data.nameEn || data.name || '',
          category: data.category || 'باقات ورد',
          shortDesc: data.shortDesc || data.notes || `ورد ${data.color || ''} جميل`,
          fullDesc: data.fullDesc || data.notes || `ورد ${data.color || ''} جميل جداً ومناسب لجميع المناسبات`,
          price: data.price !== undefined ? data.price : (data.unitPrice || 0),
          originalPrice: data.originalPrice !== undefined ? data.originalPrice : (data.unitPrice || 0),
          discount: data.discount || 0,
          quantity: data.quantity !== undefined ? data.quantity : (data.currentStock || 10),
          images: data.images && data.images.length > 0 ? data.images : (data.imageUrl ? [data.imageUrl] : ["https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600"]),
          occasions: data.occasions || [],
          rating: data.rating || 5.0,
          reviews: data.reviews || 0,
          isAvailable: data.quantity !== undefined ? data.quantity > 0 : ((data.currentStock || 0) > 0),
          isFeatured: data.isFeatured !== undefined ? data.isFeatured : true,
          colors: data.colors || (data.color ? [data.color] : []),
          sizes: data.sizes || ["وسط"]
        });
      });
      if (products.length > 0) {
        productsData = products;
        localStorage.setItem('ward_products_db', JSON.stringify(productsData));
        return productsData;
      } else {
        console.log("Firestore flowers collection is empty. Seeding defaults...");
        let defaultProds = [];
        for (let i = 1; i <= 3; i++) {
          try {
            let response = await fetch('products_' + i + '.json');
            if (response.ok) {
              let chunk = await response.json();
              defaultProds = defaultProds.concat(chunk);
            }
          } catch(e) { console.warn('Could not load chunk ' + i); }
        }
        for (const prod of defaultProds) {
          // add default products into flowers with mapping
          let fProd = {
            ...prod,
            unitPrice: prod.price,
            currentStock: prod.quantity,
            imageUrl: prod.images[0] || '',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          await window.db.collection('flowers').doc(prod.id.toString()).set(fProd);
        }
        productsData = defaultProds;
        localStorage.setItem('ward_products_db', JSON.stringify(productsData));
        return productsData;
      }
    } catch (firebaseErr) {
      console.warn("Firestore error, falling back to local database:", firebaseErr);
    }
  }

  try {
    const cached = localStorage.getItem('ward_products_db');
    if (cached) {
      productsData = JSON.parse(cached);
      return productsData;
    }

    productsData = [];
    for (let i = 1; i <= 3; i++) {
      try {
        let response = await fetch('products_' + i + '.json');
        if (response.ok) {
          let chunk = await response.json();
          productsData = productsData.concat(chunk);
        }
      } catch(e) { console.warn('Could not load chunk ' + i); }
    }
    localStorage.setItem('ward_products_db', JSON.stringify(productsData));
    return productsData;
  } catch (e) {
    console.warn('CORS or network error loading products.json. Falling back on default hardcoded products list.');
    productsData = [...DEFAULT_PRODUCTS];
    localStorage.setItem('ward_products_db', JSON.stringify(productsData));
    return productsData;
  }
}

// ── Cart Management ──
const Cart = {
  KEY: 'ward_cart',

  getItems() {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  },

  saveItems(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  addItem(productId, quantity = 1, greeting = '', options = {}) {
    const items = this.getItems();
    const existing = items.find(item => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
      if (greeting) existing.greeting = greeting;
      if (options && Object.keys(options).length > 0) {
        existing.options = { ...(existing.options || {}), ...options };
      }
    } else {
      items.push({ productId, quantity, greeting, options: options || {}, addedAt: Date.now() });
    }

    this.saveItems(items);
    showToast('تمت إضافة المنتج إلى السلة ✓', 'success');
    return items;
  },

  removeItem(productId) {
    let items = this.getItems();
    items = items.filter(item => item.productId !== productId);
    this.saveItems(items);
    showToast('تم حذف المنتج من السلة', 'info');
    return items;
  },

  updateQuantity(productId, quantity) {
    const items = this.getItems();
    const item = items.find(i => i.productId === productId);
    if (item) {
      if (quantity <= 0) {
        return this.removeItem(productId);
      }
      item.quantity = quantity;
      this.saveItems(items);
    }
    return items;
  },

  getTotal(products) {
    const items = this.getItems();
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
      return total;
    }, 0);
  },

  getCount() {
    const items = this.getItems();
    return items.reduce((count, item) => count + item.quantity, 0);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  updateBadge() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.add('show');
        badge.classList.add('bounce');
        setTimeout(() => badge.classList.remove('bounce'), 500);
      } else {
        badge.classList.remove('show');
      }
    });
  }
};

// ── Favorites Management ──
const Favorites = {
  KEY: 'ward_favorites',

  getItems() {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  },

  toggle(productId) {
    let items = this.getItems();
    const index = items.indexOf(productId);
    if (index > -1) {
      items.splice(index, 1);
      showToast('تم إزالة المنتج من المفضلة', 'info');
    } else {
      items.push(productId);
      showToast('تمت إضافة المنتج إلى المفضلة ❤', 'success');
    }
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateIcons();
    return items;
  },

  isFavorite(productId) {
    return this.getItems().includes(productId);
  },

  updateIcons() {
    document.querySelectorAll('[data-fav-id]').forEach(btn => {
      const id = parseInt(btn.dataset.favId);
      if (this.isFavorite(id)) {
        btn.classList.add('favorited');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
      } else {
        btn.classList.remove('favorited');
        btn.innerHTML = '<i class="far fa-heart"></i>';
      }
    });
  }
};

// ── Orders Management ──
const Orders = {
  KEY: 'ward_orders',

  async getAll() {
    if (window.db) {
      try {
        const snapshot = await window.db.collection('orders').orderBy('date', 'desc').get();
        const orders = [];
        snapshot.forEach(doc => {
          orders.push(doc.data());
        });
        return orders;
      } catch (err) {
        console.warn("Firestore error reading orders, falling back to localStorage:", err);
      }
    }
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  },

  async save(order) {
    order.id = 'ORD-' + Date.now().toString(36).toUpperCase();
    order.date = new Date().toISOString();
    order.status = 'new';

    if (window.db) {
      try {
        await window.db.collection('orders').doc(order.id).set(order);
        const orders = JSON.parse(localStorage.getItem(this.KEY) || '[]');
        orders.push(order);
        localStorage.setItem(this.KEY, JSON.stringify(orders));
        return order;
      } catch (err) {
        console.warn("Firestore error saving order, falling back to localStorage only:", err);
      }
    }

    const orders = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    orders.push(order);
    localStorage.setItem(this.KEY, JSON.stringify(orders));
    return order;
  },

  async updateStatus(orderId, status) {
    if (window.db) {
      try {
        await window.db.collection('orders').doc(orderId).update({ status: status });
      } catch (err) {
        console.warn("Firestore error updating order status:", err);
      }
    }
    const orders = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(this.KEY, JSON.stringify(orders));
    }
  },

  async getById(orderId) {
    if (window.db) {
      try {
        const docSnap = await window.db.collection('orders').doc(orderId).get();
        if (docSnap.exists) {
          return docSnap.data();
        }
      } catch (err) {
        console.warn("Firestore error getting order by ID:", err);
      }
    }
    const orders = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    return orders.find(o => o.id === orderId);
  }
};

// ── Wedding Bookings Management ──
const Bookings = {
  KEY: 'ward_bookings',

  async getAll() {
    if (window.db) {
      try {
        const snapshot = await window.db.collection('bookings').orderBy('date', 'desc').get();
        const bookings = [];
        snapshot.forEach(doc => {
          bookings.push(doc.data());
        });
        return bookings;
      } catch (err) {
        console.warn("Firestore error reading bookings, falling back to localStorage:", err);
      }
    }
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  },

  async save(booking) {
    booking.id = 'WED-' + Date.now().toString(36).toUpperCase();
    booking.date = new Date().toISOString();
    booking.status = 'pending';
    booking.notes = '';

    if (window.db) {
      try {
        await window.db.collection('bookings').doc(booking.id).set(booking);
        const bookings = JSON.parse(localStorage.getItem(this.KEY) || '[]');
        bookings.push(booking);
        localStorage.setItem(this.KEY, JSON.stringify(bookings));
        return booking;
      } catch (err) {
        console.warn("Firestore error saving booking:", err);
      }
    }

    const bookings = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    bookings.push(booking);
    localStorage.setItem(this.KEY, JSON.stringify(bookings));
    return booking;
  },

  async updateStatus(bookingId, status) {
    if (window.db) {
      try {
        await window.db.collection('bookings').doc(bookingId).update({ status: status });
      } catch (err) {
        console.warn("Firestore error updating booking status:", err);
      }
    }
    const bookings = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      localStorage.setItem(this.KEY, JSON.stringify(bookings));
    }
  },

  async addNote(bookingId, note) {
    if (window.db) {
      try {
        await window.db.collection('bookings').doc(bookingId).update({ notes: note });
      } catch (err) {
        console.warn("Firestore error adding note to booking:", err);
      }
    }
    const bookings = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.notes = note;
      localStorage.setItem(this.KEY, JSON.stringify(bookings));
    }
  }
};

// ── Coupons Management ──
const Coupons = {
  KEY: 'ward_coupons',

  getDefaults() {
    return [
      { code: 'WELCOME10', discount: 10, type: 'percent', active: true },
      { code: 'WARD20', discount: 20, type: 'fixed', active: true },
      { code: 'LOVE15', discount: 15, type: 'percent', active: false }
    ];
  },

  getAll() {
    const stored = localStorage.getItem(this.KEY);
    if (!stored) {
      const defaults = this.getDefaults();
      localStorage.setItem(this.KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(stored);
  },

  validate(code) {
    const coupons = this.getAll();
    const coupon = coupons.find(c => c.code === code.toUpperCase() && c.active);
    return coupon || null;
  },

  applyDiscount(code, total) {
    const coupon = this.validate(code);
    if (!coupon) return { valid: false, discount: 0, newTotal: total };

    let discount = 0;
    if (coupon.type === 'percent') {
      discount = (total * coupon.discount) / 100;
    } else {
      discount = coupon.discount;
    }

    return {
      valid: true,
      discount: Math.min(discount, total),
      newTotal: Math.max(0, total - discount),
      coupon
    };
  }
};

// ── Toast Notifications ──
function showToast(message, type = 'success', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '<i class="fas fa-check-circle text-success"></i>',
    error: '<i class="fas fa-times-circle text-danger"></i>',
    warning: '<i class="fas fa-exclamation-triangle text-warning"></i>',
    info: '<i class="fas fa-info-circle text-primary"></i>'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.classList.add('toast-out'); setTimeout(() => this.parentElement.remove(), 300);">
      <i class="fas fa-times"></i>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

// ── Send WhatsApp Notification ──
function sendWhatsAppNotification(message) {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

// ── Format Price ──
function formatPrice(price) {
  return `${price.toFixed(0)} ${STORE_CONFIG.currency}`;
}

// ── Generate Star Rating HTML ──
function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i - 0.5 <= rating) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

// ── Generate Product Card HTML ──
function generateProductCard(product) {
  const isFav = Favorites.isFavorite(product.id);
  const stockStatus = product.quantity <= 0
    ? '<span class="product-stock out-of-stock">نافذ</span>'
    : product.quantity <= 5
      ? `<span class="product-stock low-stock">متبقي ${product.quantity} قطع</span>`
      : `<span class="product-stock in-stock">متوفر</span>`;

  return `
    <div class="product-card fade-up" data-product-id="${product.id}">
      <div class="product-image" onclick="openProductModal('${product.id}')">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        <div class="product-badges">
          ${product.discount > 0 ? `<span class="badge-discount">-${product.discount}%</span>` : ''}
          ${product.isFeatured ? '<span class="badge-new">مميز</span>' : ''}
        </div>
        <div class="product-actions-overlay">
          <button class="action-icon" onclick="event.stopPropagation(); openProductModal('${product.id}')" title="عرض سريع">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-icon ${isFav ? 'favorited' : ''}" data-fav-id="${product.id}" onclick="event.stopPropagation(); Favorites.toggle('${product.id}')" title="المفضلة">
            <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.shortDesc}</p>
        <div class="product-rating">
          <span class="stars">${generateStars(product.rating)}</span>
          <span class="reviews-count">(${product.reviews})</span>
        </div>
        <div class="product-price-row">
          <div>
            <span class="product-price">${product.price} <span class="currency">${STORE_CONFIG.currency}</span></span>
            ${product.originalPrice > product.price ? `<span class="product-original-price">${product.originalPrice} ${STORE_CONFIG.currency}</span>` : ''}
          </div>
          ${stockStatus}
        </div>
        <button class="btn-add-cart" onclick="Cart.addItem('${product.id}')" ${product.quantity <= 0 ? 'disabled' : ''}>
          <i class="fas fa-shopping-cart"></i>
          ${product.quantity <= 0 ? 'نافذ من المخزن' : 'أضف إلى السلة'}
        </button>
      </div>
    </div>
  `;
}

// ── Generate Loading Skeleton ──
function generateSkeletons(count = 6) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text-sm"></div>
        <div class="skeleton skeleton-price"></div>
        <div class="skeleton skeleton-btn"></div>
      </div>
    `;
  }
  return html;
}

// ── Product Modal ──
function openProductModal(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  let modal = document.getElementById('productModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'productModal';
    modal.className = 'modal-overlay';
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProductModal();
      }
    });
    document.body.appendChild(modal);
  }

  const thumbnails = product.images.map((img, idx) =>
    `<img src="${img}" alt="${product.name}" class="${idx === 0 ? 'active' : ''}" onclick="changeModalImage(this, '${img}')">`
  ).join('');

  const colorOptions = product.colors.length > 0
    ? `<div class="modal-options">
        <label>اللون:</label>
        <div class="option-btns">
          ${product.colors.map((c, i) => `<button class="option-btn ${i === 0 ? 'selected' : ''}" onclick="selectOption(this)">${c}</button>`).join('')}
        </div>
      </div>` : '';

  const sizeOptions = product.sizes.length > 0
    ? `<div class="modal-options">
        <label>الحجم:</label>
        <div class="option-btns">
          ${product.sizes.map((s, i) => `<button class="option-btn ${i === 0 ? 'selected' : ''}" onclick="selectOption(this)">${s}</button>`).join('')}
        </div>
      </div>` : '';

  const relatedProducts = productsData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="closeProductModal()"><i class="fas fa-times"></i></button>
      <div class="modal-body">
        <div class="modal-gallery">
          <img src="${product.images[0]}" alt="${product.name}" class="main-image" id="modalMainImage">
          <div class="thumbnails">${thumbnails}</div>
        </div>
        <div class="modal-details">
          <div class="modal-category">${product.category}</div>
          <h2 class="modal-title">${product.name}</h2>
          <div class="modal-rating">
            <span class="stars">${generateStars(product.rating)}</span>
            <span style="margin-right: 0.5rem; color: var(--color-text-light); font-size: 0.9rem;">(${product.reviews} تقييم)</span>
          </div>
          <div class="modal-price-block">
            <span class="modal-current-price">${product.price} ${STORE_CONFIG.currency}</span>
            ${product.originalPrice > product.price ? `<span class="modal-old-price">${product.originalPrice} ${STORE_CONFIG.currency}</span>` : ''}
            ${product.discount > 0 ? `<span class="modal-discount-badge">خصم ${product.discount}%</span>` : ''}
          </div>
          <p class="modal-desc">${product.fullDesc}</p>
          ${colorOptions}
          ${sizeOptions}
          <label style="font-size: 0.9rem; font-weight: 600; display: block; margin-bottom: 0.4rem;">الكمية:</label>
          <div class="quantity-selector">
            <button onclick="changeModalQty(-1)">−</button>
            <input type="number" id="modalQty" value="1" min="1" max="${product.quantity}" readonly>
            <button onclick="changeModalQty(1)">+</button>
          </div>
          <textarea class="greeting-input" id="modalGreeting" placeholder="أضف رسالة تهنئة أو ملاحظات... (اختياري)"></textarea>
          <button class="btn btn-primary w-full btn-lg" onclick="addFromModal(${product.id})" ${product.quantity <= 0 ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart"></i>
            ${product.quantity <= 0 ? 'نافذ من المخزن' : 'أضف إلى السلة'}
          </button>
        </div>
      </div>
      ${relatedProducts.length > 0 ? `
        <div style="padding: 2rem; border-top: 1px solid rgba(200,67,106,0.06);">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">منتجات مشابهة</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
            ${relatedProducts.map(rp => `
              <div style="cursor: pointer; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);" onclick="openProductModal(${rp.id})">
                <img src="${rp.images[0]}" alt="${rp.name}" style="width: 100%; aspect-ratio: 1; object-fit: cover;">
                <div style="padding: 0.75rem;">
                  <div style="font-weight: 600; font-size: 0.9rem;">${rp.name}</div>
                  <div style="color: var(--color-primary); font-weight: 700;">${rp.price} ${STORE_CONFIG.currency}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeModalImage(thumb, src) {
  document.getElementById('modalMainImage').src = src;
  document.querySelectorAll('.thumbnails img').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function changeModalQty(delta) {
  const input = document.getElementById('modalQty');
  const newVal = parseInt(input.value) + delta;
  if (newVal >= 1 && newVal <= parseInt(input.max)) {
    input.value = newVal;
  }
}

function selectOption(btn) {
  btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function addFromModal(productId) {
  const qty = parseInt(document.getElementById('modalQty').value);
  const greeting = document.getElementById('modalGreeting').value;
  
  const options = {};
  const optionContainers = document.querySelectorAll('#productModal .modal-options');
  optionContainers.forEach(container => {
    const label = container.querySelector('label');
    const selectedBtn = container.querySelector('.option-btn.selected');
    if (label && selectedBtn) {
      const labelText = label.textContent;
      if (labelText.includes('اللون')) {
        options.color = selectedBtn.textContent.trim();
      } else if (labelText.includes('الحجم')) {
        options.size = selectedBtn.textContent.trim();
      }
    }
  });

  Cart.addItem(productId, qty, greeting, options);
  closeProductModal();
}

// ── Search Functionality ──
function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');

  if (!searchBtn || !searchOverlay) return;

  searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput?.focus(), 300);
  });

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const resultsContainer = document.getElementById('searchResults');
      if (!resultsContainer) return;

      if (query.length < 2) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); padding: 1rem;">ابدأ الكتابة للبحث...</p>';
        return;
      }

      const results = productsData.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.nameEn.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.shortDesc.toLowerCase().includes(query)
      );

      if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); padding: 1rem;">لا توجد نتائج</p>';
        return;
      }

      resultsContainer.innerHTML = results.map(p => `
        <div class="search-result-item" onclick="searchOverlay.classList.remove('active'); openProductModal(${p.id})">
          <img src="${p.images[0]}" alt="${p.name}">
          <div>
            <div style="font-weight: 600;">${p.name}</div>
            <div style="font-size: 0.85rem; color: var(--color-primary);">${p.price} ${STORE_CONFIG.currency}</div>
          </div>
        </div>
      `).join('');
    });
  }
}

// ── Navbar Scroll Effect ──
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Set active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Scroll Animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── FAQ Toggle ──
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });
}

// ── Generate Navbar HTML ──
function generateNavbar() {
  return `
    <nav class="navbar" id="navbar">
      <div class="navbar-container">
        <a href="index.html" class="navbar-logo">
          <span class="logo-icon">💐</span>
          <span>${STORE_CONFIG.name}</span>
        </a>
        <div class="navbar-links">
          <a href="index.html"><i class="fas fa-home"></i> الرئيسية</a>
          <a href="shop.html"><i class="fas fa-store"></i> المتجر</a>
          <a href="weddings.html"><i class="fas fa-heart"></i> سيارات العرسان</a>
          <a href="about.html"><i class="fas fa-info-circle"></i> عن المحل</a>
          <button class="action-btn" onclick="openTrackingModal()" title="تتبع الطلب" style="font-size:0.85rem; display:flex; align-items:center; gap:0.3rem; padding: 0.4rem 0.75rem; border-radius: var(--radius-full); background: rgba(var(--color-primary-rgb,200,67,106),0.08); color: var(--color-primary);">
            <i class="fas fa-map-marker-alt"></i> تتبع الطلب
          </button>
        </div>
        <div class="navbar-actions">
          <button class="action-btn" id="themeToggleBtn" title="الوضع الليلي" onclick="toggleTheme()">
            <i class="fas fa-moon"></i>
          </button>
          <button class="action-btn" id="searchBtn" title="بحث">
            <i class="fas fa-search"></i>
          </button>
          <a href="shop.html#favorites" class="action-btn" title="المفضلة">
            <i class="fas fa-heart"></i>
          </a>
          <a href="cart.html" class="action-btn" title="السلة">
            <i class="fas fa-shopping-cart"></i>
            <span class="badge cart-badge">0</span>
          </a>
          <button class="mobile-menu-btn" aria-label="القائمة">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-menu">
      <a href="index.html"><i class="fas fa-home"></i> الرئيسية</a>
      <a href="shop.html"><i class="fas fa-store"></i> المتجر</a>
      <a href="weddings.html"><i class="fas fa-heart"></i> سيارات العرسان</a>
      <a href="about.html"><i class="fas fa-info-circle"></i> عن المحل</a>
      <a href="cart.html"><i class="fas fa-shopping-cart"></i> السلة</a>
      <button onclick="openTrackingModal(); document.querySelector('.mobile-menu').classList.remove('active'); document.querySelector('.mobile-menu-btn')?.classList.remove('open'); document.body.style.overflow='';" style="background: none; border: none; color: var(--color-primary); font-size: 1rem; font-family: inherit; cursor:pointer; display:flex; align-items:center; gap: 0.5rem; padding: 0.75rem 1.5rem; width: 100%; text-align: right;">
        <i class="fas fa-map-marker-alt"></i> تتبع الطلب
      </button>
    </div>
    <!-- Search Overlay -->
    <div class="search-overlay" id="searchOverlay">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="ابحث عن ورد، باقات، هدايا...">
        <div class="search-results" id="searchResults">
          <p style="text-align: center; color: var(--color-text-light); padding: 1rem;">ابدأ الكتابة للبحث...</p>
        </div>
      </div>
    </div>
    <!-- Order Tracking Modal -->
    <div class="modal-overlay" id="trackingModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; align-items:center; justify-content:center; padding:1rem;" onclick="if(event.target===this) closeTrackingModal()">
      <div style="background: var(--color-bg, #fff); border-radius: var(--radius-lg, 1rem); padding: 2rem; max-width: 480px; width:100%; box-shadow: 0 25px 60px rgba(0,0,0,0.2); position:relative; direction:rtl; max-height: 90vh; overflow-y: auto;">
        <button onclick="closeTrackingModal()" style="position:absolute; top:1rem; left:1rem; background:none; border:none; font-size:1.4rem; color:var(--color-text-light); cursor:pointer;">&times;</button>
        <div style="text-align:center; margin-bottom:1.5rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">📦</div>
          <h2 style="font-size:1.4rem; font-weight:700; color:var(--color-primary);">تتبع طلبك</h2>
          <p style="color:var(--color-text-light); font-size:0.9rem;">أدخل رمز طلبك أو حجزك لمعرفة الحالة الحالية</p>
        </div>
        <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem;">
          <input type="text" id="trackingInput" placeholder="مثال: ORD-ABC123 أو WED-XYZ789" style="flex:1; padding:0.75rem 1rem; border: 2px solid rgba(0,0,0,0.1); border-radius: var(--radius-md, 0.5rem); font-family:inherit; font-size:0.95rem; outline:none; transition:border-color 0.2s; text-align:center; letter-spacing:1px; background:var(--color-white); color:var(--color-text);" onkeydown="if(event.key==='Enter') handleTrackSubmit()">
          <button onclick="handleTrackSubmit()" style="padding:0.75rem 1.25rem; background: var(--color-primary, #C8436A); color:#fff; border:none; border-radius: var(--radius-md, 0.5rem); font-family:inherit; font-weight:700; cursor:pointer; white-space:nowrap; transition:opacity 0.2s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
            <i class="fas fa-search"></i> بحث
          </button>
        </div>
        <div id="trackingResult" style="min-height:60px;"></div>
        <div id="recentOrdersSection" style="margin-top:2rem; border-top:1px solid rgba(0,0,0,0.1); padding-top:1.5rem; display:none;">
          <h3 style="font-size:1rem; font-weight:700; color:var(--color-text); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            <i class="fas fa-history"></i> طلباتك الأخيرة (لتسهيل الوصول)
          </h3>
          <div id="recentOrdersList" style="display:flex; flex-direction:column; gap:0.75rem;"></div>
        </div>
      </div>
    </div>
  `;
}

// ── Order Tracking Functions ──
function openTrackingModal() {
  const modal = document.getElementById('trackingModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('trackingInput')?.focus(), 200);
    renderRecentOrders();
  }
}

function renderRecentOrders() {
  const recentOrdersList = document.getElementById('recentOrdersList');
  const recentOrdersSection = document.getElementById('recentOrdersSection');
  if (!recentOrdersList || !recentOrdersSection) return;

  const orders = JSON.parse(localStorage.getItem('ward_orders') || '[]');
  const bookings = JSON.parse(localStorage.getItem('ward_bookings') || '[]');
  
  let allRecent = [...orders, ...bookings].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  
  if (allRecent.length === 0) {
    recentOrdersSection.style.display = 'none';
    return;
  }

  recentOrdersSection.style.display = 'block';
  allRecent = allRecent.slice(0, 3);
  
  recentOrdersList.innerHTML = allRecent.map(item => {
    const isOrder = item.id.startsWith('ORD');
    const title = isOrder ? 'طلب متجر' : 'حجز سيارة';
    const dateStr = item.date ? new Date(item.date).toLocaleDateString('ar-JO') : '';
    return `
      <div style="background: rgba(0,0,0,0.03); border-radius: var(--radius-sm); padding: 0.75rem 1rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition: background 0.2s; border:1px solid rgba(0,0,0,0.05);" onclick="document.getElementById('trackingInput').value='${item.id}'; handleTrackSubmit();" onmouseover="this.style.background='rgba(0,0,0,0.06)'" onmouseout="this.style.background='rgba(0,0,0,0.03)'">
        <div>
          <div style="font-weight:600; font-size:0.9rem; color:var(--color-primary);">${item.id}</div>
          <div style="font-size:0.8rem; color:var(--color-text-light);">${title} ${dateStr ? `- ${dateStr}` : ''}</div>
        </div>
        <i class="fas fa-chevron-left" style="color:var(--color-text-light); font-size:0.85rem;"></i>
      </div>
    `;
  }).join('');
}

function closeTrackingModal() {
  const modal = document.getElementById('trackingModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    const result = document.getElementById('trackingResult');
    if (result) result.innerHTML = '';
    const input = document.getElementById('trackingInput');
    if (input) input.value = '';
  }
}

async function handleTrackSubmit() {
  const input = document.getElementById('trackingInput');
  const resultDiv = document.getElementById('trackingResult');
  if (!input || !resultDiv) return;

  const code = input.value.trim().toUpperCase();
  if (!code) {
    resultDiv.innerHTML = `<p style="text-align:center; color:#ef4444; font-weight:600;">⚠️ الرجاء إدخال رمز الطلب أو الحجز.</p>`;
    return;
  }

  resultDiv.innerHTML = `<p style="text-align:center; color:var(--color-text-light); padding:1rem;"><i class="fas fa-spinner fa-spin"></i> جارٍ البحث...</p>`;

  const statusLabels = {
    new: { text: 'جديد - قيد الاستلام', color: '#3b82f6', icon: '🆕' },
    processing: { text: 'قيد التجهيز والتحضير', color: '#f59e0b', icon: '⚙️' },
    delivered: { text: 'تم التوصيل بنجاح', color: '#22c55e', icon: '✅' },
    cancelled: { text: 'ملغى', color: '#ef4444', icon: '❌' },
    pending: { text: 'قيد الانتظار', color: '#f59e0b', icon: '⏳' },
    confirmed: { text: 'تم التأكيد', color: '#3b82f6', icon: '✔️' },
    completed: { text: 'تم التجهيز', color: '#22c55e', icon: '✅' },
  };

  let found = null;
  let type = '';

  // Try Firestore first
  if (window.db) {
    try {
      if (code.startsWith('ORD-')) {
        const doc = await window.db.collection('orders').doc(code).get();
        if (doc.exists) { found = doc.data(); type = 'order'; }
      } else if (code.startsWith('WED-')) {
        const doc = await window.db.collection('bookings').doc(code).get();
        if (doc.exists) { found = doc.data(); type = 'booking'; }
      } else {
        // Try both
        const orderDoc = await window.db.collection('orders').doc(code).get();
        if (orderDoc.exists) { found = orderDoc.data(); type = 'order'; }
        else {
          const bookDoc = await window.db.collection('bookings').doc(code).get();
          if (bookDoc.exists) { found = bookDoc.data(); type = 'booking'; }
        }
      }
    } catch (e) {
      console.warn('Firestore tracking error, falling back to localStorage:', e);
    }
  }

  // Fallback to localStorage
  if (!found) {
    const orders = JSON.parse(localStorage.getItem('ward_orders') || '[]');
    const bookings = JSON.parse(localStorage.getItem('ward_bookings') || '[]');
    const orderMatch = orders.find(o => o.id === code);
    const bookingMatch = bookings.find(b => b.id === code);
    if (orderMatch) { found = orderMatch; type = 'order'; }
    else if (bookingMatch) { found = bookingMatch; type = 'booking'; }
  }

  if (!found) {
    resultDiv.innerHTML = `
      <div style="text-align:center; padding:1rem; background:rgba(239,68,68,0.07); border-radius:0.5rem; border:1px solid rgba(239,68,68,0.2);">
        <div style="font-size:2rem; margin-bottom:0.5rem;">🔍</div>
        <p style="color:#ef4444; font-weight:700; margin-bottom:0.25rem;">لم يتم العثور على هذا الرمز</p>
        <p style="color:var(--color-text-light); font-size:0.85rem;">تأكد من الرمز وحاول مجدداً، أو تواصل معنا عبر <a href="https://wa.me/${STORE_CONFIG.whatsapp}" target="_blank" style="color:var(--color-primary);">واتساب</a></p>
      </div>`;
    return;
  }

  const statusInfo = statusLabels[found.status] || { text: found.status, color: '#6b7280', icon: '📋' };
  const dateStr = found.date ? new Date(found.date).toLocaleDateString('ar-JO', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit'}) : '';

  if (type === 'order') {
    resultDiv.innerHTML = `
      <div style="background: rgba(var(--color-primary-rgb,200,67,106),0.04); border:1px solid rgba(var(--color-primary-rgb,200,67,106),0.15); border-radius:0.75rem; padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <strong style="font-family:monospace; color:var(--color-primary); font-size:1rem;">${found.id}</strong>
          <span style="font-size:1.5rem;">${statusInfo.icon}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.9rem;">
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-light);">الاسم:</span><strong>${found.customerName}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-light);">المجموع:</span><strong style="color:var(--color-primary);">${found.total} ${STORE_CONFIG.currency}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-light);">تاريخ التوصيل:</span><strong>${found.deliveryDate}</strong></div>
          ${dateStr ? `<div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-light);">تاريخ الطلب:</span><span style="font-size:0.82rem;">${dateStr}</span></div>` : ''}
        </div>
        <div style="margin-top:1rem; padding:0.75rem; background:#fff; border-radius:0.5rem; text-align:center; border: 2px solid ${statusInfo.color}20;">
          <span style="font-weight:700; color:${statusInfo.color}; font-size:1rem;">${statusInfo.icon} حالة الطلب: ${statusInfo.text}</span>
        </div>
      </div>`;
  } else {
    resultDiv.innerHTML = `
      <div style="background: rgba(212,168,83,0.07); border:1px solid rgba(212,168,83,0.25); border-radius:0.75rem; padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <strong style="font-family:monospace; color:var(--color-gold-dark, #b8860b); font-size:1rem;">${found.id}</strong>
          <span style="font-size:1.5rem;">${statusInfo.icon}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.9rem;">
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-light);">الاسم:</span><strong>${found.customerName}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-light);">الباقة:</span><strong style="color:var(--color-gold-dark,#b8860b);">${found.selectedPackage}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-light);">يوم التجهيز:</span><strong>${found.eventDate}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-light);">وقت البدء:</span><strong dir="ltr">${found.bookingTime}</strong></div>
        </div>
        <div style="margin-top:1rem; padding:0.75rem; background:#fff; border-radius:0.5rem; text-align:center; border: 2px solid ${statusInfo.color}20;">
          <span style="font-weight:700; color:${statusInfo.color}; font-size:1rem;">${statusInfo.icon} حالة الحجز: ${statusInfo.text}</span>
        </div>
      </div>`;
  }
}


// ── Generate Footer HTML ──
function generateFooter() {
  return `
    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-logo">
            <i class="fas fa-spa"></i>
            <span>${STORE_CONFIG.name}</span>
          </div>
          <p class="footer-desc">
            محل ورد فاخر متخصص في تقديم أجمل الباقات والتنسيقات الزهرية لجميع المناسبات. نسعى لإسعاد عملائنا بأرقى الخدمات وأجود أنواع الورود الطازجة.
          </p>
          <div class="footer-social">
            <a href="#" title="انستقرام"><i class="fab fa-instagram"></i></a>
            <a href="#" title="تويتر"><i class="fab fa-twitter"></i></a>
            <a href="#" title="سناب شات"><i class="fab fa-snapchat"></i></a>
            <a href="#" title="تيك توك"><i class="fab fa-tiktok"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <h3>روابط سريعة</h3>
          <ul>
            <li><a href="index.html"><i class="fas fa-chevron-left"></i> الرئيسية</a></li>
            <li><a href="shop.html"><i class="fas fa-chevron-left"></i> المتجر</a></li>
            <li><a href="weddings.html"><i class="fas fa-chevron-left"></i> تجهيز سيارات العرسان</a></li>
            <li><a href="about.html"><i class="fas fa-chevron-left"></i> عن المحل</a></li>
            <li><a href="cart.html"><i class="fas fa-chevron-left"></i> سلة المشتريات</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>تواصل معنا</h3>
          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <a href="${STORE_CONFIG.mapLink || '#'}" target="_blank" style="color:inherit; text-decoration:underline;">${STORE_CONFIG.address}</a>
          </div>
          <div class="contact-item">
            <i class="fas fa-phone"></i>
            <span dir="ltr">${STORE_CONFIG.phone}</span>
          </div>
          <div class="contact-item">
            <i class="fab fa-whatsapp"></i>
            <span dir="ltr">${STORE_CONFIG.phone}</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <span>${STORE_CONFIG.email}</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-clock"></i>
            <span>يومياً: 9 صباحاً - 11 مساءً</span>
          </div>
        </div>
        <div class="footer-col">
          <h3>موقعنا</h3>
          <div class="footer-map" style="display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.05); border-radius: 0.5rem; padding: 2rem; border: 1px dashed rgba(0,0,0,0.1);">
            <a href="${STORE_CONFIG.mapLink}" target="_blank" style="background: var(--color-primary); color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
              <i class="fas fa-map-marked-alt"></i> افتح الموقع على الخريطة
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-inner">
          <span>© ${new Date().getFullYear()} ${STORE_CONFIG.name} - جميع الحقوق محفوظة</span>
          <span>صُنع بـ ❤ للجمال</span>
        </div>
      </div>
    </footer>
    <!-- WhatsApp Float Button -->
    <a href="https://wa.me/${STORE_CONFIG.whatsapp}" target="_blank" class="whatsapp-float" title="تواصل عبر واتساب">
      <i class="fab fa-whatsapp"></i>
    </a>
  `;
}

// ── Theme Logic ──
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle('dark-mode');
  localStorage.setItem('ward_theme', isDark ? 'dark' : 'light');
  
  const icon = document.querySelector('#themeToggleBtn i');
  if (icon) {
    if (isDark) {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('ward_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  // Set initial icon
  const icon = document.querySelector('#themeToggleBtn i');
  if (icon) {
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// ── Initialize Common Elements ──
function initCommon() {
  // Insert navbar
  const navPlaceholder = document.getElementById('navbarPlaceholder');
  if (navPlaceholder) {
    navPlaceholder.innerHTML = generateNavbar();
  }

  // Insert footer
  const footerPlaceholder = document.getElementById('footerPlaceholder');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = generateFooter();
  }

  // Init common features
  initTheme();
  initNavbar();
  initSearch();
  Cart.updateBadge();

  // Load products for search
  if (productsData.length === 0) {
    loadProducts();
  }
}

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  initScrollAnimations();
});

// ── Close modal on Escape ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchOverlay) searchOverlay.classList.remove('active');
  }
});
