import React, { useState, useEffect, useRef } from 'react';

type GalleryProductType = {
  images: string[];
};

const Gallery = ({ images }: GalleryProductType) => {
  const [currentImage, setCurrentImage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  // Función para iniciar o reiniciar el intervalo
  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
  };

  // Iniciar el intervalo al montar el componente
  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  // Manejar clics en las miniaturas
  const handleThumbnailClick = (index: number) => {
    setCurrentImage(index);
    startInterval(); // Reiniciar el intervalo al hacer clic
  };

  // Manejar el movimiento del mouse sobre la imagen principal
  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = imageRef.current!.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    imageRef.current!.style.setProperty('--mouse-x', `${x}%`);
    imageRef.current!.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <section className="product-gallery">
      <div className="product-gallery__thumbs">
        {images.map((image, index) => (
          <div
            key={image}
            className={`product-gallery__thumb ${index === currentImage ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>

      <div
        className="product-gallery__image"
        onMouseMove={handleMouseMove}
        ref={imageRef}
      >
        <img src={images[currentImage]} alt={`Product image ${currentImage + 1}`} />
      </div>
    </section>
  );
};

export default Gallery;
