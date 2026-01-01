# FAQForge - AI-Powered FAQ Generator

## � Project Overview

**FAQForge** is a full-stack web application that automatically generates contextual FAQs from any website using AI. It intelligently crawls websites, extracts content, and uses advanced AI models to create relevant, high-quality frequently asked questions with accurate answers.

## ✨ Key Features

### 🕷️ **Intelligent Web Crawler**
- Automatically crawls entire websites or specific pages
- Extracts clean, structured content from web pages
- Configurable crawl depth and page limits
- Real-time crawl status monitoring
- Handles multiple websites simultaneously

### 🤖 **AI-Powered FAQ Generation**
- Generates contextual FAQs using **OpenAI GPT models**
- Currently integrated with **OpenAI API** (GPT-4/GPT-3.5)
- **Flexible AI Integration**: Can be easily adapted to use **Claude (Anthropic)** or other AI models if needed
- Intelligent question-answer pair generation based on page content
- Confidence scoring for each generated FAQ
- Source attribution for transparency

### 📝 **FAQ Management System**
- View all generated FAQs in a beautiful, organized interface
- Edit questions and answers with inline editing
- Publish/unpublish FAQs with one click
- Filter FAQs by website or publication status
- Delete unwanted FAQs
- Track edited FAQs with visual indicators

### 📥 **Export Functionality**
- Export FAQs as JSON files
- Filter exports by website or publication status
- Includes metadata (confidence scores, sources, timestamps)
- Perfect for integration with other systems

### 🎨 **Modern Neo-Brutalist UI**
- Bold, vibrant design with high contrast
- Smooth animations and transitions
- Fully responsive across all devices
- Intuitive user experience
- Real-time status updates

## 🛠️ Technology Stack

### **Frontend**
- **React.js** - Modern UI library
- **Axios** - HTTP client for API calls
- **Material-UI Icons** - Icon library
- **Custom CSS** - Neo-brutalist design system

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### **AI Integration**
- **OpenAI API** - Currently using GPT-4/GPT-3.5 for FAQ generation
- **Note**: I have an OpenAI API key and integrated this project with OpenAI. However, the architecture is flexible and can be easily adapted to use **Claude (Anthropic)** or other AI models if preferred.

### **Web Scraping**
- **Axios** - HTTP requests
- **Cheerio** - HTML parsing and content extraction

### **Deployment**
- **Render** - Backend hosting (Web Service)
- **Render** - Frontend hosting (Static Site)
- **GitHub** - Version control and CI/CD

## � Database Schema

### **Website Collection**
- URL, domain, crawl status
- Total pages crawled
- Timestamps

### **PageContent Collection**
- URL, title, extracted content
- Crawl status and metadata
- Associated website reference

### **FAQ Collection**
- Question and answer
- Source page and section
- Confidence score
- Published status
- Edit tracking

### **CrawlStatus Collection**
- Real-time crawl progress
- Pages crawled and FAQs generated
- Status tracking (in_progress, completed, failed)

## 🎯 Use Cases

1. **Website Owners**: Automatically generate comprehensive FAQs for their websites
2. **Customer Support Teams**: Create knowledge bases from existing documentation
3. **Content Creators**: Extract key information from competitor websites
4. **Researchers**: Analyze and summarize web content
5. **SEO Specialists**: Generate FAQ schema markup for better search visibility

## 🔑 Key Highlights

- ✅ **Fully Automated**: From crawling to FAQ generation
- ✅ **AI-Powered**: Leverages OpenAI's advanced language models (adaptable to Claude)
- ✅ **Scalable**: Handles multiple websites and thousands of pages
- ✅ **User-Friendly**: Intuitive interface with real-time feedback
- ✅ **Production-Ready**: Deployed and accessible online
- ✅ **Customizable**: Edit, filter, and manage all generated content
- ✅ **Export-Ready**: Download FAQs for external use

## 🌐 Live Deployment

**The application is live and ready to use!**

- 🚀 **Frontend Application**: [https://faqforge-ui-app.onrender.com](https://faqforge-ui-app.onrender.com)
- 🔧 **Backend API**: [https://faqforge.onrender.com](https://faqforge.onrender.com)
- 💚 **API Health Check**: [https://faqforge.onrender.com/api/health](https://faqforge.onrender.com/api/health)

> **Note**: Hosted on Render's free tier. Services may take 30-60 seconds to wake up if idle.


## � Future Enhancements

- [ ] Support for Claude AI integration (easy to implement)
- [ ] Multi-language FAQ generation
- [ ] Bulk import/export in multiple formats (CSV, XML)
- [ ] FAQ analytics and usage tracking
- [ ] API key management for multiple AI providers
- [ ] Scheduled automatic re-crawling
- [ ] FAQ similarity detection and deduplication
- [ ] Integration with popular CMS platforms

## 💡 AI Model Flexibility

**Current Implementation**: OpenAI (GPT-4/GPT-3.5)

**Why OpenAI?** I currently have an OpenAI API key, which made it the natural choice for initial implementation.

**Claude Integration**: The application architecture is designed to be AI-agnostic. Switching to Claude (Anthropic) or any other AI model would only require:
1. Updating the API client in `backend/services/openaiService.js`
2. Adjusting the prompt format if needed
3. Changing the API key configuration

**Want Claude instead?** Just let me know, and I can easily integrate Claude API or any other AI provider you prefer!

## � License

MIT License - Feel free to use and modify as needed.

---

**Built with ❤️ using the MERN stack and AI**
