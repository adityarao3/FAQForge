# FAQForge - Project Summary

## 📖 What is FAQForge?

**FAQForge** is an AI-powered web application that automatically generates contextual FAQs (Frequently Asked Questions) from any website. It eliminates the tedious manual process of creating FAQs by intelligently crawling websites, extracting content, and using OpenAI's GPT-4 to generate relevant, high-quality question-answer pairs.

---

## 🎯 Core Functionality

### 1. **Automated Website Crawling**
- Enter any website URL
- System automatically discovers and crawls linked pages
- Configurable crawl depth (default: 3 levels deep)
- Configurable page limit (default: 20 pages per domain)
- Real-time progress tracking with status updates
- Extracts and stores text content, metadata, and page structure

### 2. **AI-Powered FAQ Generation**
- Uses OpenAI GPT-4 for intelligent content analysis
- Generates contextual question-answer pairs from crawled content
- Assigns confidence scores (0-100%) to each FAQ
- Links each FAQ to its source page for reference
- Processes multiple pages in batch for efficiency
- Maintains context awareness across related pages

### 3. **Comprehensive FAQ Management**
- **View & Filter**: Browse all FAQs with filtering by website or publication status
- **Edit**: Modify questions and answers inline with live preview
- **Publish Control**: Toggle publish status to mark FAQs as production-ready
- **Delete**: Remove irrelevant or duplicate FAQs
- **Source Tracking**: Every FAQ shows which page it came from
- **Confidence Scoring**: See AI confidence levels for quality assessment

### 4. **Export & Integration**
- Export FAQs as JSON files
- Filter exports by website or publication status
- Easy integration into websites, chatbots, or help systems
- Structured data format for seamless implementation

---

## 🏗️ Technical Architecture

### **Frontend (React)**
- **Framework**: React 18 with functional components and hooks
- **Design**: Neo-Brutalism UI with bold colors, thick borders, and hard shadows
- **Styling**: Custom CSS with CSS variables for consistent theming
- **State Management**: React hooks (useState, useEffect)
- **API Communication**: Axios for HTTP requests
- **Real-time Updates**: Polling for crawl status and FAQ generation progress

### **Backend (Node.js + Express)**
- **Runtime**: Node.js v22
- **Framework**: Express.js for RESTful API
- **Architecture**: MVC pattern (Models, Controllers, Routes)
- **Web Crawling**: Axios + Cheerio for HTML parsing
- **AI Integration**: OpenAI API (GPT-4o model)
- **Async Processing**: Background FAQ generation with status tracking
- **Error Handling**: Comprehensive error middleware

### **Database (MongoDB)**
- **ODM**: Mongoose for schema modeling
- **Collections**:
  - **Websites**: Stores crawled website metadata
  - **PageContent**: Stores extracted content from each page
  - **FAQs**: Stores generated question-answer pairs
  - **CrawlStatus**: Tracks crawling progress and statistics
- **Indexing**: Optimized indexes for fast queries
- **Relationships**: Referenced documents for data integrity

### **AI Integration (OpenAI)**
- **Model**: GPT-4o (latest and most capable)
- **Configuration**:
  - Temperature: 0.7 (balanced creativity)
  - Max Tokens: 2000 (comprehensive answers)
  - Context-aware prompts for better FAQ quality
- **Error Handling**: Retry logic and fallback mechanisms

---

## 🎨 Design System - Neo-Brutalism

### Visual Characteristics
- **Color Palette**:
  - Primary: Vibrant Yellow (#FDE047)
  - Secondary: Bright Cyan (#A5F3FC)
  - Success: Lime Green (#BEF264)
  - Error: Soft Red (#FCA5A5)
  - Warning: Peach Orange (#FED7AA)
  - Accent: Purple (#D8B4FE), Pink (#FBCFE8)

- **Typography**:
  - Font: Space Grotesk (modern, geometric sans-serif)
  - Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
  - Uppercase headings with letter-spacing for impact

- **Borders & Shadows**:
  - Thick black borders (3px solid)
  - Hard, offset shadows (no blur) for 3D effect
  - Shadow sizes: 2px, 4px, 6px, 8px offsets

- **Interactive Elements**:
  - Hover effects with shadow expansion
  - Transform animations (translate on hover)
  - Active states with shadow removal (pressed effect)
  - Smooth transitions (0.2s ease)

- **Components**:
  - Cards with elevated appearance
  - Bold buttons with emoji icons
  - Clean input fields with focus states
  - Colorful badges and alerts
  - Modal dialogs with backdrop blur

---

## 🔄 User Workflow

### Step 1: Crawl Website
1. User enters website URL (e.g., https://example.com)
2. Click "Start Crawling" button
3. System begins crawling:
   - Discovers linked pages
   - Extracts text content
   - Stores in database
4. Real-time progress updates show:
   - Pages crawled count
   - Current status (pending/crawling/completed/failed)
   - Progress percentage

### Step 2: Generate FAQs
1. Once crawling is complete, click "Generate FAQs"
2. AI processes each crawled page:
   - Analyzes content context
   - Generates relevant questions
   - Creates comprehensive answers
   - Assigns confidence scores
3. Background processing with status tracking
4. FAQs appear in FAQ Manager tab

### Step 3: Review & Edit
1. Switch to "FAQ Manager" tab
2. Browse generated FAQs
3. Filter by website or publication status
4. Edit any FAQ:
   - Click "Edit" button
   - Modify question or answer
   - Click "Save" to update
5. Review confidence scores for quality

### Step 4: Publish
1. Toggle publish status for each FAQ
2. Published FAQs are marked with green background
3. Unpublished FAQs remain in draft mode
4. Use filters to view only published FAQs

### Step 5: Export
1. Apply filters (optional)
2. Click "Export FAQs" button
3. Download JSON file
4. Integrate into your website or application

---

## 📊 Data Flow

```
User Input (URL)
    ↓
Crawler Service
    ↓
Content Extraction (Cheerio)
    ↓
MongoDB Storage (PageContent)
    ↓
FAQ Generation Request
    ↓
OpenAI API (GPT-4)
    ↓
FAQ Processing & Storage
    ↓
User Interface (React)
    ↓
Export (JSON)
```

---

## 🚀 Deployment Architecture

### Development
- **Frontend**: React Dev Server (localhost:3000)
- **Backend**: Node.js + Nodemon (localhost:5000)
- **Database**: MongoDB local or Atlas
- **Concurrently**: Runs both servers simultaneously

### Production (Render)
- **Backend**: Node.js web service on Render
  - Auto-scaling with free tier
  - Environment variables for configuration
  - Health check endpoint for monitoring
- **Frontend**: Static site on Render
  - Optimized React build
  - CDN delivery for fast loading
- **Database**: MongoDB Atlas (cloud)
  - Managed database service
  - Automatic backups
  - Global distribution

---

## 🔐 Environment Configuration

### Required Environment Variables

**Backend (.env)**:
```
MONGODB_URI=mongodb://localhost:27017/faqforge
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
MAX_CRAWL_DEPTH=3
MAX_PAGES_PER_DOMAIN=20
CRAWL_TIMEOUT=10000
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📈 Performance Considerations

### Optimization Strategies
- **Crawling**: Asynchronous processing with configurable limits
- **Database**: Indexed queries for fast lookups
- **API**: RESTful design with efficient data transfer
- **Frontend**: React optimization (memoization, lazy loading)
- **Caching**: Browser caching for static assets

### Scalability
- **Horizontal Scaling**: Stateless backend can scale across multiple instances
- **Database Sharding**: MongoDB supports sharding for large datasets
- **Queue System**: Can add job queue (Bull/Redis) for heavy crawling
- **CDN**: Static frontend served via CDN for global reach

---

## 🛡️ Security Features

### Current Implementation
- **CORS**: Configured to allow specific origins
- **Input Validation**: URL validation before crawling
- **Error Handling**: Sanitized error messages (no stack traces in production)
- **Environment Variables**: Sensitive data stored securely
- **MongoDB**: Connection string with authentication

### Recommended Additions
- Rate limiting for API endpoints
- User authentication (JWT)
- API key management
- Request logging and monitoring
- DDoS protection
- Content Security Policy (CSP)

---

## 📦 Project Structure

```
FAQForge/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── crawlController.js   # Crawling logic
│   │   ├── faqController.js     # FAQ generation & management
│   │   └── pageController.js    # Page content management
│   ├── models/
│   │   ├── Website.js           # Website schema
│   │   ├── PageContent.js       # Page content schema
│   │   ├── FAQ.js               # FAQ schema
│   │   └── CrawlStatus.js       # Crawl status schema
│   ├── routes/
│   │   ├── crawlRoutes.js       # Crawl endpoints
│   │   ├── faqRoutes.js         # FAQ endpoints
│   │   └── pageRoutes.js        # Page endpoints
│   ├── services/
│   │   ├── crawlerService.js    # Web crawling logic
│   │   └── openaiService.js     # OpenAI integration
│   └── server.js                # Express app entry point
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── CrawlPanel.js    # Crawling interface
│   │   │   └── FAQManager.js    # FAQ management interface
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.js               # Main app component
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Neo-brutalism styles
│   └── package.json
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Root dependencies
├── README.md                    # Project documentation
├── QUICKSTART.md                # Quick start guide
├── DEPLOYMENT.md                # Deployment instructions
└── render.yaml                  # Render configuration
```

---

## 🎓 Use Cases

### 1. **Website Owners**
- Automatically generate FAQs for documentation sites
- Create help sections without manual writing
- Keep FAQs updated as content changes

### 2. **Customer Support Teams**
- Build knowledge bases from existing content
- Reduce support ticket volume
- Provide instant answers to common questions

### 3. **Content Creators**
- Generate FAQ sections for blogs
- Create supplementary Q&A content
- Improve SEO with structured FAQ data

### 4. **Developers**
- Generate API documentation FAQs
- Create developer resource Q&As
- Build chatbot knowledge bases

### 5. **E-commerce**
- Product FAQ generation
- Shipping and returns Q&As
- Customer service automation

---

## 🔮 Future Enhancements

### Potential Features
- **Multi-language Support**: Generate FAQs in multiple languages
- **Scheduled Crawling**: Automatic periodic re-crawling
- **FAQ Analytics**: Track which FAQs are most viewed
- **Bulk Operations**: Edit/publish multiple FAQs at once
- **Custom Prompts**: User-defined AI prompts for FAQ generation
- **Integration APIs**: Webhooks for external systems
- **FAQ Search**: Full-text search across all FAQs
- **Version Control**: Track FAQ changes over time
- **Collaboration**: Multi-user editing with permissions
- **Widget**: Embeddable FAQ widget for websites

---

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🙏 Acknowledgments

- **OpenAI**: For GPT-4 API
- **MongoDB**: For database technology
- **React**: For frontend framework
- **Express**: For backend framework
- **Neo-Brutalism UI**: For design inspiration

---

**Built with ⚡ by FAQForge Team**
