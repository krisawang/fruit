const { PrismaClient, UserRole, InventoryStatus, PackageType } = require("@prisma/client");
const { randomBytes, scryptSync } = require("node:crypto");

const prisma = new PrismaClient();

const defaultMemberPermissions = {
  dashboard: true,
  inventory: true,
  inbound: false,
  outbound: false,
  loss: false,
  batches: true,
  reports: false,
  users: false
};

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
  const displayName = process.env.SEED_ADMIN_DISPLAY_NAME || "\u4ed3\u5e93\u7ba1\u7406\u5458";
  const phone = process.env.SEED_ADMIN_PHONE || "13800138000";

  await prisma.user.upsert({
    where: { username },
    update: {
      displayName,
      phone,
      passwordHash: hashPassword(password),
      role: UserRole.ADMIN,
      permissions: null
    },
    create: {
      username,
      displayName,
      phone,
      passwordHash: hashPassword(password),
      role: UserRole.ADMIN
    }
  });

  await prisma.user.upsert({
    where: { username: "member-demo" },
    update: {
      displayName: "\u5e93\u5b58\u6210\u5458",
      phone: "13900139000",
      passwordHash: hashPassword("member123456"),
      role: UserRole.CLERK,
      permissions: defaultMemberPermissions
    },
    create: {
      username: "member-demo",
      displayName: "\u5e93\u5b58\u6210\u5458",
      phone: "13900139000",
      passwordHash: hashPassword("member123456"),
      role: UserRole.CLERK,
      permissions: defaultMemberPermissions
    }
  });

  const now = new Date();
  const items = [
    {
      batchNo: "AP20260318A",
      name: "\u7ea2\u5bcc\u58eb\u82f9\u679c",
      brand: "\u679c\u9c9c\u4ed3",
      category: "\u82f9\u679c",
      origin: "\u5c71\u4e1c\u70df\u53f0",
      packageType: PackageType.PACKAGED,
      variety: "\u7ea2\u5bcc\u58eb",
      storageTemp: "0-4C",
      foodLicense: "SC11437061200011",
      mainImage: "/uploads/demo/apple-main.jpg",
      detailImages: ["/uploads/demo/apple-1.jpg", "/uploads/demo/apple-2.jpg"],
      detailContent: "\u679c\u9762\u5b8c\u6574\uff0c\u8106\u751c\u591a\u6c41\uff0c\u9002\u5408\u5546\u8d85\u548c\u56e2\u8d2d\u6e20\u9053\u3002",
      quantity: 4200,
      unit: "kg",
      unitSpec: "10kg/\u7bb1",
      netWeight: 10,
      price: 19.8,
      warehouseLocation: "A-01-03",
      inboundDate: addDays(now, -5),
      expiryDate: addDays(now, 20),
      lowStockThreshold: 1000,
      status: InventoryStatus.NORMAL
    },
    {
      batchNo: "BN20260321C",
      name: "\u90fd\u4e50\u9999\u8549",
      brand: "Dole",
      category: "\u9999\u8549",
      origin: "\u83f2\u5f8b\u5bbe",
      packageType: PackageType.BULK,
      variety: "\u9999\u82bd\u8549",
      storageTemp: "12-14C",
      foodLicense: "SC12144030000218",
      mainImage: "/uploads/demo/banana-main.jpg",
      detailImages: ["/uploads/demo/banana-1.jpg", "/uploads/demo/banana-2.jpg"],
      detailContent: "\u9002\u5408\u5373\u98df\u9500\u552e\uff0c\u6210\u719f\u5ea6\u9ad8\uff0c\u9700\u8981\u4f18\u5148\u51fa\u5e93\u3002",
      quantity: 980,
      unit: "kg",
      unitSpec: "\u6563\u88c5",
      netWeight: 13.5,
      price: 12.6,
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
