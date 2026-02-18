## Issues Faced & How They Were Resolved

## Supabase Setup (First Time Use)
While setting up Supabase for the first time, I encountered multiple configuration issues. I referred to documentation and tutorial videos to understand the setup process and successfully completed the configuration.

## Google OAuth Not Working
Authentication initially failed because the Google provider and authorization settings were not properly configured in Supabase. After troubleshooting and following tutorials, I enabled the provider correctly and fixed the issue.

## Missing Authorized Redirect URI
OAuth continued to fail due to an incorrect/missing Authorized Redirect URI. The correct redirect URL had to be added from Supabase google oauth settings to the google cloud console.

## Deleted OAuth Client Error
An error occurred because the OAuth client had been removed. I recreated a new OAuth client in Google Cloud and reconfigured all credentials.

## Database Table Not Found
Error: Could not find the table 'public.bookmarks' in the schema cache
Cause: The bookmarks table did not exist in the database.
Fix: Created the bookmarks table in Supabase and the application worked correctly.

## URL Configuration for site error for google login
default url is http://localhost:3000 but it should be https://task-bookmark-nine.vercel.app/ for google login in supabase Site URL(Configure site URL and redirect URLs for authentication). 