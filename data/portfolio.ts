export type Category = "ao-dai" | "concept" | "wedding" | "ky-yeu";
export type MoodTag = "ethereal" | "romantic" | "youthful" | "cinematic" | "traditional" | "vintage";

export interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  title?: string;
  location?: string;
  year: number;
  mood: MoodTag[];
  camera?: string;
  lens?: string;
  iso?: number;
  featured?: boolean;
}

export interface PortfolioCategory {
  id: Category;
  slug: string;
  title: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  heroImage: string | null;
  accentColor: string;
  tone: string;
  images: PortfolioImage[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  contentVi: string;
  avatar: string;
  category: Category;
}

// ─── Blur placeholder (tiny base64 ivory gradient) ─────────────────────────
const blurIvory =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAHRAAAgMBAAMBAAAAAAAAAAAAAQIDBAASITH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqTQ3VzqZ2RKCpSJJcRMiCqFQcVUopOWxeAtCMrBi//Z";

// ─── Áo Dài Collection ────────────────────────────────────────────────────
const aoDaiImages: PortfolioImage[] = [
  {
    id: "ad-001",
    src: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&q=80",
    alt: "Áo dài đỏ truyền thống tại Hội An",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Hồn Phố Cổ",
    location: "Hội An, Quảng Nam",
    year: 2024,
    mood: ["traditional", "ethereal"],
    camera: "Sony A7R V",
    lens: "85mm f/1.4",
    iso: 100,
    featured: true,
  },
  {
    id: "ad-002",
    src: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
    alt: "Áo dài vàng tại vườn hoa",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Xuân Thì",
    location: "Đà Lạt, Lâm Đồng",
    year: 2024,
    mood: ["romantic", "ethereal"],
    camera: "Sony A7R V",
    lens: "50mm f/1.2",
    iso: 200,
    featured: true,
  },
  {
    id: "ad-003",
    src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    alt: "Áo dài pastel mùa xuân",
    width: 800,
    height: 1000,
    blurDataURL: blurIvory,
    title: "Nắng Sớm",
    location: "Huế, Thừa Thiên Huế",
    year: 2023,
    mood: ["traditional", "romantic"],
    camera: "Sony A7R IV",
    lens: "135mm f/1.8",
    iso: 100,
    featured: false,
  },
  {
    id: "ad-004",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    alt: "Áo dài trắng trên ruộng bậc thang",
    width: 800,
    height: 1067,
    blurDataURL: blurIvory,
    title: "Bình Yên",
    location: "Mù Cang Chải, Yên Bái",
    year: 2023,
    mood: ["ethereal", "cinematic"],
    camera: "Sony A7R V",
    lens: "85mm f/1.4",
    iso: 400,
    featured: true,
  },
  {
    id: "ad-005",
    src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
    alt: "Áo dài xanh lam tại chùa",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Tịnh Tâm",
    location: "Chùa Thầy, Hà Nội",
    year: 2023,
    mood: ["traditional", "ethereal"],
    camera: "Leica SL2",
    lens: "90mm f/2",
    iso: 200,
    featured: false,
  },
  {
    id: "ad-006",
    src: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80",
    alt: "Áo dài tím tại vườn sen",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Sen Hồ",
    location: "Tây Hồ, Hà Nội",
    year: 2024,
    mood: ["romantic", "traditional"],
    camera: "Sony A7R V",
    lens: "85mm f/1.4",
    iso: 100,
    featured: true,
  },
  {
    id: "ad-007",
    src: "https://images.unsplash.com/photo-1500259783852-0ca9ce8a64dc?w=800&q=80",
    alt: "Áo dài hoa nhí vintage",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Hoài Niệm",
    location: "Sài Gòn, TP.HCM",
    year: 2024,
    mood: ["vintage", "cinematic"],
    camera: "Nikon Z9",
    lens: "105mm f/1.4",
    iso: 320,
    featured: false,
  },
  {
    id: "ad-008",
    src: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80",
    alt: "Áo dài đen hiện đại",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Huyền Bí",
    location: "Studio, Sài Gòn",
    year: 2024,
    mood: ["cinematic", "ethereal"],
    camera: "Sony A7R V",
    lens: "85mm f/1.4",
    iso: 800,
    featured: true,
  },
];

// ─── Concept / Nàng Thơ Collection ──────────────────────────────────────
const conceptImages: PortfolioImage[] = [
  {
    id: "ct-001",
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
    alt: "Nàng thơ trong sương sớm",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Sương Mù",
    location: "Đà Lạt, Lâm Đồng",
    year: 2024,
    mood: ["ethereal", "vintage"],
    camera: "Sony A7R V",
    lens: "85mm f/1.4",
    iso: 400,
    featured: true,
  },
  {
    id: "ct-002",
    src: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=800&q=80",
    alt: "Ánh sáng vàng chiều tà",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Hoàng Hôn",
    location: "Nha Trang, Khánh Hoà",
    year: 2024,
    mood: ["cinematic", "ethereal"],
    camera: "Leica SL2",
    lens: "50mm f/1.4",
    iso: 200,
    featured: true,
  },
  {
    id: "ct-003",
    src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
    alt: "Nàng thơ giữa vườn hoa",
    width: 800,
    height: 1000,
    blurDataURL: blurIvory,
    title: "Giữa Muôn Hoa",
    location: "Sa Pa, Lào Cai",
    year: 2023,
    mood: ["romantic", "ethereal"],
    camera: "Sony A7R IV",
    lens: "85mm f/1.4",
    iso: 100,
    featured: false,
  },
  {
    id: "ct-004",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    alt: "Portrait mơ màng film grain",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Mơ Hồ",
    location: "Huế, Thừa Thiên Huế",
    year: 2023,
    mood: ["vintage", "cinematic"],
    camera: "Sony A7R V",
    lens: "35mm f/1.4",
    iso: 1600,
    featured: true,
  },
];

// ─── Wedding Collection ────────────────────────────────────────────────────
const weddingImages: PortfolioImage[] = [
  {
    id: "wd-001",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    alt: "Đôi uyên ương tại vườn hoa trắng",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Trọn Đời Bên Em",
    location: "Đà Lạt, Lâm Đồng",
    year: 2024,
    mood: ["romantic", "ethereal"],
    camera: "Sony A7R V",
    lens: "85mm f/1.4",
    iso: 100,
    featured: true,
  },
  {
    id: "wd-002",
    src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80",
    alt: "Cô dâu trong ánh sáng vàng",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Ngày Ấy",
    location: "Hội An, Quảng Nam",
    year: 2024,
    mood: ["romantic", "cinematic"],
    camera: "Sony A7R V",
    lens: "135mm f/1.8",
    iso: 200,
    featured: true,
  },
  {
    id: "wd-003",
    src: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80",
    alt: "Chi tiết váy cưới ren trắng",
    width: 800,
    height: 1000,
    blurDataURL: blurIvory,
    title: "Tinh Khôi",
    location: "Studio",
    year: 2023,
    mood: ["romantic"],
    camera: "Leica SL2",
    lens: "90mm Macro",
    iso: 100,
    featured: false,
  },
  {
    id: "wd-004",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    alt: "Đôi uyên ương tại biển hoàng hôn",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Biển Gọi",
    location: "Phú Quốc, Kiên Giang",
    year: 2024,
    mood: ["romantic", "cinematic"],
    camera: "Sony A7R V",
    lens: "50mm f/1.2",
    iso: 400,
    featured: true,
  },
];

// ─── Kỷ Yếu Collection ────────────────────────────────────────────────────
const kyYeuImages: PortfolioImage[] = [
  {
    id: "ky-001",
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    alt: "Nhóm bạn kỷ yếu dưới hoa anh đào",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Thanh Xuân",
    location: "Đà Lạt, Lâm Đồng",
    year: 2024,
    mood: ["youthful", "romantic"],
    camera: "Sony A7R V",
    lens: "35mm f/1.4",
    iso: 200,
    featured: true,
  },
  {
    id: "ky-002",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    alt: "Nhóm bạn vui vẻ tại sân trường",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Ngày Tháng Cũ",
    location: "Trường THPT, Hà Nội",
    year: 2024,
    mood: ["youthful"],
    camera: "Sony A7R V",
    lens: "24mm f/1.4",
    iso: 100,
    featured: true,
  },
  {
    id: "ky-003",
    src: "https://images.unsplash.com/photo-1523287562758-66c7fc58967f?w=800&q=80",
    alt: "Portrait cá nhân tốt nghiệp đại học",
    width: 800,
    height: 1000,
    blurDataURL: blurIvory,
    title: "Hành Trình Mới",
    location: "ĐH Quốc Gia, TP.HCM",
    year: 2023,
    mood: ["youthful", "cinematic"],
    camera: "Sony A7R V",
    lens: "85mm f/1.4",
    iso: 200,
    featured: false,
  },
  {
    id: "ky-004",
    src: "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?w=800&q=80",
    alt: "Nhóm kỷ yếu áo trắng phơi sáng",
    width: 800,
    height: 1200,
    blurDataURL: blurIvory,
    title: "Ánh Sáng Tuổi Trẻ",
    location: "Phú Quốc, Kiên Giang",
    year: 2024,
    mood: ["youthful", "ethereal"],
    camera: "Sony A7R V",
    lens: "50mm f/1.2",
    iso: 100,
    featured: true,
  },
];


// ─── Testimonials ────────────────────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: "t-001",
    name: "Nguyễn Linh Chi",
    role: "Cô Dâu · Đà Lạt 2024",
    content: "Every frame tells our story with a depth I never imagined possible. The light, the emotion — it was pure poetry.",
    contentVi: "Mỗi khung hình kể câu chuyện của chúng tôi với chiều sâu tôi chưa bao giờ nghĩ đến. Ánh sáng, cảm xúc — đó là thơ thuần khiết.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    category: "wedding",
  },
  {
    id: "t-002",
    name: "Trần Minh Anh",
    role: "Model · Concept Session 2024",
    content: "She made me feel like a goddess in every shot. The artistry is unparalleled — truly a master of Vietnamese fine-art photography.",
    contentVi: "Chị ấy khiến tôi cảm thấy như nữ thần trong từng tấm hình. Nghệ thuật không ai sánh được — thực sự là bậc thầy nhiếp ảnh nghệ thuật Việt Nam.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80",
    category: "concept",
  },
  {
    id: "t-003",
    name: "Lớp 12A1 — THPT Gia Định",
    role: "Kỷ Yếu 2024",
    content: "Best graduation photos in our school's history. We cried looking at them — so beautiful and so us.",
    contentVi: "Những tấm ảnh kỷ yếu đẹp nhất trong lịch sử trường. Chúng tôi đã khóc khi nhìn vào — quá đẹp và quá là chúng tôi.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    category: "ky-yeu",
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────
export const stats = [
  { value: 500, suffix: "+", label: "Shoots", labelVi: "Buổi Chụp" },
  { value: 6, suffix: "", label: "Years", labelVi: "Năm Kinh Nghiệm" },
  { value: 12, suffix: "", label: "Cities", labelVi: "Thành Phố" },
];
// ─── Hero slides ─────────────────────────────────────────────────────────
// Thay các URL bên dưới bằng link ảnh Cloudinary của bạn
// Sau khi upload ảnh lên admin, lấy URL từ Cloudinary dashboard
export const heroSlides = [
  {
    src: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=1920&q=85",
    alt: "Áo dài đỏ Hội An",
  },
  {
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1920&q=85",
    alt: "Nàng thơ sương sớm",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85",
    alt: "Ảnh cưới lãng mạn",
  },
];
