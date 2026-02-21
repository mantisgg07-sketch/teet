# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication for your application using Supabase.

## Prerequisites

- A Supabase project with authentication enabled
- A Google Cloud Console account
- Your application deployed or running locally

## Step 1: Create a Google Cloud Console Project

1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click **"New Project"**
4. Enter a project name (e.g., "GoHoliday Auth")
5. Click **"Create"**
6. Wait for the project to be created, then select it from the project dropdown

## Step 2: Configure the OAuth Consent Screen

Before creating OAuth credentials, you need to configure the consent screen that users will see when they sign in.

1. In the Google Cloud Console, navigate to **"APIs & Services" > "OAuth consent screen"** from the left sidebar
2. Select **"External"** as the User Type (unless you have a Google Workspace account and want to restrict to your organization)
3. Click **"Create"**

### Fill in the OAuth Consent Screen Information:

#### App Information
- **App name**: Enter your application name (e.g., "GoHoliday")
- **User support email**: Select your email address
- **App logo** (optional): Upload your app logo (recommended size: 120x120px)

#### App Domain
- **Application home page**: Enter your application's homepage URL
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`
- **Application privacy policy link** (optional but recommended)
- **Application terms of service link** (optional but recommended)

#### Authorized Domains
- Add your domain(s) where the app will be hosted
  - For production: `yourdomain.com`
  - For Supabase: Add your Supabase project domain (e.g., `yourproject.supabase.co`)

#### Developer Contact Information
- Enter your email address(es)

4. Click **"Save and Continue"**

### Scopes
1. Click **"Add or Remove Scopes"**
2. Select the following scopes (these are required for basic authentication):
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
3. Click **"Update"**
4. Click **"Save and Continue"**

### Test Users (if using External user type in development)
1. Add test users who can access the app during development
2. Enter email addresses of users who should be able to test
3. Click **"Save and Continue"**

### Summary
1. Review your settings
2. Click **"Back to Dashboard"**

## Step 3: Create OAuth 2.0 Client ID

1. In the Google Cloud Console, navigate to **"APIs & Services" > "Credentials"**
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** as the Application type

### Configure the OAuth Client:

#### Name
- Enter a name for your OAuth client (e.g., "GoHoliday Web Client")

#### Authorized JavaScript Origins
Add the origins where your application will be accessed:
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`
- Supabase: Your Supabase project URL (we'll add this in the next step)

#### Authorized Redirect URIs
Leave this empty for now. We'll get the correct redirect URI from Supabase and add it later.

5. Click **"Create"**
6. A dialog will appear showing your **Client ID** and **Client Secret**
7. **Important**: Copy both the Client ID and Client Secret. You'll need these for Supabase configuration.

## Step 4: Enable Google Provider in Supabase

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **"Authentication"** from the left sidebar
4. Click on **"Providers"**
5. Find **"Google"** in the list of providers
6. Toggle **"Enable Sign in with Google"** to ON

### Configure Google Provider:

1. **Client ID (for OAuth)**: Paste the Client ID from Step 3
2. **Client Secret (for OAuth)**: Paste the Client Secret from Step 3
3. **Authorized Client IDs**: Leave this empty unless you have specific requirements
4. Copy the **"Callback URL (for OAuth)"** - it will look like:
   ```
   https://yourproject.supabase.co/auth/v1/callback
   ```
5. Click **"Save"**

## Step 5: Add Callback URL to Google Cloud Console

Now that you have the callback URL from Supabase, add it to your Google OAuth client:

1. Go back to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services" > "Credentials"**
3. Click on the OAuth 2.0 Client ID you created in Step 3
4. Under **"Authorized redirect URIs"**, click **"+ Add URI"**
5. Paste the Supabase callback URL you copied in Step 4:
   ```
   https://yourproject.supabase.co/auth/v1/callback
   ```
6. Click **"Save"**

## Step 6: Update Authorized JavaScript Origins (Optional)

If you haven't already, add your Supabase project URL to the authorized origins:

1. In the same OAuth client configuration page
2. Under **"Authorized JavaScript origins"**, click **"+ Add URI"**
3. Add your Supabase project URL:
   ```
   https://yourproject.supabase.co
   ```
4. Click **"Save"**

## Step 7: Test Your Integration

1. Make sure your Supabase environment variables are set in your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. Navigate to your login page (e.g., `http://localhost:3000/login`)

4. Click the **"Sign in with Google"** button

5. You should be redirected to Google's OAuth consent screen

6. After authorizing, you should be redirected back to your application

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure the callback URL in Google Cloud Console exactly matches the one from Supabase
- Check for trailing slashes or http vs https mismatches
- Verify that the OAuth client is using the correct redirect URI

### "Access blocked: This app's request is invalid"
- Ensure your OAuth consent screen is properly configured
- Verify that you've added all required scopes
- Check that your authorized domains are correctly set

### "Error 401: invalid_client"
- Double-check that your Client ID and Client Secret in Supabase match the ones from Google Cloud Console
- Make sure you've enabled the Google provider in Supabase

### Users Can't Sign In (External User Type)
- If your app is in development mode with External user type, only test users you've added can sign in
- To allow anyone to sign in, you need to publish your app (on the OAuth consent screen page)

## Publishing Your App

Once you're ready for production:

1. Go to **"APIs & Services" > "OAuth consent screen"** in Google Cloud Console
2. Review your app information
3. Click **"Publish App"**
4. If you selected External user type, you may need to go through Google's verification process depending on your requested scopes

## Security Best Practices

1. **Keep your Client Secret secure**: Never commit it to version control or expose it in client-side code
2. **Use environment variables**: Store your Supabase credentials and Google OAuth credentials in environment variables
3. **Enable email verification**: Consider enabling email verification in Supabase for additional security
4. **Implement rate limiting**: Protect your authentication endpoints from abuse
5. **Monitor authentication logs**: Regularly check Supabase logs for suspicious activity

## Additional Resources

- [Supabase Google OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Dashboard](https://app.supabase.com/)

## Support

If you encounter any issues not covered in this guide:
1. Check the Supabase authentication logs in your dashboard
2. Review the browser console for any error messages
3. Consult the [Supabase Community](https://github.com/supabase/supabase/discussions)
4. Check the [Google OAuth troubleshooting guide](https://developers.google.com/identity/protocols/oauth2/web-server#troubleshooting)
