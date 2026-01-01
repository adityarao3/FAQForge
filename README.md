# FAQForge - Contextual FAQ Generator for Websites

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A production-ready MERN stack application that crawls websites, extracts content, and generates contextual FAQs using OpenAI's GPT models.

## 🌐 Live Demo

**Try it now!** The application is deployed and ready to use:

- 🚀 **Frontend Application**: [https://faqforge-ui-app.onrender.com](https://faqforge-ui-app.onrender.com)
- 🔧 **Backend API**: [https://faqforge.onrender.com](https://faqforge.onrender.com)
- 💚 **API Health Check**: [https://faqforge.onrender.com/api/health](https://faqforge.onrender.com/api/health)

> **Note**: The free tier on Render may take 30-60 seconds to wake up if the service has been idle.


## 🚀 Features

- **Intelligent Web Crawling**: Extract content from any website with configurable depth and page limits
- **AI-Powered FAQ Generation**: Generate contextual FAQs using OpenAI GPT-4o
- **Content Management**: Review, edit, and publish FAQs through an intuitive admin dashboard
- **Export Functionality**: Export FAQs as JSON for integration with other systems
- **Real-time Status Tracking**: Monitor crawl progress and FAQ generation
- **Material-UI Dashboard**: Clean, responsive admin interface

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **Cheerio** - HTML parsing and content extraction
- **OpenAI API** - GPT-4o for FAQ generation
- **Axios** - HTTP client for web crawling

### Frontend
- **React.js** - UI framework
- **Material-UI (MUI)** - Component library
- **Axios** - API communication

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd FAQForge
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### 4. Configure environment variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/faqforge

# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI API Key (REQUIRED)
OPENAI_API_KEY=your_openai_api_key_here

# OpenAI Model Configuration
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# Crawler Configuration
MAX_CRAWL_DEPTH=3
MAX_PAGES_PER_DOMAIN=20
CRAWL_TIMEOUT=10000
```

⚠️ **IMPORTANT**: Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 5. Start MongoDB
Ensure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

## 🚀 Running the Application

### Development Mode (Both Backend & Frontend)
```bash
npm run dev
```

### Backend Only
```bash
npm run server
```

### Frontend Only
```bash
npm run client
```

### Production Mode
```bash
npm run build
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📚 API Documentation

### Crawling Endpoints

#### Start Website Crawl
```http
POST /api/crawl
Content-Type: application/json

{
  "url": "https://example.com"
}
```

#### Get Crawl Status
```http
GET /api/crawl/status/:websiteId
```

#### Get All Websites
```http
GET /api/crawl/websites
```

### Page Endpoints

#### Get All Pages
```http
GET /api/pages
```

#### Get Pages by Website
```http
GET /api/pages/website/:websiteId
```

#### Get Page Details
```http
GET /api/pages/:pageId
```

### FAQ Endpoints

#### Generate FAQ for Single Page
```http
POST /api/faq/generate-page
Content-Type: application/json

{
  "pageId": "page_id_here"
}
```

#### Generate FAQs for Entire Website
```http
POST /api/faq/generate-website
Content-Type: application/json

{
  "websiteId": "website_id_here"
}
```

#### Get All FAQs
```http
GET /api/faq?websiteId=xxx&published=true
```

#### Update FAQ
```http
PUT /api/faq/:id
Content-Type: application/json

{
  "question": "Updated question?",
  "answer": "Updated answer.",
  "published": true
}
```

#### Delete FAQ
```http
DELETE /api/faq/:id
```

#### Export FAQs
```http
GET /api/faq/export?websiteId=xxx&published=true
```

## 🎯 Usage Guide

### 1. Start Crawling a Website
1. Navigate to the **Website Crawler** tab
2. Enter a website URL (e.g., `https://example.com`)
3. Click **Start Crawling**
4. Monitor the crawl progress in real-time

### 2. Generate FAQs
1. Once crawling is complete, click **Generate FAQs** on the website
2. The system will process all crawled pages
3. FAQs are generated using OpenAI GPT-4o based on extracted content

### 3. Manage FAQs
1. Navigate to the **FAQ Manager** tab
2. Review generated FAQs
3. Edit questions and answers as needed
4. Toggle publish status for each FAQ
5. Export FAQs as JSON

### 4. Export FAQs
1. Apply filters (Website, Published status)
2. Click **Export FAQs**
3. Download JSON file with all FAQs

## 📁 Project Structure

```
FAQForge/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── crawlController.js   # Crawl logic
│   │   ├── pageController.js    # Page management
│   │   └── faqController.js     # FAQ operations
│   ├── models/
│   │   ├── Website.js           # Website schema
│   │   ├── PageContent.js       # Page content schema
│   │   ├── FAQ.js               # FAQ schema
│   │   └── CrawlStatus.js       # Crawl status schema
│   ├── routes/
│   │   ├── crawlRoutes.js       # Crawl endpoints
│   │   ├── pageRoutes.js        # Page endpoints
│   │   └── faqRoutes.js         # FAQ endpoints
│   ├── services/
│   │   ├── crawlerService.js    # Web crawler with Cheerio
│   │   └── openaiService.js     # OpenAI integration
│   └── server.js                # Express app entry
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CrawlPanel.js    # Crawl UI component
│   │   │   └── FAQManager.js    # FAQ management UI
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.js               # Main app component
│   │   └── index.js             # React entry point
│   └── package.json
├── .env.example                  # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Database Schemas

### Website
```javascript
{
  url: String,
  domain: String,
  status: ['pending', 'crawling', 'completed', 'failed'],
  totalPages: Number,
  crawlStartedAt: Date,
  crawlCompletedAt: Date,
  errorMessage: String
}
```

### PageContent
```javascript
{
  websiteId: ObjectId,
  url: String,
  title: String,
  headings: [{ level: Number, text: String }],
  paragraphs: [String],
  extractedContent: String,
  wordCount: Number,
  crawlStatus: ['pending', 'success', 'failed']
}
```

### FAQ
```javascript
{
  websiteId: ObjectId,
  pageId: ObjectId,
  sourcePage: String,
  question: String,
  answer: String,
  confidenceScore: Number,
  published: Boolean,
  edited: Boolean,
  createdAt: Date
}
```

## 🤖 OpenAI Integration

The system uses OpenAI GPT-4o with the following prompt strategy:

```
You are an AI assistant that generates FAQs strictly from the provided website content.

RULES:
1. Use ONLY the content below.
2. Do NOT add external knowledge.
3. If answer is not present, say 'Information not available in the source content.'
4. Generate user-friendly questions.
5. Keep answers under 120 words.

CONTENT:
<<<EXTRACTED_TEXT>>>

Return JSON:
[
  {
    "question": "...",
    "answer": "...",
    "source": "page-url-or-section"
  }
]
```

This ensures:
- ✅ No hallucination
- ✅ Context-aware responses
- ✅ Factual accuracy
- ✅ Proper citation

## 🔄 AI Model Flexibility

**Current Implementation**: This project currently uses **OpenAI's GPT models** (GPT-4/GPT-3.5) because I have an OpenAI API key readily available.

**Claude Integration Available**: The application architecture is designed to be AI-agnostic. If you prefer to use **Claude (Anthropic)** or any other AI model, the integration is straightforward:

1. Update the API client in `backend/services/openaiService.js`
2. Adjust the prompt format to match Claude's requirements
3. Update the environment variables with your Claude API key

**Want to switch to Claude?** Just let me know, and I can easily integrate Claude API or any other AI provider you prefer! The core logic remains the same - only the API client needs to be swapped.

### Supported AI Models (Easy to Integrate)
- ✅ **OpenAI** (GPT-4, GPT-3.5) - Currently Active
- ✅ **Claude** (Anthropic) - Ready to integrate
- ✅ **Google Gemini** - Can be added
- ✅ **Any other LLM API** - Flexible architecture


## 🧪 Sample FAQ Export

```json
{
  "exportDate": "2026-01-01T10:00:00.000Z",
  "totalFAQs": 2,
  "faqs": [
    {
      "question": "What services does the company offer?",
      "answer": "The company offers web development, mobile app development, and cloud solutions for businesses of all sizes.",
      "source": "https://example.com/services",
      "published": true,
      "confidence": 0.8,
      "createdAt": "2026-01-01T09:30:00.000Z"
    },
    {
      "question": "How can I contact support?",
      "answer": "You can reach our support team via email at support@example.com or call us at 1-800-123-4567.",
      "source": "https://example.com/contact",
      "published": true,
      "confidence": 0.85,
      "createdAt": "2026-01-01T09:31:00.000Z"
    }
  ]
}
```

## ⚙️ Configuration Options

### Crawler Settings
- `MAX_CRAWL_DEPTH`: Maximum link depth to follow (default: 3)
- `MAX_PAGES_PER_DOMAIN`: Maximum pages to crawl per domain (default: 20)
- `CRAWL_TIMEOUT`: Request timeout in milliseconds (default: 10000)

### OpenAI Settings
- `OPENAI_MODEL`: GPT model to use (default: gpt-4o)
- `OPENAI_MAX_TOKENS`: Maximum response tokens (default: 2000)
- `OPENAI_TEMPERATURE`: Response creativity (0-1, default: 0.7)

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If connection fails, check MONGODB_URI in .env
```

### OpenAI API Errors
- **401 Unauthorized**: Invalid API key - check `OPENAI_API_KEY` in `.env`
- **429 Rate Limited**: Too many requests - wait or upgrade your OpenAI plan
- **500 Server Error**: OpenAI service issue - retry later

### Crawling Issues
- **Timeout Errors**: Increase `CRAWL_TIMEOUT` in `.env`
- **No Content Extracted**: Website may block crawlers or use JavaScript rendering
- **Too Many Pages**: Reduce `MAX_PAGES_PER_DOMAIN` in `.env`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using MERN Stack and OpenAI
