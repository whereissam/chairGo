const categories = {
  office: "辦公家具",
  living: "客廳家具",
  dining: "餐廳家具",
  bedroom: "臥室家具",
  outdoor: "戶外家具",
  kids: "兒童家具",
  storage: "收納整理",
  accent: "裝飾家具"
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const baseProducts = [
  // Office Furniture
  {
    id: generateId(),
    name: "人體工學行政辦公椅",
    nameEn: "Executive Ergonomic Chair",
    price: 299.99,
    description: "高級人體工學辦公椅，配備腰部支撐和可調節功能，適合長時間辦公使用。",
    descriptionEn: "Premium ergonomic office chair with advanced lumbar support and adjustable features.",
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1589364222378-4267fced0fa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "網布和金屬",
      materialEn: "Mesh and Metal",
      dimensions: "寬66公分 x 深66公分 x 高96-107公分",
      dimensionsEn: "26\"W x 26\"D x 38-42\"H",
      weight: "15公斤",
      weightEn: "15kg",
      color: ["黑色", "灰色"],
      colorEn: ["Black", "Gray"]
    },
    inStock: true,
    category: "office",
    rating: 4.5,
    reviews: 128
  },
  {
    id: generateId(),
    name: "L型轉角辦公桌",
    nameEn: "L-Shaped Corner Desk",
    price: 249.99,
    description: "寬敞的L型辦公桌，完美適合居家辦公或專業辦公環境。",
    descriptionEn: "Spacious L-shaped desk perfect for home office or professional settings.",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "工程木材，金屬",
      materialEn: "Engineered Wood, Metal",
      dimensions: "寬152公分 x 深152公分 x 高76公分",
      dimensionsEn: "60\"W x 60\"D x 30\"H",
      weight: "35公斤",
      weightEn: "35kg",
      color: ["橡木色", "白色"],
      colorEn: ["Oak", "White"]
    },
    inStock: true,
    category: "office",
    rating: 4.3,
    reviews: 95
  },
  // Living Room
  {
    id: generateId(),
    name: "現代轉角沙發",
    nameEn: "Modern Sectional Sofa",
    price: 899.99,
    description: "現代L型轉角沙發，配有貴妃椅和高級布料裝飾。",
    descriptionEn: "Contemporary L-shaped sectional with chaise lounge and premium upholstery.",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "高級布料",
      materialEn: "Premium Fabric",
      dimensions: "寬264公分 x 深213公分 x 高86公分",
      dimensionsEn: "104\"W x 84\"D x 34\"H",
      weight: "85公斤",
      weightEn: "85kg",
      color: ["灰色", "藏青色", "米色"],
      colorEn: ["Gray", "Navy", "Beige"]
    },
    inStock: true,
    category: "living",
    rating: 4.7,
    reviews: 203
  },
  // Dining Room
  {
    id: generateId(),
    name: "可延伸餐桌",
    nameEn: "Extendable Dining Table",
    price: 599.99,
    description: "現代可延伸餐桌，配有延長板，非常適合家庭聚餐。",
    descriptionEn: "Modern dining table with extension leaf, perfect for family gatherings.",
    images: [
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "實木",
      materialEn: "Solid Wood",
      dimensions: "長183-244公分 x 寬107公分 x 高76公分",
      dimensionsEn: "72-96\"L x 42\"W x 30\"H",
      weight: "45公斤",
      weightEn: "45kg",
      color: ["胡桃木色", "橡木色"],
      colorEn: ["Walnut", "Oak"]
    },
    inStock: true,
    category: "dining",
    rating: 4.6,
    reviews: 167
  },
  // Bedroom
  {
    id: generateId(),
    name: "現代板式雙人床",
    nameEn: "Queen Platform Bed",
    price: 449.99,
    description: "現代板式床，配有床頭板和木條床板支撐。",
    descriptionEn: "Modern platform bed with headboard and wood slat support.",
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "實木，金屬",
      materialEn: "Solid Wood, Metal",
      dimensions: "長218公分 x 寬163公分 x 高122公分",
      dimensionsEn: "86\"L x 64\"W x 48\"H",
      weight: "68公斤",
      weightEn: "68kg",
      color: ["深褐色", "灰色"],
      colorEn: ["Espresso", "Gray"]
    },
    inStock: true,
    category: "bedroom",
    rating: 4.8,
    reviews: 245
  },
  // Outdoor
  {
    id: generateId(),
    name: "庭院休閒家具組",
    nameEn: "Patio Conversation Set",
    price: 799.99,
    description: "四件組戶外家具，包括沙發、椅子和茶几。",
    descriptionEn: "4-piece outdoor furniture set including sofa, chairs, and table.",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "防風雨藤編，鋁合金",
      materialEn: "Weather-Resistant Wicker, Aluminum",
      dimensions: "茶几：長89公分 x 寬51公分，沙發：寬198公分",
      dimensionsEn: "Table: 35\"L x 20\"W, Sofa: 78\"W",
      weight: "55公斤",
      weightEn: "55kg",
      color: ["棕色", "米色"],
      colorEn: ["Brown", "Beige"]
    },
    inStock: true,
    category: "outdoor",
    rating: 4.4,
    reviews: 132
  },
  // Kids
  {
    id: generateId(),
    name: "兒童學習桌",
    nameEn: "Kids Study Desk",
    price: 149.99,
    description: "高度可調節的學習桌，適合成長中的孩子使用。",
    descriptionEn: "Height-adjustable study desk perfect for growing children.",
    images: [
      "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "中密度纖維板，鋼材",
      materialEn: "MDF, Steel",
      dimensions: "寬102公分 x 深61公分 x 高76公分",
      dimensionsEn: "40\"W x 24\"D x 30\"H",
      weight: "25公斤",
      weightEn: "25kg",
      color: ["白色", "粉色", "藍色"],
      colorEn: ["White", "Pink", "Blue"]
    },
    inStock: true,
    category: "kids",
    rating: 4.2,
    reviews: 89
  },
  // Storage
  {
    id: generateId(),
    name: "儲物櫃",
    nameEn: "Storage Cabinet",
    price: 279.99,
    description: "多功能儲物櫃，配有可調節層板。",
    descriptionEn: "Versatile storage cabinet with adjustable shelves.",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "工程木材",
      materialEn: "Engineered Wood",
      dimensions: "寬91公分 x 深46公分 x 高183公分",
      dimensionsEn: "36\"W x 18\"D x 72\"H",
      weight: "40公斤",
      weightEn: "40kg",
      color: ["白色", "橡木色"],
      colorEn: ["White", "Oak"]
    },
    inStock: true,
    category: "storage",
    rating: 4.4,
    reviews: 156
  },
  // Accent
  {
    id: generateId(),
    name: "裝飾扶手椅",
    nameEn: "Accent Armchair",
    price: 329.99,
    description: "時尚裝飾扶手椅，配有舒適的軟包裝飾。",
    descriptionEn: "Stylish accent chair with comfortable upholstery.",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "天鵝絨，實木",
      materialEn: "Velvet, Wood",
      dimensions: "寬71公分 x 深81公分 x 高89公分",
      dimensionsEn: "28\"W x 32\"D x 35\"H",
      weight: "18公斤",
      weightEn: "18kg",
      color: ["藍色", "綠色", "灰色"],
      colorEn: ["Blue", "Green", "Gray"]
    },
    inStock: true,
    category: "accent",
    rating: 4.6,
    reviews: 178
  }
];

// Create the initialProducts array with all products
const initialProducts = [...baseProducts];

export { categories, initialProducts }; 