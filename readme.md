# BloomWell - Old Money Wellness App

A refined, elegant wellness tracking application with a sophisticated old-money aesthetic. Built with modern web technologies while maintaining classical design principles.

## 🌟 Features

- **Daily Habit Tracking**: Monitor wellness rituals with elegant progress indicators
- **Mood & Energy Monitoring**: Sophisticated emotional wellness tracking
- **Study Session Management**: Pomodoro-style focus sessions with timer functionality
- **Cycle Tracking**: Discrete and elegant period tracking
- **AI Wellness Assistant**: Personalized guidance and insights
- **Analytics Dashboard**: Advanced data analysis with Python backend
- **Responsive Design**: Seamless experience across all devices

## 🎨 Design Philosophy

The application embraces the **old money aesthetic**:
- **Color Palette**: Cream, sage green, dusty rose, and navy tones
- **Typography**: Playfair Display and Lora serif fonts
- **Minimalism**: Clean, uncluttered interface
- **Elegance**: Subtle animations and refined interactions
- **No Emojis**: Professional, sophisticated visual language

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Advanced styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: Clean, efficient client-side interactions
- **Font Awesome**: Professional iconography
- **Google Fonts**: Premium typography

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **SQLite**: Lightweight database
- **JWT**: Secure authentication
- **Rate Limiting**: API protection

### Analytics
- **Python**: Data analysis and machine learning
- **Pandas**: Data manipulation and analysis
- **Scikit-learn**: Predictive analytics
- **NumPy**: Numerical computing

## 📂 Project Structure

```
bloomwell-wellness-app/
├── index.html              # Main HTML file
├── styles.css              # Complete CSS styling
├── script.js               # Frontend JavaScript
├── server.js               # Node.js server
├── package.json            # Node dependencies
├── wellness_analyzer.py    # Python analytics engine
├── routes/                 # API route handlers
├── database/               # Database schemas and migrations
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bloomwell-wellness-app.git
   cd bloomwell-wellness-app
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install pandas numpy scikit-learn matplotlib seaborn sqlite3
   ```

4. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize the database**
   ```bash
   npm run db:init
   ```

### Running the Application

#### Development Mode
```bash
# Start the Node.js server
npm run dev

# In another terminal, start the Python analytics service
python wellness_analyzer.py
```

#### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Wellness Data
- `GET /api/wellness/summary` - Get wellness overview
- `POST /api/wellness/checkin` - Record wellness check-in
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit progress

### Analytics
- `GET /api/insights/mood` - Mood analysis
- `GET /api/insights/habits` - Habit patterns
- `GET /api/insights/correlations` - Cross-metric correlations

## 🔧 Configuration

### Environment Variables

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret
DB_PATH=./database/bloomwell.db
ANALYTICS_ENABLED=true
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Configuration

The application uses SQLite for data persistence. The database schema includes:

- Users table
- Habits and habit entries
- Mood tracking
- Study sessions
- Period cycles
- Analytics cache

## 🎯 Key Features Explained

### Habit Tracking System
- Visual progress dots for daily completion
- Streak tracking and motivation
- Customizable habit targets
- Completion rate analytics

### Mood & Energy Monitoring
- 5-point mood scale with elegant interface
- Energy level tracking with interactive meter
- Correlation analysis with other metrics
- Weekly trend visualization

### Study Session Management
- Pomodoro timer with visual feedback
- Subject-based organization
- Performance tracking
- Peak productivity hour analysis

### AI Wellness Assistant
- Contextual responses based on user data
- Personalized recommendations
- Natural language processing
- Learning from user interactions

## 📈 Analytics & Insights

The Python analytics engine provides:

- **Trend Analysis**: Mood and habit progression over time
- **Pattern Recognition**: Weekly and seasonal patterns
- **Correlation Discovery**: Relationships between metrics
- **Predictive Modeling**: Future wellness predictions
- **Personalized Recommendations**: Data-driven suggestions

### Sample Analytics Output

```python
# Generate comprehensive wellness report
analyzer = WellnessAnalyzer()
report = analyzer.create_wellness_report('user_id', days=30)

# Export findings to CSV
analyzer.export_report_csv(report, 'wellness_insights.csv')
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: API abuse prevention
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Data sanitization
- **JWT Authentication**: Secure user sessions

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🎨 Customization

### Color Scheme
The old money color palette can be customized in `styles.css`:

```css
:root {
    --primary-cream: #f8f6f0;
    --sage-green: #9cac8c;
    --dusty-rose: #d4a5a5;
    --deep-navy: #2c3e50;
    --accent-gold: #c9a96e;
}
```

### Typography
Font selections can be modified in the HTML head:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Lora:wght@300;400;500;600&display=swap" rel="stylesheet">
```

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
npm run test:server

# Run Python analytics tests
python -m pytest tests/
```

## 📦 Deployment

### Docker Deployment
```bash
docker build -t bloomwell-app .
docker run -p 3000:3000 bloomwell-app
```

### Traditional Hosting
1. Build the application: `npm run build`
2. Upload files to your server
3. Install dependencies: `npm install --production`
4. Start the application: `npm start`


## 🙏 Acknowledgments

- **Design Inspiration**: Old money aesthetic and minimalist wellness apps
- **Typography**: Google Fonts for elegant serif typefaces
- **Icons**: Font Awesome for professional iconography
- **Analytics**: Scikit-learn for machine learning capabilities

---

**BloomWell** - *Wellness Refined*

*Cultivating excellence through mindful tracking and elegant design.*