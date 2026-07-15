import { useEffect, useMemo, useState } from 'react';

const statusClassMap = {
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  orange: 'bg-orange-100 text-orange-700',
  blue: 'bg-blue-100 text-blue-700',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-gray-100 text-gray-700'
};

const tabLabels = {
  dashboard: 'Panel',
  products: 'Ürünler',
  categories: 'Kategoriler',
  customers: 'Müşteriler',
  orders: 'Siparişler',
  staff: 'Personeller'
};

const singularLabels = {
  products: 'Ürün',
  categories: 'Kategori',
  customers: 'Müşteri',
  orders: 'Sipariş',
  staff: 'Personel'
};

const fieldLabels = {
  name: 'Ad Soyad / Ürün Adı',
  categoryId: 'Kategori',
  category: 'Kategori',
  priceStr: 'Fiyat (Örn: 24.500 TL)',
  oldPrice: 'Eski Fiyat (Örn: 28.000 TL)',
  img: 'Ürün Görselleri (Bir veya Daha Fazla Seç)',
  colorVariants: 'Ürün Renkleri',
  materialOptions: 'Malzeme Seçenekleri',
  badge: 'Rozet (Örn: YENİ)',
  desc: 'Açıklama',
  isRecommended: 'Sizin İçin Seçtiklerimiz Vitrini',
  isPopular: 'Popüler Ürünler Vitrini',
  isOnlineSpecial: 'Online Özel Vitrini',
  email: 'E-posta',
  phone: 'Telefon',
  ordersCount: 'Sipariş Sayısı',
  totalSpentNum: 'Toplam Harcama',
  orderNo: 'Sipariş No',
  customerName: 'Müşteri',
  date: 'Tarih',
  totalNum: 'Toplam Tutar',
  status: 'Durum',
  statusColor: 'Durum Rengi',
  role: 'Görev',
  description: 'Açıklama',
  sortOrder: 'Sıra'
};

const formConfigs = {
  products: [
    { name: 'name', type: 'text' },
    { name: 'categoryId', type: 'select' },
    { name: 'priceStr', type: 'text' },
    { name: 'oldPrice', type: 'text' },
    { name: 'img', type: 'image-upload' }, // Dosya yükleme tipi olarak değiştirdik
    { name: 'colorVariants', type: 'variant-list' },
    { name: 'materialOptions', type: 'option-list' },
    { name: 'badge', type: 'text' },
    { name: 'desc', type: 'textarea' },
    { name: 'isRecommended', type: 'checkbox' },
    { name: 'isPopular', type: 'checkbox' },
    { name: 'isOnlineSpecial', type: 'checkbox' }
  ],
  customers: [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'ordersCount', type: 'number' },
    { name: 'totalSpentNum', type: 'number' }
  ],
  orders: [
    { name: 'orderNo', type: 'text' },
    { name: 'customerName', type: 'text' },
    { name: 'date', type: 'text' },
    { name: 'totalStr', type: 'text' },
    { name: 'status', type: 'text' },
    { name: 'statusColor', type: 'select' }
  ],
  staff: [
    { name: 'name', type: 'text' },
    { name: 'role', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'status', type: 'text' },
    { name: 'statusColor', type: 'select' }
  ],
  categories: [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'sortOrder', type: 'number' }
  ]
};

const emptyForms = {
  products: {
    name: '',
    categoryId: '',
    priceStr: '',
    oldPrice: '',
    img: '',
    detailImages: [],
    colorVariants: [],
    materialOptions: [],
    badge: '',
    desc: '',
    isRecommended: false,
    isPopular: false,
    isOnlineSpecial: false
  },
  customers: { name: '', email: '', phone: '', ordersCount: 0, totalSpentNum: 0 },
  orders: { orderNo: '', customerName: '', date: '', totalStr: '', status: 'Hazırlanıyor', statusColor: 'orange' },
  staff: { name: '', role: '', email: '', status: 'Aktif', statusColor: 'green' },
  categories: { name: '', description: '', sortOrder: 0 }
};

const requiredFields = {
  products: ['name', 'categoryId', 'priceStr', 'desc'],
  customers: ['name', 'email', 'phone'],
  orders: ['orderNo', 'customerName', 'date', 'totalStr', 'status'],
  staff: ['name', 'role', 'email', 'status'],
  categories: ['name']
};

function formatMoney(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
}

function parseMoney(value) {
  return Number(String(value ?? '').replace(/[^0-9]/g, '')) || 0;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Görsel okunamadı.'));
    reader.readAsDataURL(file);
  });
}

function createEmptyColorVariant() {
  return { name: '', img: '' };
}

function AdminProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col relative group hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gray-50 flex items-center justify-center p-4">
        <img src={product.img} alt={product.name} className="max-h-full object-contain" />
      </div>
      <button
        type="button"
        onClick={() => onDelete(product)}
        className="absolute top-2 right-2 bg-white/90 text-gray-400 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all shadow-md"
        title="Sil"
      >
        <i className="fas fa-trash-alt text-sm" />
      </button>
      <button
        type="button"
        onClick={() => onEdit(product)}
        className="absolute top-2 left-2 bg-white/90 text-gray-500 hover:bg-brand-main hover:text-white w-8 h-8 rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all shadow-md"
        title="Düzenle"
      >
        <i className="fas fa-pen text-xs" />
      </button>
      <div className="p-4 border-t">
        <div className="text-xs text-brand-main font-bold">{product.category}</div>
        <div className="text-sm font-bold text-gray-800 truncate">{product.name}</div>
        <div className="text-base font-extrabold text-gray-900 mt-2">{product.priceStr}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, icon, tone = 'gray' }) {
  const toneClasses = {
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    red: 'bg-red-50 text-red-700 border-red-100'
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold opacity-75">{label}</div>
          <div className="text-3xl font-extrabold mt-2">{value}</div>
          {hint ? <div className="text-xs mt-2 opacity-80">{hint}</div> : null}
        </div>
        <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
          <i className={`fas ${icon} text-lg`} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel({ navigate, addToast, products, addProduct, updateProduct, deleteProduct }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState('products');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForms.products);
  const [validationErrors, setValidationErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Veritabanı işlemleri için genel URL (localhost silindi)
  const baseUrl = '/api';

  const apiRequest = async (path, options) => {
    const response = await fetch(`${baseUrl}${path}`, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    if (response.status === 204) {
      return null;
    }
    return response.json();
  };

  const refreshAdminData = async () => {
    setLoading(true);
    try {
      const [categoryData, customerData, orderData, staffData, statsData] = await Promise.all([
        apiRequest('/categories'),
        apiRequest('/customers'),
        apiRequest('/orders'),
        apiRequest('/staff'),
        apiRequest('/admin/stats')
      ]);
      setCategories(categoryData || []);
      setCustomers(customerData || []);
      setOrders(orderData || []);
      setStaff(staffData || []);
      setStats(statsData || null);
    } catch (error) {
      console.error('Admin veri yükleme hatası:', error);
      addToast('Admin verileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  const openModal = (type, item = null) => {
    setEditingType(type);
    setEditingItem(item);
    const nextItem = item ? { ...emptyForms[type], ...item } : { ...emptyForms[type] };
    if (type === 'products' && item) {
      const existingImages = Array.isArray(item.detailImages) && item.detailImages.length > 0 ? item.detailImages : item.img ? [item.img] : [];
      nextItem.categoryId = item.categoryId ?? categories.find((category) => category.name === item.category)?.id ?? '';
      nextItem.detailImages = [...existingImages];
      nextItem.colorVariants = Array.isArray(item.colorVariants) ? item.colorVariants : [];
      nextItem.materialOptions = Array.isArray(item.materialOptions) ? item.materialOptions : [];
      nextItem.img = item.img || existingImages[0] || '';
    }
    if (type === 'products' && !item) {
      nextItem.detailImages = [];
      nextItem.colorVariants = [];
      nextItem.materialOptions = [];
      nextItem.img = '';
    }
    setFormData(nextItem);
    setValidationErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setValidationErrors({});
  };

  const getMissingFields = (type, payload) => requiredFields[type].filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  const normalizePayload = (type, payload) => {
    if (type === 'products') {
      const detailImages = Array.isArray(payload.detailImages)
        ? payload.detailImages.filter(Boolean)
        : [];
      const colorVariants = Array.isArray(payload.colorVariants)
        ? payload.colorVariants
            .map((variant) => ({
              name: String(variant?.name ?? '').trim(),
              img: variant?.img || ''
            }))
            .filter((variant) => variant.name || variant.img)
        : [];
      const materialOptions = Array.isArray(payload.materialOptions)
        ? payload.materialOptions.map((option) => String(option ?? '').trim()).filter(Boolean)
        : [];
      const mainImage = colorVariants[0]?.img || detailImages[0] || payload.img || '';
      const primaryImage = detailImages[0] || payload.img || '';
      return {
        ...payload,
        categoryId: Number(payload.categoryId) || null,
        priceNum: parseMoney(payload.priceStr),
        img: mainImage,
        detailImages: detailImages.length > 0 ? detailImages : mainImage ? [mainImage] : [],
        colorVariants,
        materialOptions
      };
    }
    if (type === 'customers') {
      return { ...payload, ordersCount: Number(payload.ordersCount) || 0, totalSpentNum: Number(payload.totalSpentNum) || 0 };
    }
    if (type === 'orders') {
      return { ...payload, totalNum: parseMoney(payload.totalStr) };
    }
    if (type === 'categories') {
      return { ...payload, sortOrder: Number(payload.sortOrder) || 0 };
    }
    return payload;
  };

  const saveItem = async () => {
    try {
      const payload = normalizePayload(editingType, formData);
      const missingFields = getMissingFields(editingType, payload);

      if (editingType === 'products') {
        const hasAnyImage = Boolean(payload.img) || (Array.isArray(payload.detailImages) && payload.detailImages.length > 0) || (Array.isArray(payload.colorVariants) && payload.colorVariants.some((variant) => variant.img));
        if (!hasAnyImage) {
          setValidationErrors({ img: 'En az bir ürün görseli ekleyin.' });
          addToast('En az bir ürün görseli ekleyin.');
          return;
        }
      }

      if (missingFields.length > 0) {
        const nextErrors = Object.fromEntries(missingFields.map((field) => [field, 'Bu alan zorunludur.']));
        setValidationErrors(nextErrors);
        addToast(`Zorunlu alanları doldurun: ${missingFields.map((field) => fieldLabels[field] || field).join(', ')}`);
        return;
      }

      setValidationErrors({});
      addToast('Kaydediliyor...');

      if (editingType === 'products') {
        if (editingItem) {
          await updateProduct({ ...editingItem, ...payload });
        } else {
          await addProduct(payload);
        }
      } else if (editingType === 'categories') {
        const endpoint = `/categories${editingItem ? `/${editingItem.id}` : ''}`;
        const method = editingItem ? 'PUT' : 'POST';
        await apiRequest(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        const endpoint = `/${editingType}${editingItem ? `/${editingItem.id}` : ''}`;
        const method = editingItem ? 'PUT' : 'POST';
        await apiRequest(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      await refreshAdminData();
      addToast('İşlem başarıyla tamamlandı!');
      closeModal();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      addToast('İşlem kaydedilemedi. Hata: Yüklediğiniz görsel çok büyük olabilir.');
    }
  };

  const removeItem = async (type, item) => {
    if (!window.confirm(`"${item.name || item.orderNo}" silinsin mi?`)) return;
    try {
      if (type === 'products') await deleteProduct(item.id);
      else await apiRequest(`/${type}/${item.id}`, { method: 'DELETE' });
      await refreshAdminData();
      addToast('Kayıt silindi!');
    } catch (error) {
      addToast('Kayıt silinemedi.');
    }
  };

  const dashboardStats = useMemo(() => {
    return [
      { label: 'Toplam Ürün', value: stats?.productsCount ?? products.length, hint: `${stats?.recommendedProductsCount ?? 0} seçilmiş ürün`, icon: 'fa-box', tone: 'blue' },
      { label: 'Kategori', value: stats?.categoriesCount ?? categories.length, hint: 'Ürün ilişkileriyle bağlı', icon: 'fa-layer-group', tone: 'gray' },
      { label: 'Müşteri', value: stats?.customersCount ?? customers.length, hint: `${formatMoney(stats?.totalCustomerSpend ?? 0)} toplam harcama`, icon: 'fa-users', tone: 'green' },
      { label: 'Sipariş', value: stats?.ordersCount ?? orders.length, hint: `${stats?.pendingOrdersCount ?? 0} hazırlanıyor`, icon: 'fa-shopping-cart', tone: 'orange' },
      { label: 'Personel', value: stats?.staffCount ?? staff.length, hint: 'Aktif ekip yönetimi', icon: 'fa-id-badge', tone: 'gray' },
      { label: 'Ciro', value: formatMoney(stats?.totalRevenue ?? 0), hint: `${stats?.deliveredOrdersCount ?? 0} teslim edilmiş sipariş`, icon: 'fa-chart-line', tone: 'red' },
      { label: 'Online Özel', value: stats?.onlineSpecialProductsCount ?? 0, hint: 'Online vitrindeki ürünler', icon: 'fa-globe', tone: 'blue' }
    ];
  }, [categories.length, customers.length, orders.length, products.length, staff.length, stats]);

  const modalFields = formConfigs[editingType] || [];
  const currentList = editingType === 'products' ? products : editingType === 'categories' ? categories : editingType === 'customers' ? customers : editingType === 'orders' ? orders : staff;
  const tabTitle = tabLabels[activeTab] || 'Panel';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold text-brand-main mb-2">MURATOĞLU AVM</h2>
        <p className="text-xs text-gray-400 mb-8">Yönetim Paneli</p>
        <ul className="space-y-4 text-sm font-bold text-gray-400">
          {Object.keys(tabLabels).map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer hover:text-white capitalize ${activeTab === tab ? 'text-white' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <i className={`fas fa-${tab === 'dashboard' ? 'chart-pie' : tab === 'products' ? 'box' : tab === 'orders' ? 'shopping-cart' : tab === 'customers' ? 'users' : 'id-badge'} w-6`} /> {tabLabels[tab]}
            </li>
          ))}
          <li className="cursor-pointer text-red-500 pt-8" onClick={() => navigate('home')}><i className="fas fa-sign-out-alt w-6" /> Siteye Dön</li>
        </ul>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{tabTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">Tüm veriler doğrudan veritabanından okunur ve CRUD işlemleri senkron çalışır.</p>
          </div>
          {activeTab !== 'dashboard' ? (
            <button type="button" onClick={() => openModal(activeTab)} className="bg-brand-main text-white px-4 py-2 rounded font-bold shadow-sm">
              Yeni {singularLabels[activeTab] || 'Kayıt'} Ekle
            </button>
          ) : null}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {dashboardStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Öne Çıkan Ürünler</h3>
                  <span className="text-xs text-gray-500">{products.filter((product) => product.isPopular).length} kayıt</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {products.filter((product) => product.isPopular).slice(0, 4).map((product) => (
                    <AdminProductCard key={product.id} product={product} onEdit={() => openModal('products', product)} onDelete={(item) => removeItem('products', item)} />
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Son Siparişler</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <div className="font-semibold text-gray-800">{order.orderNo}</div>
                        <div className="text-xs text-gray-500">{order.customerName} · {order.date}</div>
                      </div>
                      <div className={`text-xs font-bold px-3 py-1 rounded-full ${statusClassMap[order.statusColor] || statusClassMap.gray}`}>{order.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            {loading ? <div className="text-sm text-gray-500 mb-4">Veriler yükleniyor...</div> : null}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {currentList.map((product) => (
                <AdminProductCard key={product.id} product={product} onEdit={(item) => openModal('products', item)} onDelete={(item) => removeItem('products', item)} />
              ))}
            </div>
            <button onClick={() => openModal('products')} className="bg-brand-main text-white px-4 py-2 rounded mb-4 font-bold">Yeni Ürün Ekle</button>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase">
                  <th className="p-3">Ad</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Fiyat</th>
                  <th className="p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b text-sm">
                    <td className="py-3 px-3">{product.name}</td>
                    <td className="px-3">{product.category}</td>
                    <td className="px-3">{product.priceStr}</td>
                    <td className="px-3">
                      <button onClick={() => openModal('products', product)} className="text-blue-500 mr-4 font-bold">Düzenle</button>
                      <button onClick={() => removeItem('products', product)} className="text-red-500 font-bold">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Kategori Listesi</h3>
              <span className="text-xs text-gray-500">{categories.length} kayıt</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase">
                  <th className="p-3">Ad</th>
                  <th className="p-3">Açıklama</th>
                  <th className="p-3">Sıra</th>
                  <th className="p-3">Ürün</th>
                  <th className="p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b text-sm">
                    <td className="py-3 px-3 font-semibold">{category.name}</td>
                    <td className="px-3">{category.description || '-'}</td>
                    <td className="px-3">{category.sortOrder}</td>
                    <td className="px-3">{category.productCount}</td>
                    <td className="px-3">
                      <button onClick={() => openModal('categories', category)} className="text-blue-500 mr-4 font-bold">Düzenle</button>
                      <button onClick={() => removeItem('categories', category)} className="text-red-500 font-bold">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase">
                  <th className="p-3">Ad Soyad</th>
                  <th className="p-3">E-posta</th>
                  <th className="p-3">Telefon</th>
                  <th className="p-3">Sipariş</th>
                  <th className="p-3">Toplam Harcama</th>
                  <th className="p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b text-sm">
                    <td className="py-3 px-3 font-semibold">{customer.name}</td>
                    <td className="px-3">{customer.email}</td>
                    <td className="px-3">{customer.phone}</td>
                    <td className="px-3">{customer.ordersCount}</td>
                    <td className="px-3">{formatMoney(customer.totalSpentNum)}</td>
                    <td className="px-3">
                      <button onClick={() => openModal('customers', customer)} className="text-blue-500 mr-4 font-bold">Düzenle</button>
                      <button onClick={() => removeItem('customers', customer)} className="text-red-500 font-bold">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase">
                  <th className="p-3">Sipariş No</th>
                  <th className="p-3">Müşteri</th>
                  <th className="p-3">Tarih</th>
                  <th className="p-3">Toplam</th>
                  <th className="p-3">Durum</th>
                  <th className="p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b text-sm">
                    <td className="py-3 px-3 font-semibold">{order.orderNo}</td>
                    <td className="px-3">{order.customerName}</td>
                    <td className="px-3">{order.date}</td>
                    <td className="px-3">{order.totalStr}</td>
                    <td className="px-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusClassMap[order.statusColor] || statusClassMap.gray}`}>{order.status}</span>
                    </td>
                    <td className="px-3">
                      <button onClick={() => openModal('orders', order)} className="text-blue-500 mr-4 font-bold">Düzenle</button>
                      <button onClick={() => removeItem('orders', order)} className="text-red-500 font-bold">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase">
                  <th className="p-3">Ad Soyad</th>
                  <th className="p-3">Görev</th>
                  <th className="p-3">E-posta</th>
                  <th className="p-3">Durum</th>
                  <th className="p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b text-sm">
                    <td className="py-3 px-3 font-semibold">{member.name}</td>
                    <td className="px-3">{member.role}</td>
                    <td className="px-3">{member.email}</td>
                    <td className="px-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusClassMap[member.statusColor] || statusClassMap.gray}`}>{member.status}</span>
                    </td>
                    <td className="px-3">
                      <button onClick={() => openModal('staff', member)} className="text-blue-500 mr-4 font-bold">Düzenle</button>
                      <button onClick={() => removeItem('staff', member)} className="text-red-500 font-bold">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-[520px] max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Düzenle' : 'Yeni Ekle'} · {tabLabels[editingType] || ''}</h2>
            <div className="space-y-3">
              {modalFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                    {fieldLabels[field.name] || field.name}
                    {requiredFields[editingType].includes(field.name) ? <span className="text-red-500 ml-1">*</span> : null}
                  </label>
                  
                  {field.type === 'image-upload' ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className={`w-full border rounded p-2 text-sm ${validationErrors[field.name] ? 'border-red-400 ring-1 ring-red-200' : ''}`}
                        onChange={async (event) => {
                          const files = Array.from(event.target.files || []);
                          if (files.length === 0) return;

                          try {
                            const nextImages = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
                            setFormData((current) => {
                              const currentImages = Array.isArray(current.detailImages) ? current.detailImages : [];
                              const mergedImages = [...currentImages, ...nextImages].filter(Boolean);
                              return {
                                ...current,
                                detailImages: mergedImages,
                                img: mergedImages[0] || ''
                              };
                            });
                            event.target.value = '';
                          } catch (error) {
                            console.error('Görsel yükleme hatası:', error);
                            addToast('Görseller yüklenemedi.');
                          }
                        }}
                      />
                      {Array.isArray(formData.detailImages) && formData.detailImages.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                          {formData.detailImages.map((image, index) => (
                            <div key={`${image.slice(0, 24)}-${index}`} className="relative border border-gray-200 rounded p-1 bg-gray-50 aspect-square">
                              <img src={image} alt={`Önizleme ${index + 1}`} className="w-full h-full object-contain rounded" />
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((current) => {
                                    const nextImages = (current.detailImages || []).filter((_, imageIndex) => imageIndex !== index);
                                    return {
                                      ...current,
                                      detailImages: nextImages,
                                      img: nextImages[0] || ''
                                    };
                                  });
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                                title="Görseli kaldır"
                              >
                                <i className="fas fa-times" />
                              </button>
                              {index === 0 ? (
                                <span className="absolute bottom-2 left-2 bg-brand-main text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                                  Ana görsel
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <p className="text-[11px] text-gray-500">İlk seçilen görsel ana görsel olur. Diğerleri ürün detayında gösterilir.</p>
                    </div>
                  ) : field.type === 'variant-list' ? (
                    <div className="space-y-3">
                      {(formData.colorVariants || []).map((variant, index) => (
                        <div key={`${variant.name || 'variant'}-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-start border border-gray-100 rounded-lg p-3 bg-gray-50">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1">Renk Adı</label>
                            <input
                              type="text"
                              className="w-full border rounded p-2 text-sm"
                              value={variant.name ?? ''}
                              onChange={(event) => {
                                const nextValue = event.target.value;
                                setFormData((current) => {
                                  const nextVariants = [...(current.colorVariants || [])];
                                  nextVariants[index] = { ...nextVariants[index], name: nextValue };
                                  return { ...current, colorVariants: nextVariants };
                                });
                              }}
                              placeholder="Örn: Antrasit Gri"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1">Renk Görseli</label>
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full border rounded p-2 text-sm"
                              onChange={async (event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;

                                try {
                                  const image = await readFileAsDataUrl(file);
                                  setFormData((current) => {
                                    const nextVariants = [...(current.colorVariants || [])];
                                    nextVariants[index] = { ...nextVariants[index], img: image };
                                    return { ...current, colorVariants: nextVariants };
                                  });
                                  event.target.value = '';
                                } catch (error) {
                                  console.error('Renk görseli yükleme hatası:', error);
                                  addToast('Renk görseli yüklenemedi.');
                                }
                              }}
                            />
                            {variant.img ? (
                              <div className="mt-2 w-20 h-20 border border-gray-200 rounded p-1 bg-white">
                                <img src={variant.img} alt={variant.name || `Renk ${index + 1}`} className="w-full h-full object-contain" />
                              </div>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData((current) => ({
                              ...current,
                              colorVariants: (current.colorVariants || []).filter((_, variantIndex) => variantIndex !== index)
                            }))}
                            className="h-10 px-3 rounded bg-red-50 text-red-600 font-bold text-sm self-end md:self-start"
                          >
                            Sil
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData((current) => ({
                          ...current,
                          colorVariants: [...(current.colorVariants || []), createEmptyColorVariant()]
                        }))}
                        className="px-4 py-2 rounded bg-brand-accent text-brand-main font-bold text-sm"
                      >
                        Renk Ekle
                      </button>
                      <p className="text-[11px] text-gray-500">Tek renkli ürünlerde bu alanı boş bırakabilirsiniz. Birden fazla renk girerseniz detay sayfasında seçim görünür.</p>
                    </div>
                  ) : field.type === 'option-list' ? (
                    <div className="space-y-3">
                      {(formData.materialOptions || []).map((material, index) => (
                        <div key={`${material || 'material'}-${index}`} className="flex gap-2">
                          <input
                            type="text"
                            className="w-full border rounded p-2 text-sm"
                            value={material}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setFormData((current) => {
                                const nextMaterials = [...(current.materialOptions || [])];
                                nextMaterials[index] = nextValue;
                                return { ...current, materialOptions: nextMaterials };
                              });
                            }}
                            placeholder="Örn: Yatak"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData((current) => ({
                              ...current,
                              materialOptions: (current.materialOptions || []).filter((_, materialIndex) => materialIndex !== index)
                            }))}
                            className="px-3 rounded bg-red-50 text-red-600 font-bold text-sm"
                          >
                            Sil
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData((current) => ({
                          ...current,
                          materialOptions: [...(current.materialOptions || []), '']
                        }))}
                        className="px-4 py-2 rounded bg-brand-accent text-brand-main font-bold text-sm"
                      >
                        Malzeme Ekle
                      </button>
                      <p className="text-[11px] text-gray-500">Örnek: Yatak, Dolap, Komodin. Müşteri detay sayfasında birden fazla seçim yapabilir.</p>
                    </div>

                  ) : field.type === 'textarea' ? (
                    <textarea
                      className={`w-full border rounded p-2 min-h-28 text-sm ${validationErrors[field.name] ? 'border-red-400 ring-1 ring-red-200' : ''}`}
                      value={formData[field.name] ?? ''}
                      onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
                    />
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 text-sm border rounded p-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formData[field.name])}
                        onChange={(event) => setFormData({ ...formData, [field.name]: event.target.checked })}
                      />
                      {fieldLabels[field.name] || field.name}
                    </label>
                  ) : field.type === 'select' ? (
                    <select
                      className={`w-full border rounded p-2 text-sm ${validationErrors[field.name] ? 'border-red-400 ring-1 ring-red-200' : ''}`}
                      value={formData[field.name] ?? ''}
                      onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
                    >
                      {(field.name === 'statusColor'
                        ? ['green', 'yellow', 'orange', 'blue', 'red', 'gray']
                        : field.name === 'categoryId'
                          ? [{ value: '', label: 'Kategori seçin' }, ...categories.map((category) => ({ value: category.id, label: category.name }))]
                          : []).map((option) => (
                          <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      className={`w-full border rounded p-2 text-sm ${validationErrors[field.name] ? 'border-red-400 ring-1 ring-red-200' : ''}`}
                      value={formData[field.name] ?? ''}
                      placeholder={fieldLabels[field.name]}
                      onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
                    />
                  )}
                  {validationErrors[field.name] ? <div className="text-xs text-red-500 mt-1">{validationErrors[field.name]}</div> : null}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeModal} className="px-5 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">İptal</button>
              <button onClick={saveItem} className="px-5 py-2 bg-brand-main text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors shadow-md">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}