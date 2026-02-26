let state = {
    currentUser: {
        name: 'Student User',
        email: 'student@uni.edu',
        bio: '',
        role: 'student'
    },
    events: [
        { id: 1, title: "Spring Career Fair 2024", category: "Career", date: "24 MAR", location: "Grand Hall", attendees: 450, capacity: 500, description: "Connect with over 100 top companies looking for interns and full-time employees. Bring your resume and dress professionally!", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop" },
        { id: 2, title: "AI Ethics Seminar", category: "Academic", date: "28 MAR", location: "Lec-102", attendees: 85, capacity: 100, description: "A deep dive into the moral implications of artificial intelligence in modern society. Guest speaker from OpenAI.", image: "https://images.unsplash.com/photo-1591115765373-520b7a0271d4?q=80&w=2070&auto=format&fit=crop" },
        { id: 3, title: "Varsity Basketball Finals", category: "Sports", date: "02 APR", location: "University Arena", attendees: 1200, capacity: 1500, description: "Come support the home team in the season finale against rival State University! Free t-shirts for the first 100 students.", image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop" },
        { id: 4, title: "Cultural Night 2024", category: "Cultural", date: "15 APR", location: "Campus Plaza", attendees: 600, capacity: 800, description: "A celebration of diversity through food, dance, and music. Performers from over 20 different student organizations.", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop" },
        { id: 5, title: "Web Dev Workshop", category: "Tech", date: "18 APR", location: "IT Lab 3", attendees: 45, capacity: 60, description: "Learn the basics of React and Tailwind CSS in this hands-on coding session. No prior experience required.", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" }
    ],
    rsvps: [],
    categories: ['All', 'Academic', 'Sports', 'Cultural', 'Tech', 'Career'],
};

module.exports = state;
