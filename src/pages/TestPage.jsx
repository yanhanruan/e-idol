
const ProductCard = () => {
  const bookingUrl = "https://www.bilibili.com/video/BV1E1pBz1Eti/?spm_id_from=333.337.search-card.all.click";
  return (
    <a
      href={bookingUrl}
      target="_blank" // 在新标签页中打开，防止用户离开你的应用
      rel="noopener noreferrer" // 安全性考虑
      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
    >
      立即预约 (跳转到外部表单)
    </a>
  );
};

export default ProductCard;