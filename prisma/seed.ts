import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "ao-dai",
    title: "Áo Dài",
    titleVi: "Áo Dài Truyền Thống",
    description: "The timeless elegance of Vietnamese traditional dress, captured in light and soul.",
    descriptionVi: "Vẻ đẹp trường tồn của trang phục truyền thống Việt Nam.",
    accentColor: "#D4A5A5",
    tone: "Dusty Rose · Hồng Pastel · Truyền Thống",
  },
  {
    slug: "concept",
    title: "Nàng Thơ",
    titleVi: "Nàng Thơ · Concept",
    description: "Dreamy conceptual fine-art portraits where poetry meets light.",
    descriptionVi: "Những bức chân dung nghệ thuật mơ màng, nơi thơ ca gặp gỡ ánh sáng.",
    accentColor: "#C9A961",
    tone: "Film Grain · Vintage · Mơ Màng",
  },
  {
    slug: "wedding",
    title: "Cưới",
    titleVi: "Nhiếp Ảnh Cưới",
    description: "Love stories told through cinematic imagery and timeless emotion.",
    descriptionVi: "Những câu chuyện tình yêu được kể qua hình ảnh điện ảnh.",
    accentColor: "#EFE8DC",
    tone: "Trắng Kem · Romantic · Điện Ảnh",
  },
  {
    slug: "ky-yeu",
    title: "Kỷ Yếu",
    titleVi: "Ảnh Kỷ Yếu",
    description: "Youth captured in golden light — memories that last a lifetime.",
    descriptionVi: "Tuổi trẻ được ghi lại trong ánh nắng vàng.",
    accentColor: "#C9A961",
    tone: "Vàng Nắng · Youthful · Tươi Vui",
  },
];

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✓ Categories seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
