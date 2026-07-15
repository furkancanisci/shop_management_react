import express from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const app = express();

// ES Modules için __dirname ayarı
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS ayarını tamamen açıyoruz (403 hatalarını engeller)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// --- ÖNEMLİ: BASE64 İÇİN LİMİTLERİ 50MB'A ÇIKARDIK ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const dbConnectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_6tfr1dCGmyuJ@ep-steep-tooth-aswqg5cy-pooler.c-4.eu-central-1.aws.neon.tech/neondb';

// Neon Veritabanı Bağlantısı
const pool = new Pool({
  connectionString: dbConnectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const seedProducts = [
  { category: 'Yatak Odası', name: 'Palermo Yatak Odası Takımı', priceStr: '38.900 TL', priceNum: 38900, oldPrice: '45.000 TL', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', badge: 'YENİ', desc: 'Modern tasarımı ve ahşap dokusuyla Palermo, odanıza doğal bir ferahlık katar.', isRecommended: true, isPopular: false, isOnlineSpecial: false, detailImages: [] },
  { category: 'Oturma Grupları', name: 'Venedik Köşe Koltuk - Modern L-Tasarım', priceStr: '24.500 TL', priceNum: 24500, oldPrice: '28.000 TL', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80', badge: 'EN ÇOK SATAN', desc: 'Evinizin kalbinde, İtalyan estetiği ve üstün Türk işçiliğinin buluştuğu Venedik Köşe Koltuk, konforu yeniden tanımlıyor. Lüks modüler tasarımı, entegre teknolojik detayları ve dayanıklı kumaşıyla hem salonunuza şıklık katıyor hem de en keyifli anlarınıza eşlik ediyor. Masif ahşap iskeleti ve yüksek dansiteli süngerleri ile ömürlük bir konfor sunar.\nRealistik Ürün: Antrasit Gri, Pislozi koniur sanğu: 20.500 ml, Belunda sungizet angapır: 100 - slur sunar', isRecommended: true, isPopular: true, isOnlineSpecial: true, detailImages: ['https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80','https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=150&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80'] },
  { category: 'Yemek Odası', name: 'Milano Yemek Odası', priceStr: '29.900 TL', priceNum: 29900, oldPrice: '', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', badge: 'ÇOK SATAN', desc: 'Mermer desenli üst yüzey ve şık sandalyeler.', isRecommended: true, isPopular: true, isOnlineSpecial: false, detailImages: [] },
  { category: 'Yatak Odası', name: 'Lidya Sürgülü Gardırop', priceStr: '16.500 TL', priceNum: 16500, oldPrice: '19.000 TL', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80', badge: '%15 İNDİRİM', desc: 'Geniş iç hacmi ve sessiz kapanan kapak sistemi.', isRecommended: true, isPopular: true, isOnlineSpecial: false, detailImages: [] },
  { category: 'Tamamlayıcı Ürünler', name: 'Art Deco TV Ünitesi', priceStr: '8.250 TL', priceNum: 8250, oldPrice: '', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', badge: '', desc: 'Minimalist çizgiler ve metal ayak detayları.', isRecommended: false, isPopular: true, isOnlineSpecial: true, detailImages: [] },
  { category: 'Genç ve Çocuk Odası', name: 'Dynamic Genç Odası', priceStr: '21.000 TL', priceNum: 21000, oldPrice: '24.500 TL', img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80', badge: 'YENİ', desc: 'Çalışma masası, kitaplık ve yatak bir arada.', isRecommended: false, isPopular: false, isOnlineSpecial: true, detailImages: [] },
  { category: 'Yatak Odası', name: 'Comfort Ortopedik Yatak', priceStr: '7.400 TL', priceNum: 7400, oldPrice: '9.000 TL', img: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=800&q=80', badge: '', desc: 'Omurga destekli tam ortopedik yüzey.', isRecommended: false, isPopular: false, isOnlineSpecial: true, detailImages: [] },
  { category: 'Oturma Grupları', name: 'Krem Chester Koltuk', priceStr: '15.900 TL', priceNum: 15900, oldPrice: '', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80', badge: '', desc: 'Klasik chester stili, kolay silinebilir kumaş.', isRecommended: false, isPopular: false, isOnlineSpecial: true, detailImages: [] }
];

const seedCustomers = [
  { name: 'Cemal Demir', email: 'cemal@ornek.com', phone: '0555 123 4567', ordersCount: 3, totalSpentNum: 145000 },
  { name: 'Ahmet Yılmaz', email: 'ahmet@ornek.com', phone: '0532 222 3344', ordersCount: 5, totalSpentNum: 238500 },
  { name: 'Elif Kaya', email: 'elif@ornek.com', phone: '0541 987 6543', ordersCount: 2, totalSpentNum: 67800 }
];

const seedOrders = [
  { orderNo: '#ORD-9021', customerName: 'Cemal Demir', date: '27 Haziran 2026', totalStr: '38.900 TL', totalNum: 38900, status: 'Hazırlanıyor', statusColor: 'orange' },
  { orderNo: '#ORD-9020', customerName: 'Ahmet Yılmaz', date: '26 Haziran 2026', totalStr: '16.500 TL', totalNum: 16500, status: 'Kargolandı', statusColor: 'green' },
  { orderNo: '#ORD-9019', customerName: 'Elif Kaya', date: '25 Haziran 2026', totalStr: '29.900 TL', totalNum: 29900, status: 'Teslim Edildi', statusColor: 'blue' }
];

const seedStaff = [
  { name: 'Ali Yılmaz', role: 'Mağaza Müdürü', email: 'ali.yilmaz@muratogluavm.com.tr', status: 'Aktif', statusColor: 'green' },
  { name: 'Ayşe Demir', role: 'Satış Uzmanı', email: 'ayse.demir@muratogluavm.com.tr', status: 'Aktif', statusColor: 'green' },
  { name: 'Mehmet Arslan', role: 'Depo Sorumlusu', email: 'mehmet.arslan@muratogluavm.com.tr', status: 'İzinli', statusColor: 'yellow' }
];

const seedCategories = [
  { name: 'Oturma Grupları', description: 'Koltuk, köşe takımı ve berjer kategorileri', sortOrder: 1 },
  { name: 'Yemek Odası', description: 'Yemek masası ve yemek odası takımları', sortOrder: 2 },
  { name: 'Yatak Odası', description: 'Yatak odası, gardırop ve karyola', sortOrder: 3 },
  { name: 'Yatak', description: 'Yatak, baza ve uyku ürünleri', sortOrder: 4 },
  { name: 'Genç ve Çocuk Odası', description: 'Genç ve çocuk odası ürünleri', sortOrder: 5 },
  { name: 'Bahçe Mobilyası', description: 'Dış mekan mobilyaları', sortOrder: 6 },
  { name: 'Tamamlayıcı Ürünler', description: 'TV ünitesi ve tamamlayıcı ürünler', sortOrder: 7 },
  { name: 'İndirimli Ürünler', description: 'Kampanyalı ürünler', sortOrder: 8 }
];

const toSqlInsert = async (tableName, columns, row) => {
  const columnSql = columns.map((column) => `"${column}"`).join(', ');
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
  const values = columns.map((column) => row[column]);
  return pool.query(`INSERT INTO ${tableName} (${columnSql}) VALUES (${placeholders})`, values);
};

const seedTableIfEmpty = async (tableName, columns, rows) => {
  const { rows: countRows } = await pool.query(`SELECT COUNT(*)::int AS count FROM ${tableName}`);
  if (countRows[0].count > 0) {
    return;
  }

  for (const row of rows) {
    await toSqlInsert(tableName, columns, row);
  }
};

const mapProductRow = (product) => ({
  ...product,
  detailImages: Array.isArray(product.detailImages) ? product.detailImages : [],
  colorVariants: Array.isArray(product.colorVariants) ? product.colorVariants : [],
  materialOptions: Array.isArray(product.materialOptions) ? product.materialOptions : []
});

const mapCategoryRow = (category) => ({
  ...category
});

const withJsonbDetailImages = (rows) => rows.map((row) => ({
  ...row,
  detailImages: JSON.stringify(row.detailImages ?? []),
  colorVariants: JSON.stringify(row.colorVariants ?? []),
  materialOptions: JSON.stringify(row.materialOptions ?? [])
}));

// Veritabanı Tablosunu ve Başlangıç Verilerini Otomatik Oluşturma
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        category VARCHAR(255),
        "categoryId" INTEGER,
        name VARCHAR(255),
        "priceStr" VARCHAR(50),
        "priceNum" INTEGER,
        "oldPrice" VARCHAR(50),
        img TEXT,
        badge VARCHAR(50),
        "desc" TEXT,
        "isRecommended" BOOLEAN DEFAULT false,
        "isPopular" BOOLEAN DEFAULT false,
        "isOnlineSpecial" BOOLEAN DEFAULT false,
        "detailImages" JSONB DEFAULT '[]'::jsonb,
        "colorVariants" JSONB DEFAULT '[]'::jsonb,
        "materialOptions" JSONB DEFAULT '[]'::jsonb
      )
    `);

    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS "detailImages" JSONB DEFAULT '[]'::jsonb
    `);

    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS "colorVariants" JSONB DEFAULT '[]'::jsonb
    `);

    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS "materialOptions" JSONB DEFAULT '[]'::jsonb
    `);

    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS "categoryId" INTEGER
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        "sortOrder" INTEGER DEFAULT 0
      )
    `);

    await pool.query(`
      ALTER TABLE products
      ADD CONSTRAINT products_category_id_fkey
      FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE SET NULL
      DEFERRABLE INITIALLY DEFERRED
      NOT VALID
    `).catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        "ordersCount" INTEGER DEFAULT 0,
        "totalSpentNum" INTEGER DEFAULT 0
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        "orderNo" VARCHAR(50),
        "customerName" VARCHAR(255),
        date VARCHAR(100),
        "totalStr" VARCHAR(50),
        "totalNum" INTEGER DEFAULT 0,
        status VARCHAR(100),
        "statusColor" VARCHAR(20)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        role VARCHAR(255),
        email VARCHAR(255),
        status VARCHAR(100),
        "statusColor" VARCHAR(20)
      )
    `);

    await seedTableIfEmpty('products', ['category', 'name', 'priceStr', 'priceNum', 'oldPrice', 'img', 'badge', 'desc', 'isRecommended', 'isPopular', 'isOnlineSpecial', 'detailImages', 'colorVariants', 'materialOptions'], withJsonbDetailImages(seedProducts));
    await seedTableIfEmpty('categories', ['name', 'description', 'sortOrder'], seedCategories);
    await seedTableIfEmpty('customers', ['name', 'email', 'phone', 'ordersCount', 'totalSpentNum'], seedCustomers);
    await seedTableIfEmpty('orders', ['orderNo', 'customerName', 'date', 'totalStr', 'totalNum', 'status', 'statusColor'], seedOrders);
    await seedTableIfEmpty('staff', ['name', 'role', 'email', 'status', 'statusColor'], seedStaff);

    await pool.query(`
      UPDATE products p
      SET "categoryId" = c.id
      FROM categories c
      WHERE p."categoryId" IS NULL
        AND p.category = c.name
    `);

    console.log('✅ Neon veritabanı ve başlangıç tabloları hazır.');
  } catch (err) {
    console.error("❌ Veritabanı Hatası:", err);
  }
};
initDB();

const resolveCategory = async ({ categoryId, category }) => {
  if (categoryId) {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id=$1', [categoryId]);
    return rows[0] || null;
  }

  if (category) {
    const { rows } = await pool.query('SELECT * FROM categories WHERE name=$1', [category]);
    return rows[0] || null;
  }

  return null;
};

const buildStats = async () => {
  const [{ rows: productRows }, { rows: customerRows }, { rows: orderRows }, { rows: staffRows }] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count, COALESCE(SUM(CASE WHEN "isRecommended" THEN 1 ELSE 0 END), 0)::int AS recommended, COALESCE(SUM(CASE WHEN "isPopular" THEN 1 ELSE 0 END), 0)::int AS popular, COALESCE(SUM(CASE WHEN "isOnlineSpecial" THEN 1 ELSE 0 END), 0)::int AS online FROM products'),
    pool.query('SELECT COUNT(*)::int AS count, COALESCE(SUM("totalSpentNum"), 0)::int AS total_spent FROM customers'),
    pool.query('SELECT COUNT(*)::int AS count, COALESCE(SUM("totalNum"), 0)::int AS revenue, COALESCE(SUM(CASE WHEN status = $1 THEN 1 ELSE 0 END), 0)::int AS pending, COALESCE(SUM(CASE WHEN status = $2 THEN 1 ELSE 0 END), 0)::int AS shipped, COALESCE(SUM(CASE WHEN status = $3 THEN 1 ELSE 0 END), 0)::int AS delivered FROM orders', ['Hazırlanıyor', 'Kargolandı', 'Teslim Edildi']),
    pool.query('SELECT COUNT(*)::int AS count FROM staff')
  ]);

  return {
    productsCount: productRows[0].count,
    recommendedProductsCount: productRows[0].recommended,
    popularProductsCount: productRows[0].popular,
    onlineSpecialProductsCount: productRows[0].online,
    customersCount: customerRows[0].count,
    totalCustomerSpend: customerRows[0].total_spent,
    ordersCount: orderRows[0].count,
    totalRevenue: orderRows[0].revenue,
    pendingOrdersCount: orderRows[0].pending,
    shippedOrdersCount: orderRows[0].shipped,
    deliveredOrdersCount: orderRows[0].delivered,
    staffCount: staffRows[0].count,
    categoriesCount: (await pool.query('SELECT COUNT(*)::int AS count FROM categories')).rows[0].count
  };
};

const hasMissingFields = (payload, requiredFields) => requiredFields.filter((field) => {
  const value = payload[field];
  return value === undefined || value === null || String(value).trim() === '';
});

// --- API UÇ NOKTALARI ---

app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        p.*,
        COALESCE(c.name, p.category) AS category,
        c.id AS "categoryId",
        c.name AS "categoryName"
      FROM products p
      LEFT JOIN categories c ON c.id = p."categoryId"
      ORDER BY p.id DESC
    `);
    res.json(rows.map(mapProductRow));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', async (req, res) => {
  try {
    const { category, categoryId, name, priceStr, priceNum, oldPrice, img, badge, desc, isRecommended, isPopular, isOnlineSpecial, detailImages, colorVariants, materialOptions } = req.body;
    
    // detailImages artık bir array olmalı, değilse boş array yap
    const imagesArray = Array.isArray(detailImages) ? detailImages : [];
    const variantsArray = Array.isArray(colorVariants) ? colorVariants : [];
    const materialsArray = Array.isArray(materialOptions) ? materialOptions : [];

    const categoryRecord = await resolveCategory({ categoryId, category });
    const resolvedCategoryId = categoryRecord?.id ?? categoryId ?? null;
    const resolvedCategoryName = categoryRecord?.name ?? category ?? null;

    const { rows } = await pool.query(
      `INSERT INTO products (category, "categoryId", name, "priceStr", "priceNum", "oldPrice", img, badge, "desc", "isRecommended", "isPopular", "isOnlineSpecial", "detailImages", "colorVariants", "materialOptions")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [resolvedCategoryName, resolvedCategoryId, name, priceStr, priceNum, oldPrice, img, badge, desc, isRecommended, isPopular, isOnlineSpecial, JSON.stringify(imagesArray), JSON.stringify(variantsArray), JSON.stringify(materialsArray)]
    );
    res.json(mapProductRow(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});


app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, categoryId, name, priceStr, priceNum, oldPrice, img, badge, desc, isRecommended, isPopular, isOnlineSpecial, detailImages, colorVariants, materialOptions } = req.body;
    const missingFields = hasMissingFields(req.body, ['name', 'priceStr', 'img', 'desc']).concat(!categoryId && !category ? ['category'] : []);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Zorunlu alanlar eksik: ${missingFields.join(', ')}` });
    }

    const imagesArray = Array.isArray(detailImages) ? detailImages : [];
    const variantsArray = Array.isArray(colorVariants) ? colorVariants : [];
    const materialsArray = Array.isArray(materialOptions) ? materialOptions : [];

    const categoryRecord = await resolveCategory({ categoryId, category });
    const resolvedCategoryId = categoryRecord?.id ?? categoryId ?? null;
    const resolvedCategoryName = categoryRecord?.name ?? category ?? null;

    const { rows } = await pool.query(
      `UPDATE products SET category=$1, "categoryId"=$2, name=$3, "priceStr"=$4, "priceNum"=$5, "oldPrice"=$6, img=$7, badge=$8, "desc"=$9, "isRecommended"=$10, "isPopular"=$11, "isOnlineSpecial"=$12, "detailImages"=$13, "colorVariants"=$14, "materialOptions"=$15 WHERE id=$16 RETURNING *`,
      [resolvedCategoryName, resolvedCategoryId, name, priceStr, priceNum, oldPrice, img, badge, desc, isRecommended, isPopular, isOnlineSpecial, JSON.stringify(imagesArray), JSON.stringify(variantsArray), JSON.stringify(materialsArray), id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Ürün bulunamadı.' });
    }
    res.json(mapProductRow(rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        c.*,
        COALESCE(product_counts.count, 0)::int AS "productCount"
      FROM categories c
      LEFT JOIN (
        SELECT "categoryId", COUNT(*)::int AS count
        FROM products
        GROUP BY "categoryId"
      ) product_counts ON product_counts."categoryId" = c.id
      ORDER BY c."sortOrder" ASC, c.name ASC
    `);
    res.json(rows.map(mapCategoryRow));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;
    const missingFields = hasMissingFields(req.body, ['name']);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Zorunlu alanlar eksik: ${missingFields.join(', ')}` });
    }

    const { rows } = await pool.query(
      'INSERT INTO categories (name, description, "sortOrder") VALUES ($1, $2, $3) RETURNING *',
      [name, description || '', Number(sortOrder) || 0]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sortOrder } = req.body;
    const missingFields = hasMissingFields(req.body, ['name']);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Zorunlu alanlar eksik: ${missingFields.join(', ')}` });
    }

    const { rows } = await pool.query(
      'UPDATE categories SET name=$1, description=$2, "sortOrder"=$3 WHERE id=$4 RETURNING *',
      [name, description || '', Number(sortOrder) || 0, id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Kategori bulunamadı.' });
    }
    await pool.query('UPDATE products SET category=$1 WHERE "categoryId"=$2', [name, id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE products SET "categoryId" = NULL WHERE "categoryId"=$1', [id]);
    await pool.query('DELETE FROM categories WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/customers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM customers ORDER BY id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone, ordersCount, totalSpentNum } = req.body;
    const missingFields = hasMissingFields(req.body, ['name', 'email', 'phone']);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Zorunlu alanlar eksik: ${missingFields.join(', ')}` });
    }

    const { rows } = await pool.query(
      'INSERT INTO customers (name, email, phone, "ordersCount", "totalSpentNum") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, ordersCount ?? 0, totalSpentNum ?? 0]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, ordersCount, totalSpentNum } = req.body;
    const missingFields = hasMissingFields(req.body, ['name', 'email', 'phone']);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Zorunlu alanlar eksik: ${missingFields.join(', ')}` });
    }

    const { rows } = await pool.query(
      'UPDATE customers SET name=$1, email=$2, phone=$3, "ordersCount"=$4, "totalSpentNum"=$5 WHERE id=$6 RETURNING *',
      [name, email, phone, ordersCount ?? 0, totalSpentNum ?? 0, id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Müşteri bulunamadı.' });
    }
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM customers WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { orderNo, customerName, date, totalStr, totalNum, status, statusColor } = req.body;
    const missingFields = hasMissingFields(req.body, ['orderNo', 'customerName', 'date', 'totalStr', 'status']);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Zorunlu alanlar eksik: ${missingFields.join(', ')}` });
    }

    const { rows } = await pool.query(
      'INSERT INTO orders ("orderNo", "customerName", date, "totalStr", "totalNum", status, "statusColor") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [orderNo, customerName, date, totalStr, totalNum ?? 0, status, statusColor]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { orderNo, customerName, date, totalStr, totalNum, status, statusColor } = req.body;
    const missingFields = hasMissingFields(req.body, ['orderNo', 'customerName', 'date', 'totalStr', 'status']);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Zorunlu alanlar eksik: ${missingFields.join(', ')}` });
    }

    const { rows } = await pool.query(
      'UPDATE orders SET "orderNo"=$1, "customerName"=$2, date=$3, "totalStr"=$4, "totalNum"=$5, status=$6, "statusColor"=$7 WHERE id=$8 RETURNING *',
      [orderNo, customerName, date, totalStr, totalNum ?? 0, status, statusColor, id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Sipariş bulunamadı.' });
    }
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM orders WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/staff', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM staff ORDER BY id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/staff', async (req, res) => {
  try {
    const { name, role, email, status, statusColor } = req.body;
    const missingFields = hasMissingFields(req.body, ['name', 'role', 'email', 'status']);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Zorunlu alanlar eksik: ${missingFields.join(', ')}` });
    }

    const { rows } = await pool.query(
      'INSERT INTO staff (name, role, email, status, "statusColor") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, role, email, status, statusColor]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, status, statusColor } = req.body;
    const missingFields = hasMissingFields(req.body, ['name', 'role', 'email', 'status']);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Zorunlu alanlar eksik: ${missingFields.join(', ')}` });
    }

    const { rows } = await pool.query(
      'UPDATE staff SET name=$1, role=$2, email=$3, status=$4, "statusColor"=$5 WHERE id=$6 RETURNING *',
      [name, role, email, status, statusColor, id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Personel bulunamadı.' });
    }
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM staff WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const stats = await buildStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// React uygulamasını servis etmek için statik dosyaları yayınla
app.use(express.static(path.join(__dirname, 'dist')));

// API harici gelen tüm istekleri React'e (index.html) yönlendir
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT} portunda çalışıyor.`));