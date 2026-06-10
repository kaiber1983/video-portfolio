interface VideoEmbedProps {
  videoUrl: string;
  platform: string;
  title: string;
}

export default function VideoEmbed({
  videoUrl,
  platform,
  title,
}: VideoEmbedProps) {
  // 根据平台生成对应的嵌入 URL
  const getEmbedUrl = (): string => {
    if (platform === "youtube") {
      return videoUrl; // YouTube 直接存 embed URL
    }
    if (platform === "bilibili") {
      // 从 BV 号生成 Bilibili 播放器嵌入链接
      const bvMatch = videoUrl.match(/BV[\w]+/);
      if (bvMatch) {
        return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&page=1&high_quality=1`;
      }
    }
    return videoUrl;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
      />
    </div>
  );
}
