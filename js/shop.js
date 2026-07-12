/* ═══════════════════════════════════════════
   🌸 Ward Shop - Shop Page Logic
   ═══════════════════════════════════════════ */

let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  const shopGrid = document.getElementById('shopGrid');
  if (!shopGrid) return;

  // Show skeletons initially
  shopGrid.innerHTML = generateSkeletons(8);

  // Load products from JSON (utilizing function in app.js)
  allProducts = await loadProducts();

  // Setup Event Listeners for Filters
  setupFilters();

  // Initial render based on URL hash (e.g. #favorites) or default
  handleInitialState();
});

function setupFilters() {
  const filterSearch = document.getElementById('filterSearch');
  const filterCategory = document.getElementById('filterCategory');
  const filterPrice = document.getElementById('filterPrice');
  const filterOccasion = document.getElementById('filterOccasion');
  const sortProducts = document.getElementById('sortProducts');

  if (filterSearch) filterSearch.addEventListener('input', applyFilters);
  if (filterCategory) filterCategory.addEventListener('change', applyFilters);
  if (filterPrice) filterPrice.addEventListener('change', applyFilters);
  if (filterOccasion) filterOccasion.addEventListener('change', applyFilters);
  if (sortProducts) sortProducts.addEventListener('change', applyFilters);

  // Listen to hash changes (e.g. clicking favorites in navbar)
  window.addEventListener('hashchange', handleInitialState);
}

function handleInitialState() {
  const hash = window.location.hash;
  const filterCategory = document.getElementById('filterCategory');
  const pageHeaderH1 = document.querySelector('.page-header h1');

  if (hash === '#favorites') {
    // Modify heading to show Favorites
    if (pageHeaderH1) pageHeaderH1.textContent = 'المنتجات المفضلة ❤';
    // Clear search inputs & selects
    resetFiltersSelects();
    renderFavorites();
  } else {
    if (pageHeaderH1) pageHeaderH1.textContent = 'المتجر الإلكتروني';
    applyFilters();
  }
}

function resetFiltersSelects() {
  const filterSearch = document.getElementById('filterSearch');
  const filterCategory = document.getElementById('filterCategory');
  const filterPrice = document.getElementById('filterPrice');
  const filterOccasion = document.getElementById('filterOccasion');
  const sortProducts = document.getElementById('sortProducts');

  if (filterSearch) filterSearch.value = '';
  if (filterCategory) filterCategory.value = 'all';
  if (filterPrice) filterPrice.value = 'all';
  if (filterOccasion) filterOccasion.value = 'all';
  if (sortProducts) sortProducts.value = 'default';
}

function resetFilters() {
  resetFiltersSelects();
  // Clear hash if any
  if (window.location.hash) {
    window.location.hash = '';
  } else {
    applyFilters();
  }
}

function applyFilters() {
  // If hash is #favorites, we want to clear it if user interacts with filters
  if (window.location.hash === '#favorites') {
    window.location.hash = '';
    return; // This will trigger hashchange which will reset and apply filters
  }

  const query = document.getElementById('filterSearch')?.value.trim().toLowerCase() || '';
  const category = document.getElementById('filterCategory')?.value || 'all';
  const priceRange = document.getElementById('filterPrice')?.value || 'all';
  const occasion = document.getElementById('filterOccasion')?.value || 'all';
  const sortBy = document.getElementById('sortProducts')?.value || 'default';

  let filtered = [...allProducts];

  // 1. Search Query Filter
  if (query) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.nameEn.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) || 
      p.shortDesc.toLowerCase().includes(query)
    );
  }

  // 2. Category Filter
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // 3. Price Filter
  if (priceRange !== 'all') {
    filtered = filtered.filter(p => {
      const price = p.price;
      if (priceRange === '0-15') return price < 15;
      if (priceRange === '15-30') return price >= 15 && price <= 30;
      if (priceRange === '30-50') return price >= 30 && price <= 50;
      if (priceRange === '50+') return price > 50;
      return true;
    });
  }

  // 4. Occasion Filter
  if (occasion !== 'all') {
    filtered = filtered.filter(p => p.occasions && p.occasions.includes(occasion));
  }

  // 5. Sorting
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating-desc') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(filtered);
}

function renderFavorites() {
  const favoriteIds = Favorites.getItems();
  const filtered = allProducts.filter(p => favoriteIds.includes(p.id));
  renderProducts(filtered, true);
}

function renderProducts(products, isFavMode = false) {
  const shopGrid = document.getElementById('shopGrid');
  const emptyState = document.getElementById('emptyState');
  const emptyStateP = emptyState?.querySelector('p');
  const emptyStateH3 = emptyState?.querySelector('h3');

  if (!shopGrid) return;

  if (products.length === 0) {
    shopGrid.innerHTML = '';
    if (emptyState) {
      if (isFavMode) {
        if (emptyStateH3) emptyStateH3.textContent = 'قائمة المفضلة فارغة ❤';
        if (emptyStateP) emptyStateP.textContent = 'تصفح المتجر وأضف منتجاتك المفضلة لتظهر هنا.';
      } else {
        if (emptyStateH3) emptyStateH3.textContent = 'عذراً، لم نجد أي منتجات!';
        if (emptyStateP) emptyStateP.textContent = 'جرب تغيير خيارات البحث أو الفلاتر التي قمت بتحديدها.';
      }
      emptyState.classList.remove('hidden');
    }
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    
    // Animate grid loading
    shopGrid.innerHTML = products.map(p => generateProductCard(p)).join('');
    
    // Initialize heart icons correctly
    Favorites.updateIcons();
    
    // Trigger scroll animations for loaded products
    initScrollAnimations();
  }
}
