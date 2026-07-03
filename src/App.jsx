import { useEffect, useMemo, useRef, useState } from 'react';
import AdminPanel from './AdminPanel';

const venetianSofaImages = [
  'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=150&q=80',
];


// Başlangıç verileri (Vitrin özellikleri eklendi: isRecommended, isPopular, isOnlineSpecial)
const initialProducts = [
  { id: 1, category: 'Yatak Odası', name: 'Palermo Yatak Odası Takımı', priceStr: '38.900 TL', priceNum: 38900, oldPrice: '45.000 TL', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', badge: 'YENİ', desc: 'Modern tasarımı ve ahşap dokusuyla Palermo, odanıza doğal bir ferahlık katar.', isRecommended: true, isPopular: false, isOnlineSpecial: false },
  { id: 2, category: 'Oturma Grupları', name: 'Venedik Köşe Koltuk - Modern L-Tasarım', priceStr: '24.500 TL', priceNum: 24500, oldPrice: '28.000 TL', img: venetianSofaImages[0], badge: 'EN ÇOK SATAN', 
    desc: 'Evinizin kalbinde, İtalyan estetiği ve üstün Türk işçiliğinin buluştuğu Venedik Köşe Koltuk, konforu yeniden tanımlıyor. Lüks modüler tasarımı, entegre teknolojik detayları ve dayanıklı kumaşıyla hem salonunuza şıklık katıyor hem de en keyifli anlarınıza eşlik ediyor. Masif ahşap iskeleti ve yüksek dansiteli süngerleri ile ömürlük bir konfor sunar.\nRealistik Ürün: Antrasit Gri, Pislozi koniur sanğu: 20.500 ml, Belunda sungizet angapır: 100 - slur sunar', detailImages: venetianSofaImages, isRecommended: true, isPopular: true, isOnlineSpecial: true },
  { id: 3, category: 'Yemek Odası', name: 'Milano Yemek Odası', priceStr: '29.900 TL', priceNum: 29900, oldPrice: '', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', badge: 'ÇOK SATAN', desc: 'Mermer desenli üst yüzey ve şık sandalyeler.', isRecommended: true, isPopular: true, isOnlineSpecial: false },
  { id: 4, category: 'Yatak Odası', name: 'Lidya Sürgülü Gardırop', priceStr: '16.500 TL', priceNum: 16500, oldPrice: '19.000 TL', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80', badge: '%15 İNDİRİM', desc: 'Geniş iç hacmi ve sessiz kapanan kapak sistemi.', isRecommended: true, isPopular: true, isOnlineSpecial: false },
  { id: 5, category: 'Tamamlayıcı Ürünler', name: 'Art Deco TV Ünitesi', priceStr: '8.250 TL', priceNum: 8250, oldPrice: '', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', badge: '', desc: 'Minimalist çizgiler ve metal ayak detayları.', isRecommended: false, isPopular: true, isOnlineSpecial: true },
  { id: 6, category: 'Genç ve Çocuk Odası', name: 'Dynamic Genç Odası', priceStr: '21.000 TL', priceNum: 21000, oldPrice: '24.500 TL', img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80', badge: 'YENİ', desc: 'Çalışma masası, kitaplık ve yatak bir arada.', isRecommended: false, isPopular: false, isOnlineSpecial: true },
  { id: 7, category: 'Yatak Odası', name: 'Comfort Ortopedik Yatak', priceStr: '7.400 TL', priceNum: 7400, oldPrice: '9.000 TL', img: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=800&q=80', badge: '', desc: 'Omurga destekli tam ortopedik yüzey.', isRecommended: false, isPopular: false, isOnlineSpecial: true },
  { id: 8, category: 'Oturma Grupları', name: 'Krem Chester Koltuk', priceStr: '15.900 TL', priceNum: 15900, oldPrice: '', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80', badge: '', desc: 'Klasik chester stili, kolay silinebilir kumaş.', isRecommended: false, isPopular: false, isOnlineSpecial: true }
];

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    badge: 'YENİ KOLEKSİYON',
    title: 'Evinizin Yeni<br>Tarzı Muratoğlu<br><span class="text-brand-secondary text-2xl md:text-4xl">Alışveriş Merkezi</span>',
    desc: 'Estetik ve konforu bir araya getiren özel tasarımlar, lansmana özel fiyatlarla mağazalarımızda ve online\'da.',
    cat: 'Yatak Odası'
  },
  {
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
    badge: 'İNDİRİM GÜNLERİ',
    title: 'Şıklığı Yakalayın<br>Koltuk Takımları<br><span class="text-brand-secondary text-2xl md:text-4xl">Fırsatları</span>',
    desc: 'Salonunuzun havasını değiştirecek yepyeni modeller şimdi çok özel indirimlerle.',
    cat: 'Oturma Grupları'
  },
  {
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    badge: 'ŞIK SOFRALAR',
    title: 'Yemek Odalarında<br>Modern Dokunuş<br><span class="text-brand-secondary text-2xl md:text-4xl">Yeni Sezon</span>',
    desc: 'Ailenizle geçireceğiniz güzel anlar için tasarlandı. Yeni sezon yemek odaları.',
    cat: 'Yemek Odası'
  }
];

const sidebarMegaData = {
  'Oturma Grupları': [
    { name: 'Koltuk Takımı', img: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=150&q=80' },
    { name: 'Köşe Takımı', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=150&q=80' },
    { name: 'Berjer', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=150&q=80' },
    { name: 'TV Koltuğu', img: 'https://images.unsplash.com/photo-1506898667547-42e22a46e125?auto=format&fit=crop&w=150&q=80' }
  ],
  'Yemek Odası': [
    { name: 'Yemek Odası Takımı', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=150&q=80' },
    { name: 'Yemek Masası', img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=150&q=80' },
    { name: 'Sandalye', img: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=150&q=80' },
    { name: 'Konsol & Vitrin', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80' }
  ],
  'Yatak Odası': [
    { name: 'Yatak Odası Takımı', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=150&q=80' },
    { name: 'Gardırop & Elbise Dolabı', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=150&q=80' },
    { name: 'Karyola', img: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=150&q=80' },
    { name: 'Komodin', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=150&q=80' }
  ],
  Yatak: [
    { name: 'Tek Kişilik Yatak', img: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=150&q=80' },
    { name: 'Çift Kişilik Yatak', img: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=150&q=80' },
    { name: 'Baza & Başlık', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=150&q=80' },
    { name: 'Uyku Seti', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=150&q=80' }
  ],
  'Genç ve Çocuk Odası': [
    { name: 'Genç Odası Takımı', img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=150&q=80' },
    { name: 'Çalışma Masası', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80' },
    { name: 'Kitaplık', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=150&q=80' },
    { name: 'Ranza & Karyola', img: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=150&q=80' }
  ]
};

const navCategories = [
  'Oturma Grupları',
  'Yemek Odası',
  'Yatak Odası',
  'Yatak',
  'Genç ve Çocuk Odası',
  'Bahçe Mobilyası',
  'Tamamlayıcı Ürünler',
  'İndirimli Ürünler'
];

function formatMoney(amount) {
  return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
}

function ProductCard({ product, onNavigateDetail, onAddToCart }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col relative">
      {product.badge ? (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10 tracking-wider">
          {product.badge}
        </div>
      ) : null}
      <button
        type="button"
        className="relative h-64 overflow-hidden cursor-pointer bg-gray-50 flex items-center justify-center p-4 w-full"
        onClick={() => onNavigateDetail(product.id)}
      >
        <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" />
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-brand-main text-white px-6 py-2 rounded font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
            İncele
          </span>
        </span>
      </button>
      <div className="p-5 flex flex-col flex-grow border-t border-gray-50">
        <div className="text-xs text-brand-main font-semibold mb-1 uppercase tracking-wide">{product.category}</div>
        <button type="button" className="text-left font-bold text-gray-800 mb-3 hover:text-brand-main" onClick={() => onNavigateDetail(product.id)}>
          {product.name}
        </button>
        <div className="mt-auto flex justify-between items-end gap-3">
          <div>
            {product.oldPrice ? <div className="text-xs text-gray-400 line-through mb-0.5">{product.oldPrice}</div> : <div className="h-4" />}
            <div className="text-xl font-extrabold text-gray-900">{product.priceStr}</div>
          </div>
          <button
            type="button"
            onClick={() => onAddToCart(product.id, 1, 'Standart', 'Standart')}
            className="w-10 h-10 rounded-full bg-gray-100 text-brand-main flex items-center justify-center hover:bg-brand-main hover:text-white transition-colors flex-shrink-0"
            title="Sepete Ekle"
          >
            <i className="fas fa-plus" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Sitenin kalbi olan ürün verilerini state içinde tutuyoruz.
  const [products, setProducts] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
  const API_URL = `/api/products`;

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Veritabani baglanti hatasi:', err);
      addToast('Urunler yuklenemedi. Lutfen daha sonra tekrar deneyin.');
    }
  };

  const getInitialPage = () => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
      return 'admin';
    }
    return 'home';
  };

  const [page, setPage] = useState(getInitialPage());
  const [categoryName, setCategoryName] = useState('Yatak Odası');
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [cart, setCart] = useState([]);
  const [currentQty, setCurrentQty] = useState(1);
  const [heroSlide, setHeroSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMegaCategory, setSidebarMegaCategory] = useState(null);
  const [sidebarMegaVisible, setSidebarMegaVisible] = useState(false);
  const [desktopMegaCategory, setDesktopMegaCategory] = useState(null);
  const [toasts, setToasts] = useState([]);
  const sidebarMegaCloseTimer = useRef(null);
  const desktopMegaCloseTimer = useRef(null);

  const [selectedColor, setSelectedColor] = useState('Antrasit Gri');
  const [selectedMaterial, setSelectedMaterial] = useState('Boşluk Dlanrı');
  const [selectedDetailImageIndex, setSelectedDetailImageIndex] = useState(0);

  // Ürün referanslarını mockProducts yerine state'deki products'dan alıyoruz
  const selectedProduct = useMemo(() => products.find((product) => product.id === selectedProductId) ?? products[0] ?? initialProducts[0], [selectedProductId, products]);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.priceNum * item.qty, 0);

  const categoryProducts = useMemo(() => {
    const filtered = products.filter((product) => product.category === categoryName || categoryName === 'Tüm Ürünler' || product.name.includes(categoryName));
    return filtered.length > 0 ? filtered : products;
  }, [categoryName, products]);

  // CRUD Fonksiyonları (Admin paneline gönderilecek)
  const addProduct = async (newProduct) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP ${response.status}`);
    }
    await fetchProducts();
  };

  const updateProduct = async (updatedProduct) => {
    const response = await fetch(`${API_URL}/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP ${response.status}`);
    }
    await fetchProducts();
  };

  const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP ${response.status}`);
    }
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('/admin')) {
        setPage('admin');
      } else {
        setPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (page !== 'home') return undefined;
    const interval = window.setInterval(() => {
      setHeroSlide((value) => (value + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [page]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [toasts]);

  const addToast = (message) => {
    const id = window.crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
    setToasts((current) => [...current, { id, message }]);
  };

  const closeSidebarMegaNow = () => {
    if (sidebarMegaCloseTimer.current) {
      window.clearTimeout(sidebarMegaCloseTimer.current);
      sidebarMegaCloseTimer.current = null;
    }
    setSidebarMegaVisible(false);
    setSidebarMegaCategory(null);
  };

  const openSidebarMega = (category) => {
    if (!sidebarMegaData[category]) {
      closeSidebarMegaNow();
      return;
    }
    if (sidebarMegaCloseTimer.current) {
      window.clearTimeout(sidebarMegaCloseTimer.current);
      sidebarMegaCloseTimer.current = null;
    }
    setSidebarMegaCategory(category);
    setSidebarMegaVisible(true);
  };

  const scheduleSidebarMegaClose = () => {
    if (sidebarMegaCloseTimer.current) {
      window.clearTimeout(sidebarMegaCloseTimer.current);
    }
    sidebarMegaCloseTimer.current = window.setTimeout(() => {
      closeSidebarMegaNow();
    }, 300);
  };

  const closeDesktopMegaNow = () => {
    if (desktopMegaCloseTimer.current) {
      window.clearTimeout(desktopMegaCloseTimer.current);
      desktopMegaCloseTimer.current = null;
    }
    setDesktopMegaCategory(null);
  };

  const openDesktopMega = (category) => {
    if (!sidebarMegaData[category]) {
      closeDesktopMegaNow();
      return;
    }
    if (desktopMegaCloseTimer.current) {
      window.clearTimeout(desktopMegaCloseTimer.current);
      desktopMegaCloseTimer.current = null;
    }
    setDesktopMegaCategory(category);
  };

  const scheduleDesktopMegaClose = () => {
    if (desktopMegaCloseTimer.current) {
      window.clearTimeout(desktopMegaCloseTimer.current);
    }
    desktopMegaCloseTimer.current = window.setTimeout(() => {
      closeDesktopMegaNow();
    }, 300);
  };

  const navigate = (nextPage, param = null) => {
    setPage(nextPage);

    if (typeof window !== 'undefined') {
      if (nextPage === 'admin') {
        window.history.pushState({}, '', '/admin');
      } else if (window.location.pathname.includes('/admin')) {
        window.history.pushState({}, '', '/'); 
      }
    }

    if (nextPage === 'home') {
      setHeroSlide(0);
    }
    if (nextPage === 'category') {
      setCategoryName(param || 'Tüm Ürünler');
    }
    if (nextPage === 'detail') {
      setSelectedProductId(param);
      setCurrentQty(1);
      setSelectedColor('Antrasit Gri');
      setSelectedMaterial('Boşluk Dlanrı');
      setSelectedDetailImageIndex(0);
    }

    closeSidebarMegaNow();
    closeDesktopMegaNow();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (productId, qty, color, material) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    setCart((current) => {
      const existingItem = current.find((item) => item.id === productId && item.color === color && item.material === material);
      if (existingItem) {
        return current.map((item) => (item.id === productId && item.color === color && item.material === material ? { ...item, qty: item.qty + qty } : item));
      }
      return [...current, { ...product, qty, color, material }];
    });

    addToast(`${product.name} sepete eklendi!`);
    if (page === 'cart') {
      window.setTimeout(() => setPage('cart'), 0);
    }
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const updateCartItemQty = (productId, nextQty) => {
    if (nextQty < 1) return;
    setCart((current) => current.map((item) => (item.id === productId ? { ...item, qty: nextQty } : item)));
  };

  const hero = slides[heroSlide];
  const detailThumbsImages = selectedProduct.detailImages || Array.from({ length: 4 }, (_, index) => selectedProduct.img);
  const detailThumbs = Array.from({ length: detailThumbsImages.length }, (_, index) => index);

  // ADMIN PANELI ÇAĞRISI (Ürünleri ve CRUD fonksiyonlarını prop olarak geçiyoruz)
  if (page === 'admin') {
    return <AdminPanel navigate={navigate} addToast={addToast} products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} apiBaseUrl={API_BASE_URL} />;
  }

  // MÜŞTERİ VİTRİNİ ARAYÜZÜ
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#333]">
      <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="bg-[#333] text-white px-6 py-3 rounded-lg shadow-lg text-sm flex items-center">
            <i className="fas fa-check-circle text-brand-main text-lg mr-3" />
            <span dangerouslySetInnerHTML={{ __html: toast.message }} />
          </div>
        ))}
      </div>

      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)} />
      
      <aside
        className={`fixed top-0 left-0 h-full z-[60] transform transition-transform duration-300 flex ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onMouseLeave={scheduleSidebarMegaClose}
      >
        <div 
          className="w-80 h-full bg-white flex flex-col overflow-y-auto relative z-20 shadow-2xl border-r border-gray-100"
          onMouseEnter={() => {
            if (sidebarMegaCloseTimer.current) {
              window.clearTimeout(sidebarMegaCloseTimer.current);
              sidebarMegaCloseTimer.current = null;
            }
          }}
        >
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
            <h2 className="text-lg font-extrabold text-brand-main tracking-wider uppercase">KATEGORİLER</h2>
            <button type="button" onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl transition-colors">
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="flex-grow">
            <ul className="flex flex-col text-sm font-bold text-gray-700">
              {navCategories.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('category', item);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left block py-4 px-6 border-b border-gray-100 hover:bg-brand-accent hover:text-brand-main transition-colors flex justify-between items-center ${item === 'İndirimli Ürünler' ? 'text-red-600 hover:bg-red-50' : ''}`}
                    onMouseEnter={() => openSidebarMega(item)}
                  >
                    <span>{item}</span>
                    <i className="fas fa-chevron-right text-xs text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
            <button type="button" onClick={() => { navigate('login'); setSidebarOpen(false); }} className="flex items-center text-gray-600 hover:text-brand-main mb-4 w-full text-left">
              <i className="far fa-user text-xl w-8 text-center mr-2" /> Giriş Yap / Üye Ol
            </button>
          </div>
        </div>

        {sidebarMegaCategory && sidebarMegaVisible ? (
          <div 
            className="h-full w-[calc(100vw-320px)] sm:w-[500px] bg-white border-l border-gray-100 shadow-2xl z-10 transition-all duration-300 opacity-100 visible flex flex-col" 
            onMouseEnter={() => {
              if (sidebarMegaCloseTimer.current) {
                window.clearTimeout(sidebarMegaCloseTimer.current);
                sidebarMegaCloseTimer.current = null;
              }
            }} 
            onMouseLeave={scheduleSidebarMegaClose}
          >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-brand-main uppercase tracking-wide">{sidebarMegaCategory}</h3>
          </div>
          <div className="p-6 overflow-y-auto flex-grow grid grid-cols-2 gap-4 content-start">
            {sidebarMegaData[sidebarMegaCategory].map((item) => (
              <button key={item.name} type="button" onClick={() => { navigate('category', item.name); setSidebarOpen(false); }} className="flex flex-col items-center text-center group/sub bg-white border border-gray-100 rounded-lg p-4 hover:border-brand-main transition-colors shadow-sm hover:shadow-md">
                <div className="h-20 flex items-center justify-center mb-3">
                  <img src={item.img} alt={item.name} className="max-h-full object-contain drop-shadow-sm rounded group-hover/sub:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover/sub:text-brand-main">{item.name}</span>
              </button>
            ))}
          </div>
          </div>
        ) : null}
      </aside>

      <div className="border-b border-gray-200 text-gray-500 text-[11px] py-1 hidden md:block bg-gray-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-6 font-medium">
            <button type="button" className="hover:text-brand-main transition-colors">Mağazalarımız</button>
            <button type="button" className="hover:text-brand-main transition-colors">Kampanyalar</button>
            <button type="button" className="hover:text-brand-main transition-colors">Blog</button>
            <button type="button" className="hover:text-brand-main transition-colors">Kataloglar</button>
          </div>
          <div className="flex space-x-6 items-center">
            <button type="button" className="hover:text-brand-main transition-colors flex items-center"><i className="fas fa-file-invoice mr-1.5 text-sm" /> Sipariş Takibi</button>
            <a href="tel:08502223399" className="hover:text-brand-main transition-colors font-bold text-green-600 flex items-center"><i className="fab fa-whatsapp mr-1.5 text-sm" /> 0850 222 33 99</a>
            <button type="button" className="hover:text-brand-main transition-colors flex items-center font-bold text-gray-700">EN</button>
          </div>
        </div>
      </div>

      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-6">
            <div className="w-full md:w-1/4 flex items-center gap-4 cursor-pointer">
              <button type="button" onClick={() => setSidebarOpen(true)} className="text-2xl text-gray-800 hover:text-brand-main transition-colors flex-shrink-0">
                <i className="fas fa-bars" />
              </button>
              <button type="button" onClick={() => navigate('home')} className="flex-grow text-left flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-brand-main flex flex-col">
                  MURATOĞLU
                  <span className="text-[12px] md:text-sm text-brand-secondary font-bold tracking-widest uppercase">Alışveriş Merkezi</span>
                </h1>
              </button>
            </div>

            <div className="w-full md:w-2/4 order-3 md:order-none">
              <div className="relative flex border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-brand-main transition-colors">
                <div className="pl-4 flex items-center text-gray-400">
                  <i className="fas fa-search" />
                </div>
                <input type="text" placeholder="Site içi ürün arama" className="w-full py-2.5 px-3 focus:outline-none text-sm text-gray-700" />
                <button type="button" className="bg-brand-main text-white px-8 font-bold text-sm hover:bg-brand-secondary transition-colors">
                  ARA
                </button>
              </div>
            </div>

            <div className="flex space-x-6 items-center order-2 md:order-none w-full md:w-1/4 justify-end">
              <button type="button" className="text-[11px] font-bold text-gray-600 hover:text-brand-main transition-colors hidden lg:block">Online Özel</button>
              <button type="button" onClick={() => navigate('login')} className="flex items-center text-gray-600 hover:text-brand-main transition-colors">
                <i className="far fa-user text-xl mr-2" />
                <span className="text-[11px] font-bold hidden xl:block">Giriş Yap</span>
              </button>
              <button type="button" className="flex items-center text-gray-600 hover:text-brand-main transition-colors">
                <i className="far fa-heart text-xl mr-2" />
                <span className="text-[11px] font-bold hidden xl:block">Favorilerim</span>
              </button>
              <button type="button" onClick={() => navigate('cart')} className="flex items-center text-gray-600 hover:text-brand-main transition-colors relative cursor-pointer group">
                <div className="relative mr-2">
                  <i className="fas fa-shopping-bag text-2xl group-hover:text-brand-main" />
                  <span className="absolute -top-1 -right-2 bg-brand-main text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{cartCount}</span>
                </div>
                <span className="text-xs font-bold text-gray-800 hidden xl:block">{formatMoney(cartTotal)}</span>
              </button>
            </div>
          </div>
        </div>

        <nav className="border-t border-gray-100 hidden md:block relative" onMouseLeave={scheduleDesktopMegaClose}>
          <div className="w-full px-6 lg:px-10">
            <ul className="flex justify-center text-[11px] font-bold text-gray-600 uppercase tracking-wide gap-8">
              {navCategories.map((item) => (
                <li key={item} className="relative">
                  <button type="button" onClick={() => navigate('category', item)} onMouseEnter={() => openDesktopMega(item)} className={`block py-4 hover:text-brand-main transition-colors relative z-50 ${item === 'İndirimli Ürünler' ? 'text-red-600 hover:text-red-800' : ''}`}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {desktopMegaCategory && sidebarMegaData[desktopMegaCategory] ? (
            <div 
              className="absolute left-0 top-full w-full bg-white shadow-2xl flex p-8 border-t-2 border-brand-main z-50" 
              onMouseEnter={() => {
                if (desktopMegaCloseTimer.current) {
                  window.clearTimeout(desktopMegaCloseTimer.current);
                  desktopMegaCloseTimer.current = null;
                }
              }} 
              onMouseLeave={scheduleDesktopMegaClose}
            >
              <div className="w-2/3 grid grid-cols-4 gap-8 pr-8 border-r border-gray-100">
                {sidebarMegaData[desktopMegaCategory].map((entry) => (
                  <button key={entry.name} type="button" onClick={() => navigate('category', entry.name)} className="flex flex-col items-center text-center group/item">
                    <div className="h-24 flex items-end justify-center mb-4 transition-transform group-hover/item:-translate-y-2">
                      <img src={entry.img} alt={entry.name} className="max-h-full object-contain drop-shadow-md rounded" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover/item:text-brand-main">{entry.name}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="w-1/3 pl-8 flex flex-col cursor-pointer group/featured" onClick={() => navigate('category', desktopMegaCategory)}>
                <div className="overflow-hidden rounded-lg w-full h-full flex-grow relative">
                  <img src={desktopMegaCategory === 'Yemek Odası' ? 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80' : desktopMegaCategory === 'Yatak Odası' ? 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' : slides[0].img} alt="Kampanya" className="w-full h-full object-cover transition-transform duration-700 group-hover/featured:scale-105" />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 p-4">
                    <span className="text-white font-bold text-lg">{desktopMegaCategory}</span>
                    <p className="text-white/80 text-xs mt-1">İncele ve Keşfet <i className="fas fa-arrow-right ml-1" /></p>
                  </div>
                </div>
              </button>
            </div>
          ) : null}
        </nav>
      </header>

      <main className="flex-grow bg-gray-50">
        {page === 'home' ? (
          <section className="page-section active">
            
            {/* HERO SLIDER */}
            <div className="relative w-full h-[400px] md:h-[600px] bg-gray-200 overflow-hidden group">
              <div className="w-full h-full relative cursor-pointer transition-all duration-500 ease-in-out" onClick={() => navigate('category', hero.cat)}>
                <img src={hero.img} alt="Kampanya" className="w-full h-full object-cover transition-transform duration-1000 scale-100" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                  <div className="container mx-auto px-8 md:px-16">
                    <span className="bg-brand-main text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded mb-4 inline-block shadow-md">{hero.badge}</span>
                    <h2 className="text-white text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl leading-tight" dangerouslySetInnerHTML={{ __html: hero.title }} />
                    <p className="text-gray-200 text-lg md:text-xl mb-8 drop-shadow-md max-w-lg">{hero.desc}</p>
                    <button type="button" className="bg-white text-brand-main px-8 py-3 rounded font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center">
                      İncele & Keşfet <i className="fas fa-chevron-right ml-2 text-sm" />
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setHeroSlide((value) => (value - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-brand-main w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110">
                <i className="fas fa-chevron-left text-xl md:text-2xl" />
              </button>
              <button type="button" onClick={() => setHeroSlide((value) => (value + 1) % slides.length)} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-brand-main w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110">
                <i className="fas fa-chevron-right text-xl md:text-2xl" />
              </button>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
                {slides.map((slide, index) => (
                  <button key={slide.badge} type="button" onClick={() => setHeroSlide(index)} className={`w-3 h-3 rounded-full shadow-md transition-colors ${index === heroSlide ? 'bg-brand-main' : 'bg-white/50 hover:bg-white'}`} />
                ))}
              </div>
            </div>

            {/* SİZİN İÇİN SEÇTİKLERİMİZ (DİNAMİK) */}
            <div className="container mx-auto px-4 py-16">
              <div className="flex justify-between items-end mb-8 border-b pb-4">
                <h3 className="text-3xl font-bold text-gray-800">Sizin İçin Seçtiklerimiz</h3>
                <button type="button" onClick={() => navigate('category', 'Tüm Ürünler')} className="text-brand-main text-sm font-semibold hover:underline">
                  Tümünü İncele <i className="fas fa-chevron-right text-xs ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Admin panelinden isRecommended seçilen ürünleri göster */}
                {products.filter(p => p.isRecommended).slice(0, 4).map((product) => (
                  <ProductCard key={`sizin-${product.id}`} product={product} onNavigateDetail={(id) => navigate('detail', id)} onAddToCart={addToCart} />
                ))}
              </div>
            </div>

            {/* İKONLU HİZMET MENÜSÜ */}
            <div className="container mx-auto px-4 py-12 bg-gray-100 rounded-2xl mb-16 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 text-center">
                    {[
                        { icon: 'fa-truck-loading', title: 'Ücretsiz Teslimat' },
                        { icon: 'fa-tools', title: 'Ücretsiz Montaj' },
                        { icon: 'fa-shield-alt', title: '5 Yıl Garanti' },
                        { icon: 'fa-hand-holding-usd', title: 'Kolay İade' },
                        { icon: 'fa-credit-card', title: 'Taksit Seçenekleri' },
                        { icon: 'fa-comments', title: 'Canlı Destek' },
                        { icon: 'fa-store', title: 'Mağazadan Teslim' },
                        { icon: 'fa-percent', title: 'Özel İndirimler' }
                    ].map((item, index) => (
                        <button key={index} type="button" className="flex flex-col items-center group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 hover:border-brand-main">
                            <div className="w-16 h-16 rounded-full bg-brand-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <i className={`fas ${item.icon} text-3xl text-brand-main`}/>
                            </div>
                            <span className="text-xs font-bold text-gray-800 group-hover:text-brand-main leading-tight">{item.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* İNDİRİMLİ ÜRÜNLER (DİNAMİK) */}
            <div className="container mx-auto px-4 py-16 bg-red-50/50 rounded-2xl shadow-sm border border-red-100 mb-16">
              <div className="flex justify-between items-end mb-8 border-b border-red-100 pb-4">
                <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <i className="fas fa-tags text-red-500"/> İndirimli Ürünler
                </h3>
                <button type="button" onClick={() => navigate('category', 'İndirimli Ürünler')} className="text-red-600 text-sm font-semibold hover:underline">
                  Tüm İndirimleri Gör <i className="fas fa-chevron-right text-xs ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Admin panelinden oldPrice girilen ürünleri göster */}
                {products.filter(p => p.oldPrice).slice(0, 4).map((product) => (
                  <ProductCard key={`indirim-${product.id}`} product={product} onNavigateDetail={(id) => navigate('detail', id)} onAddToCart={addToCart} />
                ))}
              </div>
            </div>

            {/* DÜĞÜN PAKETLERİ BANNER */}
            <div className="container mx-auto px-4 py-8 mb-16">
              <div className="bg-brand-dark rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                  <h4 className="text-brand-main font-bold tracking-widest uppercase mb-2">DÜĞÜN PAKETLERİ</h4>
                  <h2 className="text-white text-4xl font-bold mb-6">Evlenenlere Özel Büyük Fırsat!</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">Yatak odası, yemek odası ve koltuk takımından oluşan muhteşem üçlü düğün paketlerinde net %20 indirim sizi bekliyor.</p>
                  <button type="button" className="bg-brand-main text-white px-6 py-3 w-max rounded font-bold hover:bg-brand-secondary transition-colors">Paketleri İncele</button>
                </div>
                <div className="w-full md:w-1/2">
                  <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" alt="Promo" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* POPÜLER ÜRÜNLER (DİNAMİK) */}
            <div className="container mx-auto px-4 py-16 bg-white rounded-2xl shadow-sm border border-gray-100 mb-16">
              <div className="flex justify-between items-end mb-8 border-b pb-4">
                <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <i className="fas fa-fire text-orange-500"/> Popüler Ürünler
                </h3>
                <button type="button" onClick={() => navigate('category', 'Oturma Grupları')} className="text-brand-main text-sm font-semibold hover:underline">
                  Tümünü İncele <i className="fas fa-chevron-right text-xs ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Admin panelinden isPopular seçilen ürünleri göster */}
                {products.filter(p => p.isPopular).slice(0, 4).map((product) => (
                  <ProductCard key={`populer-${product.id}`} product={product} onNavigateDetail={(id) => navigate('detail', id)} onAddToCart={addToCart} />
                ))}
              </div>
            </div>

            {/* ONLİNE ÖZEL FIRSATLAR (DİNAMİK) */}
            <div className="container mx-auto px-4 py-16 bg-white rounded-2xl shadow-sm border border-gray-100 mb-16">
              <div className="flex justify-between items-end mb-8 border-b pb-4">
                <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <i className="fas fa-globe text-brand-main text-2xl"/> Online Özel Fırsatlar
                </h3>
                <button type="button" onClick={() => navigate('category', 'Online Özel')} className="text-brand-main text-sm font-semibold hover:underline">
                  Tümünü İncele <i className="fas fa-chevron-right text-xs ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {/* Admin panelinden isOnlineSpecial seçilen ürünleri göster */}
                {products.filter(p => p.isOnlineSpecial).slice(0, 4).map((product) => (
                  <ProductCard key={`online-${product.id}`} product={product} onNavigateDetail={(id) => navigate('detail', id)} onAddToCart={addToCart} />
                ))}
              </div>
            </div>

          </section>
        ) : null}

        {page === 'category' ? (
          <section className="bg-white py-10">
            <div className="container mx-auto px-4">
              <div className="text-xs text-gray-500 mb-6">
                <button type="button" onClick={() => navigate('home')} className="hover:text-brand-main">Anasayfa</button> <span className="mx-2">&gt;</span>
                <span className="text-gray-800 font-medium">{categoryName}</span>
              </div>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/4">
                  <div className="border border-gray-200 rounded p-6 sticky top-32">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2 uppercase text-gray-800">Filtreleme</h3>
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm mb-3 text-gray-700">Fiyat</h4>
                      <div className="space-y-3">
                        <label className="flex items-center text-sm text-gray-600 cursor-pointer"><input type="checkbox" className="mr-3 w-4 h-4 text-brand-main focus:ring-brand-main border-gray-300 rounded" /> 0 - 15.000 TL</label>
                        <label className="flex items-center text-sm text-gray-600 cursor-pointer"><input type="checkbox" className="mr-3 w-4 h-4 text-brand-main focus:ring-brand-main border-gray-300 rounded" /> 15.000 - 30.000 TL</label>
                        <label className="flex items-center text-sm text-gray-600 cursor-pointer"><input type="checkbox" className="mr-3 w-4 h-4 text-brand-main focus:ring-brand-main border-gray-300 rounded" /> 30.000 TL ve üzeri</label>
                      </div>
                    </div>
                    <button type="button" className="w-full bg-brand-main text-white py-2.5 rounded font-bold hover:bg-brand-secondary transition-colors text-sm">Filtreleri Uygula</button>
                  </div>
                </div>
                <div className="w-full lg:w-3/4">
                  <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">{categoryName}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Sırala:</span>
                      <select className="border border-gray-300 rounded py-1.5 px-3 text-sm focus:outline-none focus:border-brand-main bg-white">
                        <option>Önerilen</option>
                        <option>En Düşük Fiyat</option>
                        <option>En Yüksek Fiyat</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onNavigateDetail={(id) => navigate('detail', id)} onAddToCart={addToCart} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {page === 'detail' ? (
          <section className="bg-white py-8 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="text-xs text-gray-500 mb-8 pb-4 border-b border-gray-100">
                <button type="button" onClick={() => navigate('home')} className="hover:text-brand-main">Anasayfa</button> <span className="mx-2 text-gray-300">/</span>
                <button type="button" onClick={() => navigate('category', selectedProduct.category)} className="hover:text-brand-main">{selectedProduct.category}</button> <span className="mx-2 text-gray-300">/</span>
                <span className="text-gray-800 font-medium">{selectedProduct.name}</span>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                <div className="w-full lg:w-1/2">
                  <div className="rounded-xl overflow-hidden bg-gray-50 mb-6 h-[400px] md:h-[500px] flex items-center justify-center relative shadow-sm border border-gray-100">
                    <img src={detailThumbsImages[selectedDetailImageIndex]} alt={selectedProduct.name} className="w-full h-full object-cover transition-opacity duration-300" />
                  </div>
                  <div className="grid grid-cols-5 gap-3 md:gap-4 thumbnails-gallery">
                    {detailThumbs.map((index) => (
                      <button 
                        key={index} 
                        type="button" 
                        onClick={() => setSelectedDetailImageIndex(index)}
                        className={`rounded-lg p-0.5 bg-white cursor-pointer transition-all h-20 md:h-24 flex items-center justify-center overflow-hidden border-2 ${index === selectedDetailImageIndex ? 'border-brand-main ring-2 ring-brand-main' : 'border-gray-200 hover:border-brand-main/50'}`}
                      >
                        <img src={detailThumbsImages[index]} alt={`${selectedProduct.name} - ${index + 1}`} className="max-w-full max-h-full object-cover rounded-md" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col pt-4 lg:pt-0">
                  <div className="flex justify-between items-start mb-3">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight flex-grow pr-4">{selectedProduct.name}</h1>
                    <div className="flex items-center space-x-2 text-gray-400">
                        <button type="button" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 hover:text-brand-main transition" title="Favorilerime Ekle"><i className="far fa-heart text-xl"/></button>
                        <button type="button" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 hover:text-brand-main transition" title="Paylaş"><i className="fas fa-share-alt text-xl"/></button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">Ürün Kodu: <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs">MRT-{1000 + selectedProduct.id}</span></div>

                  <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        {selectedProduct.badge ? <span className="bg-red-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm tracking-wider uppercase">{selectedProduct.badge}</span> : <div/>}
                        {selectedProduct.oldPrice ? <span className="bg-red-100 text-red-700 text-xs font-extrabold px-3 py-1 rounded-full">%13 İNDİRİM</span> : null}
                    </div>
                    <div className="flex items-baseline gap-4 mb-1">
                      <span className="text-5xl font-extrabold text-brand-main">{selectedProduct.priceStr}</span>
                      {selectedProduct.oldPrice ? <span className="text-2xl text-gray-400 line-through font-medium">{selectedProduct.oldPrice}</span> : null}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">KDV Dahildir. Peşin fiyatına 3 taksit fırsatı!</p>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg">Ürün Selesi <span className="text-gray-500 font-medium text-sm ml-2">({selectedColor})</span></h4>
                    <div className="flex flex-wrap gap-4">
                        {['Antrasit Gri', 'Krem Beyaz', 'Derin Mavi'].map(color => (
                            <button 
                                key={color} 
                                type="button" 
                                onClick={() => setSelectedColor(color)}
                                className={`px-5 py-3 rounded-lg font-semibold text-sm transition border-2 flex items-center gap-2 ${selectedColor === color ? 'border-brand-main bg-brand-main text-white shadow-md' : 'border-gray-200 bg-white hover:border-brand-main hover:text-brand-main'}`}
                            >
                                {color === 'Derin Mavi' ? <i className="fas fa-check text-xs"/> : null} {color}
                            </button>
                        ))}
                    </div>
                  </div>

                  <div className="mb-10">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg">Malzeme Seçimi <span className="text-gray-500 font-medium text-sm ml-2">({selectedMaterial})</span></h4>
                    <div className="flex flex-wrap gap-4">
                        {['Boşluk Dlanrı'].map(mat => (
                            <button 
                                key={mat} 
                                type="button" 
                                onClick={() => setSelectedMaterial(mat)}
                                className={`px-5 py-3 rounded-lg font-semibold text-sm transition border-2 ${selectedMaterial === mat ? 'border-brand-main bg-brand-main text-white shadow-md' : 'border-gray-200 bg-white hover:border-brand-main hover:text-brand-main'}`}
                            >
                                {mat}
                            </button>
                        ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 mb-12 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-full sm:w-40 h-16 bg-gray-50">
                      <button type="button" className="w-1/3 h-full bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold text-2xl transition" onClick={() => setCurrentQty((value) => Math.max(1, value - 1))} title="Azalt">-</button>
                      <input type="text" value={currentQty} className="w-1/3 h-full text-center border-none focus:outline-none font-bold text-gray-900 bg-white text-xl" readOnly />
                      <button type="button" className="w-1/3 h-full bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold text-2xl transition" onClick={() => setCurrentQty((value) => value + 1)} title="Arttır">+</button>
                    </div>
                    <button type="button" onClick={() => addToCart(selectedProduct.id, currentQty, selectedColor, selectedMaterial)} className="flex-1 bg-brand-main text-white rounded-xl font-bold text-xl hover:bg-brand-secondary transition-all shadow-lg hover:shadow-xl h-16 flex justify-center items-center gap-3 w-full">
                      <i className="fas fa-shopping-bag text-2xl" /> SEPETE EKLE
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-4 p-5 bg-green-50 rounded-lg border border-green-100">
                        <i className="fas fa-truck text-3xl text-green-600"/>
                        <div>
                            <span className="font-bold text-green-900 block text-lg">Ücretsiz Teslimat</span>
                            <span className="text-sm text-green-700">Türkiye geneli ücretsiz kargo ve kurulum.</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-lg border border-blue-100">
                        <i className="fas fa-shield-alt text-3xl text-blue-600"/>
                        <div>
                            <span className="font-bold text-blue-900 block text-lg">5 Yıl Garanti</span>
                            <span className="text-sm text-blue-700">Tüm ürünler 5 yıl Muratoğlu güvencesindedir.</span>
                        </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <details className="group py-6 border-b border-gray-100" open>
                      <summary className="flex justify-between items-center font-bold text-gray-900 cursor-pointer list-none text-xl transition hover:text-brand-main">
                        <span>Ürün Detayları</span>
                        <span className="transition group-open:rotate-180 text-brand-main"><i className="fas fa-chevron-down" /></span>
                      </summary>
                      <div className="text-gray-700 mt-5 text-base leading-relaxed pl-2 space-y-4 prose max-w-none">
                        {selectedProduct.desc.split('\n').map((paragraph, index) => (
                            paragraph.startsWith('Realistik Ürün:') ? null : <p key={index}>{paragraph}</p>
                        ))}
                        {selectedProduct.desc.includes('Realistik Ürün:') ? (
                            <p className="font-mono text-xs text-gray-500 bg-gray-100 p-3 rounded mt-2">
                                {selectedProduct.desc.split('Realistik Ürün:')[1].trim()}
                            </p>
                        ) : null}
                        <p>Muratoğlu Alışveriş Merkezi ayrıcalığıyla, modern yaşam alanları için tasarlandı.</p>
                      </div>
                    </details>
                    <details className="group py-6 border-b border-gray-100">
                      <summary className="flex justify-between items-center font-bold text-gray-900 cursor-pointer list-none text-xl transition hover:text-brand-main">
                        <span>Ölçüler & Teslimat</span>
                        <span className="transition group-open:rotate-180 text-brand-main"><i className="fas fa-chevron-down" /></span>
                      </summary>
                      <div className="text-gray-700 mt-5 text-base leading-relaxed pl-2 space-y-3 prose max-w-none">
                        <p><strong>Ölçüler:</strong> 280cm x 170cm (L-Tasarım). Yatak ölçüsü: 240cm x 150cm.</p>
                        <p>Türkiye geneli 21-30 iş günü içerisinde ücretsiz teslimat ve montaj hizmeti sunulmaktadır. İstanbul içi hızlı teslimat seçeneği mevcuttur.</p>
                      </div>
                    </details>
                    <details className="group py-6 border-b border-gray-100">
                      <summary className="flex justify-between items-center font-bold text-gray-900 cursor-pointer list-none text-xl transition hover:text-brand-main">
                        <span>Müşteri Yorumları</span>
                        <span className="transition group-open:rotate-180 text-brand-main"><i className="fas fa-chevron-down" /></span>
                      </summary>
                      <div className="text-gray-700 mt-5 text-base leading-relaxed pl-2 space-y-4">
                        Yorum bulunmamaktadır. İlk yorumu siz yapın!
                        <button type="button" className="text-brand-main font-semibold hover:underline block">Yorum Yaz</button>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
            
            <button type="button" className="fixed bottom-6 right-6 w-16 h-16 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-100 hover:scale-110 transition z-50 group border border-gray-100" title="Canlı Destek Başlat">
                <i className="fas fa-comment-dots text-3xl group-hover:text-brand-main transition"/>
            </button>
          </section>
        ) : null}

        {page === 'login' ? (
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4 flex justify-center">
              <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Giriş Yap</h2>
                <form onSubmit={(event) => { event.preventDefault(); addToast('Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz.'); window.setTimeout(() => navigate('home'), 1500); }}>
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-Posta Adresi</label>
                    <input type="email" required className="w-full px-4 py-3 rounded border border-gray-300 focus:border-brand-main focus:ring-1 focus:ring-brand-main outline-none transition-colors" placeholder="ornek@mail.com" />
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-700">Şifre</label>
                      <button type="button" className="text-xs text-brand-main hover:underline">Şifremi Unuttum</button>
                    </div>
                    <input type="password" required className="w-full px-4 py-3 rounded border border-gray-300 focus:border-brand-main focus:ring-1 focus:ring-brand-main outline-none transition-colors" placeholder="••••••••" />
                  </div>
                  <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3.5 rounded hover:bg-black transition-colors mb-4">GİRİŞ YAP</button>
                </form>
                <div className="text-center mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Hesabınız yok mu? <button type="button" className="text-brand-main font-bold hover:underline">Hemen Üye Ol</button></p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {page === 'cart' ? (
          <section className="bg-gray-50 py-10">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Sepetim</h2>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <i className="fas fa-shopping-bag text-5xl mb-4 text-gray-300" />
                      <p className="text-lg">Sepetinizde ürün bulunmamaktadır.</p>
                      <button type="button" onClick={() => navigate('home')} className="mt-4 text-brand-main font-bold hover:underline">Alışverişe Başla</button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold border-b pb-4 mb-4">Sepetinizdeki Ürünler ({cartCount})</h3>
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.color}-${item.material}`} className="flex flex-col sm:flex-row items-center border-b border-gray-100 py-4 gap-4">
                          <div className="w-24 h-24 bg-gray-50 rounded flex items-center justify-center p-2">
                            <img src={item.img} alt={item.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-gray-800">{item.name}</h4>
                            {item.color && item.material ? <span className="text-xs text-gray-500 block mt-1">{item.color} | {item.material}</span> : null}
                            <div className="text-brand-main font-extrabold mt-1">{item.priceStr}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex border border-gray-300 rounded overflow-hidden w-24">
                              <button type="button" className="w-1/3 bg-gray-50 hover:bg-gray-200 font-bold" onClick={() => updateCartItemQty(item.id, item.qty - 1)}>-</button>
                              <input type="text" value={item.qty} className="w-1/3 text-center border-none focus:outline-none text-sm font-bold" readOnly />
                              <button type="button" className="w-1/3 bg-gray-50 hover:bg-gray-200 font-bold" onClick={() => updateCartItemQty(item.id, item.qty + 1)}>+</button>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Sil">
                              <i className="far fa-trash-alt text-lg" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full lg:w-1/3">
                  {cart.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-32">
                      <h3 className="text-lg font-bold border-b pb-4 mb-4">Sipariş Özeti</h3>
                      <div className="flex justify-between mb-3 text-sm">
                        <span className="text-gray-600">Ara Toplam</span>
                        <span className="font-semibold">{formatMoney(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between mb-4 text-sm">
                        <span className="text-gray-600">Kargo</span>
                        <span className="font-semibold text-green-600">Ücretsiz</span>
                      </div>
                      <div className="border-t pt-4 mb-6 flex justify-between items-center">
                        <span className="font-bold text-lg">Toplam</span>
                        <span className="font-extrabold text-2xl text-brand-main">{formatMoney(cartTotal)}</span>
                      </div>
                      <button type="button" onClick={() => addToast('Siparişiniz alınıyor (Demo Bitti)')} className="w-full bg-brand-main text-white font-bold py-4 rounded hover:bg-brand-secondary transition-colors flex justify-center items-center">
                        ALIŞVERİŞİ TAMAMLA <i className="fas fa-chevron-right ml-2 text-sm" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1 uppercase">MURATOĞLU</h1>
              <h2 className="text-brand-secondary font-bold tracking-widest text-xs mb-6 uppercase">Alışveriş Merkezi</h2>
              <p className="text-sm text-gray-400 mb-6">Muratoğlu Alışveriş Merkezi, estetik tasarımı ve üstün kalite anlayışıyla yıllardır evlerinizi güzelleştirmeye devam ediyor.</p>
              <div className="flex space-x-4">
                <button type="button" className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center hover:bg-brand-main text-white transition-colors"><i className="fab fa-facebook-f" /></button>
                <button type="button" className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center hover:bg-brand-main text-white transition-colors"><i className="fab fa-instagram" /></button>
                <button type="button" className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center hover:bg-brand-main text-white transition-colors"><i className="fab fa-youtube" /></button>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Hakkımızda</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button type="button" className="hover:text-brand-main transition-colors">Kurumsal</button></li>
                <li><button type="button" className="hover:text-brand-main transition-colors">Mağazalarımız</button></li>
                <li><button type="button" className="hover:text-brand-main transition-colors">İnsan Kaynakları</button></li>
                <li><button type="button" className="hover:text-brand-main transition-colors">KVKK Metni</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Müşteri Hizmetleri</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button type="button" className="hover:text-brand-main transition-colors">Sıkça Sorulan Sorular</button></li>
                <li><button type="button" className="hover:text-brand-main transition-colors">Teslimat Bilgileri</button></li>
                <li><button type="button" className="hover:text-brand-main transition-colors">İade ve Garanti</button></li>
                <li><button type="button" className="hover:text-brand-main transition-colors">İletişim Formu</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">İletişim</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center">
                  <i className="fas fa-phone-alt mr-3 text-brand-main" />
                  <span className="text-xl text-white font-bold">0850 222 33 99</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-3 text-brand-main" />
                  <span>info@muratogluavm.com.tr</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; 2026 Muratoğlu Alışveriş Merkezi. Tüm hakları saklıdır.</p>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <span className="bg-gray-800 px-2 py-1 rounded">VISA</span>
              <span className="bg-gray-800 px-2 py-1 rounded">MasterCard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
