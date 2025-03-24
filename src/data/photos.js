export async function fetchPhotos() {
  const response = await fetch('https://picsum.photos/v2/list?page=2&limit=100');
  const data = await response.json();
  
  // Transform the data into the format expected by react-photo-album
  const photos = data.map(item => ({
    id: item.id, // Unique id
    src: item.download_url, // URL of the image
    width: item.width,      // Original width
    height: item.height,    // Original height
    alt: item.author        // Using author as alt text (or customize as needed)
  }));
  return photos;
}
  