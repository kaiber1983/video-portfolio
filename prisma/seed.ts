import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 清空旧数据
  await prisma.project.deleteMany();
  await prisma.about.deleteMany();

  // 插入 5 条测试作品数据
  await prisma.project.createMany({
    data: [
      {
        title: "城市夜景航拍",
        description:
          "用无人机拍摄的城市夜景，展示了城市在夜晚的独特魅力。使用了 DJI Mini 3 Pro 拍摄，后期用 DaVinci Resolve 调色。",
        thumbnail:
          "https://images.unsplash.com/photo-1514565131-fce0801e2385?w=800",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
        tags: "航拍,城市,夜景",
        featured: true,
      },
      {
        title: "咖啡制作教程",
        description:
          "手把手教你做一杯完美的拿铁，从研磨豆子到拉花全过程。",
        thumbnail:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
        tags: "教程,咖啡,生活",
        featured: true,
      },
      {
        title: "旅行 Vlog：云南大理",
        description:
          "三天两夜的大理之旅，洱海边骑行、古城漫步、品尝当地美食。",
        thumbnail:
          "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
        videoUrl: "https://www.bilibili.com/video/BV1GJ411x7h7/",
        platform: "bilibili",
        tags: "旅行,Vlog,云南",
        featured: false,
      },
      {
        title: "产品评测：iPhone 15 Pro",
        description:
          "iPhone 15 Pro 两周使用体验，包括相机、性能和续航的详细评测。",
        thumbnail:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
        tags: "评测,科技,数码",
        featured: false,
      },
      {
        title: "延时摄影合集",
        description:
          "收集了过去一年的延时摄影作品，从日出到星空，展现自然之美。",
        thumbnail:
          "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=800",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
        tags: "延时摄影,自然,合集",
        featured: true,
      },
    ],
  });

  // 插入关于我数据
  await prisma.about.create({
    data: {
      name: "张三",
      bio: "热爱视频创作的独立内容制作者。擅长航拍、延时摄影和产品评测。希望用镜头记录世界的美好瞬间。\n\n器材：Sony A7M4 + DJI Mini 3 Pro\n软件：DaVinci Resolve + Adobe Premiere Pro",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      socialJson: JSON.stringify({
        bilibili: "https://space.bilibili.com/123456",
        youtube: "https://youtube.com/@demo",
        weibo: "https://weibo.com/demo",
      }),
    },
  });

  console.log("种子数据已插入完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
