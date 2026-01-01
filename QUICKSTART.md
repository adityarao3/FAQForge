# FAQForge - Quick Start Guide

## 🎯 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### Step 2: Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

### Step 3: Start MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Step 4: Run the Application
```bash
npm run dev
```

Visit: http://localhost:3000

## 📋 Demo Workflow

### 1. Crawl a Website
- Enter URL: `https://example.com`
- Click "Start Crawling"
- Wait for completion (Status: Completed)

### 2. Generate FAQs
- Click "Generate FAQs" button
- System processes all pages
- FAQs appear in FAQ Manager tab

### 3. Manage FAQs
- Switch to "FAQ Manager" tab
- Review generated FAQs
- Edit questions/answers
- Click "Publish" to make FAQ live

### 4. Export Results
- Select filters (optional)
- Click "Export FAQs"
- Download JSON file

## 🔑 Key Features Demo

### Real-time Crawl Status
```
Website: example.com
Status: ✅ Completed
Pages Crawled: 15/20
FAQs Generated: 23
Progress: 100%
```

### FAQ Management
- ✏️ Edit Question & Answer
- 🔄 Toggle Published Status
- 🗑️ Delete FAQs
- 📊 View Confidence Scores
- 📥 Export as JSON

## 🎨 UI Components

### Crawl Panel
- URL input field
- Start crawling button
- Real-time progress tracking
- Website list with status indicators
- Generate FAQs button

### FAQ Manager
- Filter by website
- Filter by published status
- Editable FAQ cards
- Publish/Unpublish toggle
- Export functionality

## 🔧 Troubleshooting

### Problem: MongoDB connection error
**Solution**: Ensure MongoDB is running and MONGODB_URI is correct in .env

### Problem: OpenAI API error
**Solution**: Verify OPENAI_API_KEY in .env is valid

### Problem: Crawl fails
**Solution**: Check URL format and ensure website is accessible

## 📊 Sample Results

After crawling a typical website:
- **Pages Crawled**: 10-20 pages
- **FAQs Generated**: 20-40 FAQs
- **Processing Time**: 2-5 minutes
- **Success Rate**: 90%+

## 🎓 Best Practices

1. **Start Small**: Test with 1-2 pages first
2. **Review FAQs**: Always review before publishing
3. **Edit as Needed**: AI is good but not perfect
4. **Export Regularly**: Backup your FAQs
5. **Use Filters**: Organize by website/status

## 🚀 Next Steps

1. Integrate exported FAQs into your website
2. Setup automated crawling schedules
3. Customize OpenAI prompts for your domain
4. Add more websites to your collection

---

For full documentation, see README.md
