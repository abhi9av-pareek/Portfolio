# Portfolio Website

A modern portfolio website built with Node.js, Express, and MongoDB.

## 🚀 Features

- Responsive design
- Contact form with email notifications
- SMS notifications via Twilio
- MongoDB database integration
- Vercel deployment ready

## 📁 Project Structure

```
portfolio/
├── config/           # Configuration files
│   └── database.js   # MongoDB connection setup
├── controllers/      # Route controllers
│   └── contactController.js
├── middleware/       # Custom middleware
├── models/          # Database models
│   └── Message.js   # Contact message model
├── routes/          # Express routes
│   ├── index.js
│   ├── users.js
│   └── portfolioRoutes.js
├── utils/           # Utility functions
│   ├── emailService.js
│   └── smsService.js
├── views/           # EJS templates
├── public/          # Static assets
├── .env             # Environment variables (not in git)
├── .env.example     # Environment variables template
├── app.js           # Main application file
└── server.js        # Server entry point
```

## 🛠️ Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   - Copy `.env.example` to `.env`
   - Fill in your environment variables:
     ```env
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolioDB
     GMAIL_USER=your-email@gmail.com
     GMAIL_APP_PASSWORD=your-app-password
     TWILIO_ACCOUNT_SID=your-twilio-sid
     TWILIO_AUTH_TOKEN=your-twilio-token
     TWILIO_FROM_NUMBER=your-twilio-number
     ALERT_TO_PHONE=+1234567890
     ```

4. **Run the application**
   ```bash
   npm start
   ```

## 🌐 Deployment

### Vercel Deployment

1. **Set Environment Variables in Vercel**

   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all variables from your `.env` file

2. **MongoDB Atlas Setup**

   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Update `MONGO_URI` in Vercel environment variables

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 📧 Email Configuration

1. **Gmail Setup**
   - Enable 2-factor authentication
   - Generate an App Password
   - Use the App Password in `GMAIL_APP_PASSWORD`

## 📱 SMS Configuration

1. **Twilio Setup**
   - Create a Twilio account
   - Get your Account SID and Auth Token
   - Purchase a phone number
   - Add credentials to environment variables

## 🔧 Troubleshooting

### MongoDB Connection Issues

- Ensure `MONGO_URI` is correctly set
- Check MongoDB Atlas IP whitelist
- Verify database user permissions

### Email Issues

- Verify Gmail App Password
- Check 2FA is enabled
- Ensure SMTP settings are correct

### SMS Issues

- Verify Twilio credentials
- Check phone number format
- Ensure sufficient Twilio balance

## 📝 API Endpoints

- `POST /contact` - Handle contact form submissions
- `GET /` - Home page
- `GET /portfolio` - Portfolio page

## 🛡️ Security

- Environment variables are properly secured
- Input validation on contact form
- CORS configured for production
- Error handling implemented

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
