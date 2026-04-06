import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AlbumBook from './AlbumBook'

const albums = [
  {
    id: 1,
    title: "Wedding Stories",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
    description: "Elegant wedding photography capturing love stories",
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519741347686-c1e0adad242d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=1000&fit=crop",
    ]
  },
  {
    id: 2,
    title: "Portrait Sessions",
    coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop",
    description: "Artistic portraits that reveal personality",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=800&h=1000&fit=crop",
    ]
  },
  {
    id: 3,
    title: "Nature & Landscape",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
    description: "Breathtaking landscapes and natural beauty",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=1000&fit=crop",
    ]
  },
  {
    id: 4,
    title: "Events & Celebrations",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=800&fit=crop",
    description: "Capturing special moments and celebrations",
    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=1000&fit=crop",
    ]
  },
  {
    id: 5,
    title: "Fashion & Editorial",
    coverImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop",
    description: "High-end fashion photography",
    photos: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
    ]
  }
]

const AlbumCollection = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null)

  return (
    <section id="albums" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm">Our Work</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mt-2 mb-4">
            Featured <span className="text-amber-500">Albums</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our curated collection of moments frozen in time, each telling a unique story through our lens.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setSelectedAlbum(album)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-playfair font-bold text-white mb-2">{album.title}</h3>
                    <p className="text-gray-300 text-sm">{album.description}</p>
                    <button className="mt-4 text-amber-500 font-semibold flex items-center gap-2 group/btn">
                      View Album
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Album Book Modal */}
      {selectedAlbum && (
        <AlbumBook album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
      )}
    </section>
  )
}

export default AlbumCollection