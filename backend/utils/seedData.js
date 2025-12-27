import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Event from '../models/Event.js';

dotenv.config();
connectDB();

const users = [
  {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@jaduniv.edu.in',
    password: 'password123',
    year: '3rd yr CSE',
    bio: 'Coding enthusiast | ML Explorer',
    isAdmin: true
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@jaduniv.edu.in',
    password: 'password123',
    year: '2nd yr IT',
    bio: 'Web developer | Design lover'
  },
  {
    name: 'Amit Das',
    email: 'amit.das@jaduniv.edu.in',
    password: 'password123',
    year: '4th yr CSE',
    bio: 'Final year | Placement prep mode'
  },
  {
    name: 'Sneha Roy',
    email: 'sneha.roy@jaduniv.edu.in',
    password: 'password123',
    year: '1st yr IT',
    bio: 'New to JU | Excited to connect'
  },
  {
    name: 'Arjun Mishra',
    email: 'arjun.mishra@jaduniv.edu.in',
    password: 'password123',
    year: '3rd yr IT',
    bio: 'Hackathon winner | Open source contributor'
  }
];

const posts = [
  { content: 'First day at JU! So excited to be here 🎉', authorIndex: 3 },
  { content: 'Anyone up for a coding session this weekend?', authorIndex: 0 },
  { content: 'Just finished my web dev project. Feeling accomplished!', authorIndex: 1 },
  { content: 'Placement season is tough but we got this! 💪', authorIndex: 2 },
  { content: 'Looking for team members for the upcoming hackathon', authorIndex: 4 }
];

const events = [
  {
    title: 'Tech Fest 2024',
    description: 'Annual technical festival with workshops and competitions',
    date: new Date('2024-12-25'),
    location: 'JU Main Auditorium',
    creatorIndex: 0
  },
  {
    title: 'Coding Workshop',
    description: 'Learn DSA and competitive programming',
    date: new Date('2024-12-20'),
    location: 'Computer Lab 3',
    creatorIndex: 4
  }
];

const seedData = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();
    await Event.deleteMany();
    
    console.log('Creating users...');
    const createdUsers = await User.create(users);
    
    console.log('Creating posts...');
    const postsToCreate = posts.map(post => ({
      ...post,
      author: createdUsers[post.authorIndex]._id
    }));
    await Post.create(postsToCreate);
    
    console.log('Creating events...');
    const eventsToCreate = events.map(event => ({
      ...event,
      creator: createdUsers[event.creatorIndex]._id,
      attendees: [createdUsers[event.creatorIndex]._id]
    }));
    await Event.create(eventsToCreate);
    
    console.log('Seed data created successfully!');
    console.log('Admin user: rahul.kumar@jaduniv.edu.in / password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();