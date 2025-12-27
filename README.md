## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts/feed?page=1` - Get feed
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like/unlike post
- `GET /api/posts/:id/comments` - Get comments
- `POST /api/posts/:id/comments` - Add comment
- `GET /api/posts/search?q=query` - Search posts

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search/query?q=name` - Search users

### Friends
- `POST /api/friends/request/:id` - Send friend request
- `GET /api/friends/requests` - Get pending requests
- `PUT /api/friends/accept/:id` - Accept request
- `PUT /api/friends/reject/:id` - Reject request

### Events
- `GET /api/events` - Get upcoming events
- `POST /api/events` - Create event
- `POST /api/events/:id/rsvp` - RSVP to event

### Admin
- `DELETE /api/admin/posts/:id` - Delete post (admin only)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email domain validation (@jaduniv.edu.in only)
- XSS protection with input sanitization
- Rate limiting on auth endpoints
- CORS configuration
- File upload restrictions (5MB, images only)

## Features Not Implemented (Out of Scope)

- Video uploads
- Real-time chat/messaging
- Email verification (uses domain check only)
- Password reset
- Image compression
- Advanced analytics

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, contact the development team or open an issue on GitHub.

---

**Built with ❤️ for Jadavpur University students**
