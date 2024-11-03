const categories = {
  office: "办公家具",
  living: "客厅家具",
  dining: "餐厅家具",
  bedroom: "卧室家具",
  outdoor: "户外家具",
  kids: "儿童家具",
  storage: "收纳整理",
  accent: "装饰家具"
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const baseProducts = [
  // Office Furniture
  {
    id: generateId(),
    name: "人体工学行政办公椅",
    nameEn: "Executive Ergonomic Chair",
    price: 299.99,
    description: "高级人体工学办公椅，配备腰部支撑和可调节功能，适合长时间办公使用。",
    descriptionEn: "Premium ergonomic office chair with advanced lumbar support and adjustable features.",
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1589364222378-4267fced0fa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "网布和金属",
      materialEn: "Mesh and Metal",
      dimensions: "宽66厘米 x ��66厘米 x 高96-107厘米",
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
    name: "L型转角办公桌",
    nameEn: "L-Shaped Corner Desk",
    price: 249.99,
    description: "宽敞的L型办公桌，完美适合家庭办公或专业办公环境。",
    descriptionEn: "Spacious L-shaped desk perfect for home office or professional settings.",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "工程木材，金属",
      materialEn: "Engineered Wood, Metal",
      dimensions: "宽152厘米 x 深152厘米 x 高76厘米",
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
    name: "现代转角沙发",
    nameEn: "Modern Sectional Sofa",
    price: 899.99,
    description: "现代L型转角沙发，配有贵妃椅和高级面料装饰。",
    descriptionEn: "Contemporary L-shaped sectional with chaise lounge and premium upholstery.",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "高级面料",
      materialEn: "Premium Fabric",
      dimensions: "宽264厘米 x 深213厘米 x 高86厘米",
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
    description: "现代可延伸餐桌，配有延长板，非常适合家庭聚餐。",
    descriptionEn: "Modern dining table with extension leaf, perfect for family gatherings.",
    images: [
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "实木",
      materialEn: "Solid Wood",
      dimensions: "长183-244厘米 x 宽107厘米 x 高76厘米",
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
    name: "现代板式双人床",
    nameEn: "Queen Platform Bed",
    price: 449.99,
    description: "现代板式床，配有床头板和木条床板支撑。",
    descriptionEn: "Modern platform bed with headboard and wood slat support.",
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "实木，金属",
      materialEn: "Solid Wood, Metal",
      dimensions: "长218厘米 x 宽163厘米 x 高122厘米",
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
    name: "庭院休闲家具套装",
    nameEn: "Patio Conversation Set",
    price: 799.99,
    description: "四件套户外家具，包括沙发、椅子和茶几。",
    descriptionEn: "4-piece outdoor furniture set including sofa, chairs, and table.",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "防风雨藤编，铝合金",
      materialEn: "Weather-Resistant Wicker, Aluminum",
      dimensions: "茶几：长89厘米 x 宽51厘米，沙发：宽198厘米",
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
    name: "儿童学习桌",
    nameEn: "Kids Study Desk",
    price: 149.99,
    description: "高度可调节的学习桌，适合成长中的孩子使用。",
    descriptionEn: "Height-adjustable study desk perfect for growing children.",
    images: [
      "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "中密度纤维板，钢材",
      materialEn: "MDF, Steel",
      dimensions: "宽102厘米 x 深61厘米 x 高76厘米",
      dimensionsEn: "40\"W x 24\"D x 30\"H",
      weight: "25公斤",
      weightEn: "25kg",
      color: ["白色", "粉色", "蓝色"],
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
    name: "储物柜",
    nameEn: "Storage Cabinet",
    price: 279.99,
    description: "多功能储物柜，配有可调节搁板。",
    descriptionEn: "Versatile storage cabinet with adjustable shelves.",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "工程木材",
      materialEn: "Engineered Wood",
      dimensions: "宽91厘米 x 深46厘米 x 高183厘米",
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
    name: "装饰扶手椅",
    nameEn: "Accent Armchair",
    price: 329.99,
    description: "时尚装饰扶手椅，配有舒适的软包装饰。",
    descriptionEn: "Stylish accent chair with comfortable upholstery.",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    specifications: {
      material: "天鹅绒，实木",
      materialEn: "Velvet, Wood",
      dimensions: "宽71厘米 x 深81厘米 x 高89厘米",
      dimensionsEn: "28\"W x 32\"D x 35\"H",
      weight: "18公斤",
      weightEn: "18kg",
      color: ["蓝色", "绿色", "灰色"],
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