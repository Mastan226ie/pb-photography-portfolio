import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Album from './models/Album.js';
import Testimonial from './models/Testimonial.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const users = [
  { email: 'pbvideography.0032@gmail.com', password: 'pb@1326' },
  { email: 'aretirajendrakumar@gmail.com', password: 'pb@1326' },
  { email: 'sravyavaranasi2005@gmail.com', password: 'pb@1326' },
  { email: 'venkatamastan.mudigonda@gmail.com', password: 'pb@1326' },
];

const albums = [
  {
    title: "Wedding Stories",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
    description: "Elegant wedding photography capturing love stories",
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519741347686-c1e0adad242d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&fit=crop",
    ],
    order: 1
  },
  {
    title: "Portrait Sessions",
    coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop",
    description: "Artistic portraits that reveal personality",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    ],
    order: 2
  },
  {
    title: "Nature & Landscape",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
    description: "Breathtaking landscapes and natural beauty",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop",
    ],
    order: 3
  },
  {
    title: "Events & Celebrations",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=800&fit=crop",
    description: "Capturing special moments and celebrations",
    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=1000&fit=crop",
    ],
    order: 4
  },
  {
    title: "Fashion & Editorial",
    coverImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop",
    description: "High-end fashion photography",
    photos: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop",
    ],
    order: 5
  },
  {
    title: "Street & Urban",
    coverImage: "https://images.unsplash.com/photo-1493605335038-f9cb907293a9?w=600&h=800&fit=crop",
    description: "Candid life and striking architecture in the metropolis",
    photos: [
      "https://images.unsplash.com/photo-1493605335038-f9cb907293a9?w=800&h=1000&fit=crop",
    ],
    order: 6
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Wedding Client",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content: "Absolutely breathtaking work! The photos captured every special moment of our wedding day perfectly. The attention to detail and creativity was outstanding. We'll cherish these memories forever.",
    rating: 5,
    date: "December 2024"
  },
  {
    name: "Michael Chen",
    role: "Portrait Client",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content: "Incredible photographer! Made me feel completely comfortable during the shoot. The results exceeded all expectations. Professional, creative, and truly talented.",
    rating: 5,
    date: "November 2024"
  },
  {
    name: "Emily Rodriguez",
    role: "Family Session",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    content: "Amazing experience from start to finish. The photos captured our family's personality perfectly.",
    rating: 5,
    date: "January 2025"
  },
  {
    name: "David Kim",
    role: "Corporate Event",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    content: "Professional, punctual, and produced stunning results. The team captured our corporate event perfectly.",
    rating: 5,
    date: "October 2024"
  }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Album.deleteMany();
    await Testimonial.deleteMany();

    await User.insertMany(users);
    await Album.insertMany(albums);
    await Testimonial.insertMany(testimonials);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
