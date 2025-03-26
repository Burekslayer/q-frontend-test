export async function fetchPhotos() {
  // Generate 50 random prices between 100 and 1000 locally
  const prices = Array.from({ length: 50 }, () =>
      Math.floor(Math.random() * (1000 - 100 + 1)) + 100
  );

  // Fetch photos from Picsum
  const photosResponse = await fetch('https://picsum.photos/v2/list?page=2&limit=50');
  const photosData = await photosResponse.json();

  // Map photos with prices
  const photos = photosData.map((item, index) => ({
      id: item.id,
      src: item.download_url,
      width: item.width,
      height: item.height,
      alt: item.author,
      paintingPrice: `$${prices[index]}`
  }));

  return photos;
}