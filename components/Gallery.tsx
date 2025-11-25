
import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const Gallery: React.FC = () => {
  const { galleryData } = useData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="bg-black min-h-screen text-white pt-20 pb-24 relative">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-6">
            {galleryData.heading}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            {galleryData.subtext}
          </p>
        </div>

        {/* Masonry Grid Simulation using CSS columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryData.images.map((img) => (
            <div 
                key={img.id} 
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
                onClick={() => setSelectedImage(img.url)}
            >
              <img 
                src={img.url} 
                alt={img.caption || "Gallery Image"} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                 <p className="font-bold text-white text-lg">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
        >
            <button 
                className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors"
                onClick={() => setSelectedImage(null)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border-2 border-zinc-800"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            />
        </div>
      )}
    </div>
  );
};

export default Gallery;
