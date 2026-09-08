export type Material = {
  id: string;
  title: string;
  subject: string;
  course: string;
  semester: string;
  type: "Notes" | "PDF" | "Question Paper" | "Assignment" | "Practical File" | "Study Guide";
  author: string;
  uploadDate: string;
  downloads: number;
  rating: number;
  fileSize: string;
  description: string;
  tags: string[];
  status: "approved" | "pending" | "rejected";
  thumbnail?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  course: string;
  semester: string;
  role: "student" | "admin";
  uploads: number;
  downloads: number;
  profileImage?: string;
  joinDate: string;
};

export const CATEGORIES = [
  { id: "prog", name: "Programming", icon: "💻", color: "bg-blue-50 text-blue-600 border-blue-100", count: 124 },
  { id: "dbms", name: "Database Management", icon: "🗄️", color: "bg-indigo-50 text-indigo-600 border-indigo-100", count: 87 },
  { id: "web", name: "Web Development", icon: "🌐", color: "bg-cyan-50 text-cyan-600 border-cyan-100", count: 98 },
  { id: "automata", name: "Automata Theory", icon: "🔁", color: "bg-violet-50 text-violet-600 border-violet-100", count: 56 },
  { id: "cn", name: "Computer Networks", icon: "📡", color: "bg-sky-50 text-sky-600 border-sky-100", count: 73 },
  { id: "os", name: "Operating Systems", icon: "⚙️", color: "bg-slate-50 text-slate-600 border-slate-200", count: 65 },
  { id: "math", name: "Mathematics", icon: "📐", color: "bg-emerald-50 text-emerald-600 border-emerald-100", count: 112 },
  { id: "cyber", name: "Cyber Security", icon: "🔒", color: "bg-rose-50 text-rose-600 border-rose-100", count: 44 },
];

const IMG = {
  laptop: "https://images.unsplash.com/photo-1758612898312-708f2ffdcd53?w=400&h=220&fit=crop&auto=format",
  desk: "https://images.unsplash.com/photo-1769794371055-54436b54577e?w=400&h=220&fit=crop&auto=format",
  library: "https://images.unsplash.com/photo-1771325650489-a41d05192c18?w=400&h=220&fit=crop&auto=format",
  studying: "https://images.unsplash.com/photo-1741699427768-fbb97fc21425?w=400&h=220&fit=crop&auto=format",
  group: "https://images.unsplash.com/photo-1758270705290-62b6294dd044?w=400&h=220&fit=crop&auto=format",
  headphones: "https://images.unsplash.com/photo-1759984782106-4b56d0aa05b8?w=400&h=220&fit=crop&auto=format",
  longdesk: "https://images.unsplash.com/photo-1766506075730-f1d871df530a?w=400&h=220&fit=crop&auto=format",
  chalkboard: "https://images.unsplash.com/photo-1758685848208-e108b6af94cc?w=400&h=220&fit=crop&auto=format",
};

export const MATERIALS: Material[] = [
  {
    id: "1",
    title: "Python Programming Complete Notes",
    thumbnail: IMG.laptop,
    subject: "Programming in Python",
    course: "BCA",
    semester: "4th Semester",
    type: "Notes",
    author: "Priya Sharma",
    uploadDate: "2025-01-15",
    downloads: 342,
    rating: 4.8,
    fileSize: "2.4 MB",
    description: "Comprehensive Python programming notes covering fundamentals, OOP concepts, file handling, libraries (NumPy, Pandas), and real-world applications. Perfect for BCA 4th semester students.",
    tags: ["python", "programming", "bca", "oop"],
    status: "approved",
  },
  {
    id: "2",
    title: "DBMS Complete Notes with ER Diagrams",
    thumbnail: IMG.desk,
    subject: "Database Management Systems",
    course: "BCA",
    semester: "3rd Semester",
    type: "Notes",
    author: "Rahul Verma",
    uploadDate: "2025-01-10",
    downloads: 519,
    rating: 4.9,
    fileSize: "3.8 MB",
    description: "Complete DBMS notes with detailed ER diagrams, normalization (1NF, 2NF, 3NF, BCNF), SQL queries, transactions, and indexing. Includes previous year questions.",
    tags: ["dbms", "sql", "normalization", "er-diagram"],
    status: "approved",
  },
  {
    id: "3",
    thumbnail: IMG.library,
    title: "Automata Theory Unit 1 — DFA & NFA",
    subject: "Theory of Computation",
    course: "BCA",
    semester: "5th Semester",
    type: "Notes",
    author: "Aarav Patel",
    uploadDate: "2025-01-08",
    downloads: 276,
    rating: 4.6,
    fileSize: "1.9 MB",
    description: "Detailed notes on Deterministic Finite Automata, Non-Deterministic Finite Automata, conversion methods, and minimization techniques with solved examples.",
    tags: ["automata", "dfa", "nfa", "theory"],
    status: "approved",
  },
  {
    id: "4",
    thumbnail: IMG.headphones,
    title: "Web Development — HTML, CSS & JavaScript",
    subject: "Web Technologies",
    course: "BCA",
    semester: "4th Semester",
    type: "Study Guide",
    author: "Sneha Gupta",
    uploadDate: "2025-01-05",
    downloads: 421,
    rating: 4.7,
    fileSize: "5.1 MB",
    description: "Complete web development study guide covering semantic HTML5, CSS3 (Flexbox, Grid), responsive design, JavaScript ES6+, DOM manipulation, and AJAX with practical examples.",
    tags: ["html", "css", "javascript", "web"],
    status: "approved",
  },
  {
    id: "5",
    thumbnail: IMG.longdesk,
    title: "Computer Networks — Important Questions 2025",
    subject: "Computer Networks",
    course: "BCA",
    semester: "5th Semester",
    type: "Question Paper",
    author: "Karan Singh",
    uploadDate: "2025-01-03",
    downloads: 387,
    rating: 4.5,
    fileSize: "1.2 MB",
    description: "Curated set of 60+ important questions for Computer Networks exam. Covers OSI model, TCP/IP, routing protocols, subnetting, network security, and application layer protocols.",
    tags: ["networks", "osi", "tcp-ip", "exam"],
    status: "approved",
  },
  {
    id: "6",
    thumbnail: IMG.group,
    title: "Operating System Study Material",
    subject: "Operating Systems",
    course: "BCA",
    semester: "4th Semester",
    type: "Notes",
    author: "Divya Mehta",
    uploadDate: "2024-12-28",
    downloads: 298,
    rating: 4.4,
    fileSize: "3.2 MB",
    description: "Comprehensive OS notes covering process management, memory management, file systems, CPU scheduling algorithms, deadlocks, virtual memory, and UNIX/Linux commands.",
    tags: ["os", "process", "memory", "scheduling"],
    status: "approved",
  },
  {
    id: "7",
    thumbnail: IMG.studying,
    title: "Data Structures & Algorithms — Full Notes",
    subject: "Data Structures",
    course: "BCA",
    semester: "3rd Semester",
    type: "Notes",
    author: "Arjun Kumar",
    uploadDate: "2024-12-20",
    downloads: 456,
    rating: 4.9,
    fileSize: "4.7 MB",
    description: "Complete DSA notes with code implementations in C and Java. Covers arrays, linked lists, stacks, queues, trees, graphs, sorting, and searching algorithms.",
    tags: ["dsa", "algorithms", "data-structures", "c"],
    status: "approved",
  },
  {
    id: "8",
    thumbnail: IMG.chalkboard,
    title: "Cyber Security Fundamentals",
    subject: "Cyber Security",
    course: "BCA",
    semester: "6th Semester",
    type: "Study Guide",
    author: "Neha Joshi",
    uploadDate: "2024-12-18",
    downloads: 203,
    rating: 4.6,
    fileSize: "2.8 MB",
    description: "Introduction to cyber security including cryptography, network security, ethical hacking basics, vulnerability assessment, firewalls, and security policies.",
    tags: ["cyber-security", "cryptography", "hacking", "security"],
    status: "approved",
  },
  {
    id: "9",
    thumbnail: IMG.longdesk,
    title: "Mathematics — Discrete Mathematics Notes",
    subject: "Discrete Mathematics",
    course: "BCA",
    semester: "2nd Semester",
    type: "Notes",
    author: "Rohan Patel",
    uploadDate: "2024-12-15",
    downloads: 334,
    rating: 4.7,
    fileSize: "3.5 MB",
    description: "Complete Discrete Mathematics notes covering sets, relations, functions, graph theory, combinatorics, propositional logic, and Boolean algebra with solved problems.",
    tags: ["discrete-math", "logic", "graph-theory", "sets"],
    status: "approved",
  },
  {
    id: "10",
    thumbnail: IMG.group,
    title: "Software Engineering — SDLC Models",
    subject: "Software Engineering",
    course: "BCA",
    semester: "5th Semester",
    type: "Notes",
    author: "Anita Sharma",
    uploadDate: "2024-12-10",
    downloads: 189,
    rating: 4.3,
    fileSize: "2.1 MB",
    description: "Detailed notes on SDLC models — Waterfall, Agile, Spiral, Prototype, and RAD. Includes software testing, project management, UML diagrams, and case studies.",
    tags: ["software-engineering", "sdlc", "agile", "testing"],
    status: "approved",
  },
  {
    id: "11",
    thumbnail: IMG.laptop,
    title: "Computer Graphics — OpenGL Practicals",
    subject: "Computer Graphics",
    course: "BCA",
    semester: "6th Semester",
    type: "Practical File",
    author: "Vijay Mishra",
    uploadDate: "2024-12-05",
    downloads: 156,
    rating: 4.2,
    fileSize: "6.3 MB",
    description: "Complete practical file with 15 OpenGL programs including line drawing, 2D transformations, clipping, 3D rendering, and animation with output screenshots.",
    tags: ["graphics", "opengl", "practical", "2d-3d"],
    status: "approved",
  },
  {
    id: "12",
    thumbnail: IMG.desk,
    title: "BCA Final Year Project Report — E-Commerce",
    subject: "Project Work",
    course: "BCA",
    semester: "6th Semester",
    type: "Assignment",
    author: "Meera Rao",
    uploadDate: "2024-11-30",
    downloads: 445,
    rating: 4.8,
    fileSize: "8.9 MB",
    description: "Complete BCA final year project report on E-Commerce website with documentation, ER diagrams, system design, source code, and user manual. Reference template.",
    tags: ["project", "e-commerce", "final-year", "report"],
    status: "approved",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Anjali Singh",
    course: "BCA 5th Semester",
    college: "Delhi University",
    review: "StudyShare has been a game-changer for my studies. I found complete DBMS notes just days before my exam and scored 92%. The platform is incredibly well-organized and easy to use.",
    rating: 5,
    avatar: "A",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    course: "BCA 3rd Semester",
    college: "Mumbai University",
    review: "I uploaded my Python notes here and within a week, 200+ students had downloaded them! It feels great to help fellow students. The upload process is super smooth and fast.",
    rating: 5,
    avatar: "R",
  },
  {
    id: 3,
    name: "Preethi Nair",
    course: "BCA 6th Semester",
    college: "Bangalore University",
    review: "Preparing for my final year project, I found multiple reference reports on StudyShare. The quality of materials is excellent. This platform deserves to be in every BCA student's toolkit.",
    rating: 5,
    avatar: "P",
  },
];

export const STATS = [
  { label: "Study Materials", value: "1,200+", icon: "📚" },
  { label: "Active Students", value: "850+", icon: "🎓" },
  { label: "Subjects Covered", value: "60+", icon: "📖" },
  { label: "Total Downloads", value: "15,000+", icon: "⬇️" },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Search",
    desc: "Search for study materials by subject, course, semester or keyword. Find exactly what you need.",
    icon: "🔍",
  },
  {
    step: 2,
    title: "Discover",
    desc: "Browse through curated, student-verified materials organized by categories and ratings.",
    icon: "💡",
  },
  {
    step: 3,
    title: "Download",
    desc: "Download high-quality study materials instantly — completely free, no subscription required.",
    icon: "⬇️",
  },
  {
    step: 4,
    title: "Share",
    desc: "Upload your own notes and help your fellow students. Build a reputation as a top contributor.",
    icon: "🤝",
  },
];

export const WHY_CHOOSE = [
  { title: "Easy to Use", desc: "Clean, intuitive interface designed for students.", icon: "✨" },
  { title: "100% Free", desc: "All study materials are free to download, always.", icon: "🆓" },
  { title: "Organized Content", desc: "Materials neatly categorized by course, subject and semester.", icon: "📁" },
  { title: "Student Community", desc: "Join thousands of students sharing and collaborating.", icon: "👥" },
  { title: "Fast Downloads", desc: "Lightning-fast downloads with no wait times or limits.", icon: "⚡" },
  { title: "Secure Platform", desc: "Your data is safe. We use industry-standard security.", icon: "🔒" },
];
