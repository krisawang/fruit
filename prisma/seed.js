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
  const displayName = process.env.SEED_ADMIN_DISPLAY_NAME || "�ֿ����Ա";
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
      displayName: "����Ա",
      phone: "13900139000",
      passwordHash: hashPassword("member123456"),
      role: UserRole.CLERK,
      permissions: defaultMemberPermissions
    },
    create: {
      username: "member-demo",
      displayName: "����Ա",
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
      name: "�츻ʿƻ��",
      brand: "���ʲ�",
      category: "ƻ��",
      origin: "ɽ����̨",
      packageType: PackageType.PACKAGED,
      variety: "�츻ʿ",
      storageTemp: "0-4C",
      foodLicense: "SC11437061200011",
      mainImage: "/uploads/demo/apple-main.jpg",
      detailImages: ["/uploads/demo/apple-1.jpg", "/uploads/demo/apple-2.jpg"],
      detailContent: "���������������֭���ʺ��̳����Ź�������",
      quantity: 4200,
      unit: "kg",
      unitSpec: "10kg/��",
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
      name: "�����㽶",
      brand: "Dole",
      category: "�㽶",
      origin: "���ɱ�",
      packageType: PackageType.BULK,
      variety: "��ѿ��",
      storageTemp: "12-14C",
      foodLicense: "SC12144030000218",
      mainImage: "/uploads/demo/banana-main.jpg",
      detailImages: ["/uploads/demo/banana-1.jpg", "/uploads/demo/banana-2.jpg"],
      detailContent: "�ʺϼ�ʳ���ۣ�����ȸߣ���Ҫ���ȳ��⡣",
      quantity: 980,
      unit: "kg",
      unitSpec: "ɢװ",
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
