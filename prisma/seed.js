const { PrismaClient, UserRole, InventoryStatus, PackageType } = require("@prisma/client");
const { randomBytes, scryptSync } = require("node:crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123456";
  const displayName = process.env.SEED_ADMIN_DISPLAY_NAME || "仓库管理员";

  await prisma.user.upsert({
    where: { username },
    update: {
      displayName,
      passwordHash: hashPassword(password),
      role: UserRole.ADMIN
    },
    create: {
      username,
      displayName,
      passwordHash: hashPassword(password),
      role: UserRole.ADMIN
    }
  });

  const now = new Date();
  const items = [
    {
      batchNo: "AP20260318A",
      name: "红富士苹果",
      brand: "果鲜仓",
      category: "苹果",
      origin: "山东烟台",
      packageType: PackageType.PACKAGED,
      variety: "红富士",
      storageTemp: "0-4C",
      foodLicense: "SC11437061200011",
      mainImage: "https://example.com/images/apple-main.jpg",
      detailImages: [
        "https://example.com/images/apple-1.jpg",
        "https://example.com/images/apple-2.jpg"
      ],
      detailContent: "果面完整，脆甜多汁，适合商超和团购渠道。",
      quantity: 4200,
      unit: "kg",
      unitSpec: "10kg/箱",
      netWeight: 10,
      price: 19.80,
      warehouseLocation: "A-01-03",
      inboundDate: addDays(now, -5),
      expiryDate: addDays(now, 20),
      lowStockThreshold: 1000,
      status: InventoryStatus.NORMAL
    },
    {
      batchNo: "BN20260321C",
      name: "都乐香蕉",
      brand: "Dole",
      category: "香蕉",
      origin: "菲律宾",
      packageType: PackageType.BULK,
      variety: "香芽蕉",
      storageTemp: "12-14C",
      foodLicense: "SC12144030000218",
      mainImage: "https://example.com/images/banana-main.jpg",
      detailImages: [
        "https://example.com/images/banana-1.jpg",
        "https://example.com/images/banana-2.jpg"
      ],
      detailContent: "适合即食销售，成熟度高，需要优先出库。",
      quantity: 980,
      unit: "kg",
      unitSpec: "散装",
      netWeight: 13.5,
      price: 12.60,
      warehouseLocation: "B-01-01",
      inboundDate: addDays(now, -2),
      expiryDate: addDays(now, 4),
      lowStockThreshold: 1200,
      status: InventoryStatus.EXPIRING
    }
  ];

  for (const item of items) {
    await prisma.fruitItem.upsert({
      where: { batchNo: item.batchNo },
      update: item,
      create: item
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

