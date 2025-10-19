# Deployment Guide

## Vercel Deployment Steps

### 1. Environment Variables Setup

Before deploying, you need to set up your environment variables in Vercel:

#### Required Environment Variables:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolioDB?retryWrites=true&w=majority
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CONTACT_TO_EMAIL=your-email@gmail.com
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_FROM_NUMBER=your-twilio-phone-number
ALERT_TO_PHONE=+1234567890
NODE_ENV=production
```

### 2. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account

2. **Create a Cluster**

   - Choose the free tier (M0)
   - Select a region close to your users
   - Name your cluster (e.g., "portfolio-cluster")

3. **Database Access**

   - Go to "Database Access"
   - Click "Add New Database User"
   - Create a username and password
   - Give "Read and write to any database" permissions

4. **Network Access**

   - Go to "Network Access"
   - Click "Add IP Address"
   - Add "0.0.0.0/0" to allow access from anywhere (for Vercel)

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `portfolioDB`

### 3. Gmail Setup

1. **Enable 2-Factor Authentication**

   - Go to Google Account settings
   - Enable 2FA

2. **Generate App Password**
   - Go to Google Account > Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password for "Mail"
   - Use this password in `GMAIL_APP_PASSWORD`

### 4. Twilio Setup (Optional)

1. **Create Twilio Account**

   - Go to [Twilio](https://www.twilio.com)
   - Sign up for a free account

2. **Get Credentials**
   - Find your Account SID and Auth Token in the console
   - Purchase a phone number for sending SMS

### 5. Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy

### 6. Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each environment variable:
   - Name: `MONGO_URI`, Value: `your-mongodb-connection-string`
   - Name: `GMAIL_USER`, Value: `your-email@gmail.com`
   - Name: `GMAIL_APP_PASSWORD`, Value: `your-app-password`
   - And so on...

### 7. Test Your Deployment

1. **Test MongoDB Connection**

   ```bash
   node test-connection.js
   ```

2. **Test Contact Form**
   - Visit your deployed site
   - Fill out the contact form
   - Check Vercel logs for any errors

### 8. Monitoring

- **Vercel Logs**: Check the Functions tab in Vercel dashboard
- **MongoDB Atlas**: Monitor your database usage
- **Email**: Check if emails are being sent
- **SMS**: Verify SMS notifications work

## 🔧 Troubleshooting

### Common Issues:

1. **"Mongo not connected" Error**

   - Check if `MONGO_URI` is set correctly
   - Verify MongoDB Atlas IP whitelist includes Vercel IPs
   - Ensure database user has proper permissions

2. **Email Not Sending**

   - Verify Gmail App Password is correct
   - Check if 2FA is enabled
   - Ensure SMTP settings are correct

3. **SMS Not Working**

   - Verify Twilio credentials
   - Check phone number format
   - Ensure sufficient Twilio balance

4. **Build Failures**
   - Check if all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check for any syntax errors

### Debug Commands:

```bash
# Test local connection
node test-connection.js

# Check environment variables
node -e "console.log(process.env.MONGO_URI)"

# Test email service
node -e "require('./utils/emailService').sendEmail({name:'Test',email:'test@test.com',subject:'Test',message:'Test'})"
```

## 📊 Performance Tips

1. **Database Optimization**

   - Use MongoDB indexes for frequently queried fields
   - Implement connection pooling
   - Monitor database performance

2. **Vercel Optimization**

   - Use Vercel Edge Functions for better performance
   - Implement caching strategies
   - Optimize bundle size

3. **Monitoring**
   - Set up Vercel Analytics
   - Monitor MongoDB Atlas metrics
   - Track error rates and performance

## 🛡️ Security Best Practices

1. **Environment Variables**

   - Never commit `.env` files
   - Use strong, unique passwords
   - Rotate credentials regularly

2. **Database Security**

   - Use strong database passwords
   - Limit IP access in MongoDB Atlas
   - Enable database authentication

3. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS in production

##Scaling

As your portfolio grows:

1. **Database Scaling**

   - Upgrade MongoDB Atlas tier
   - Implement database sharding
   - Use read replicas

2. **Application Scaling**

   - Use Vercel Pro for better performance
   - Implement CDN caching
   - Optimize images and assets

3. **Monitoring**
   - Set up comprehensive logging
   - Implement error tracking
   - Monitor performance metrics
