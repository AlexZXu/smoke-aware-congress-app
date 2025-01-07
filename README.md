# Smoke Aware: A Real-Time Wildfire & Smoke Data App
**Congressional App Challenge GA-07 2nd Place Winner**


**Created by**: Alexander Xu

**Contact**: xualex008@gmail.com!

## Overview
Smoke Aware is a web application designed to make data on pollution and wildfire smoke more accessible and understandable to a wider audience. The app leverages artificial intelligence and web-scraping to aggregate real-time data on wildfires and pollution, which are increasingly linked to climate change. 
Millions of people are affected annually by harmful smoke inhalation, often without sufficient resources to mitigate the risks. Smoke Aware aims to help raise public awareness about these issues to help keep people safe and track important climate trends.

## Features
1. **Regional Air Quality Reports**
    - Utilizing Google Maps's Air Quality API, the app enables users to access real-time data on the air quality and concentration of various pollutants (Carbon monoxide, Nitrogen dioxide, Ozone, etc).
    - The app provides future forecasts on air quality and pollutants helping users be prepared.
![regional_screenshot](https://github.com/user-attachments/assets/fee13294-4c8a-4707-918a-5f139d8efe1b)
2. **Wildfire Smoke Visualization**
    - The app aggregates data from publicly available sources on ongoing wildfires and smoke spread. Users are able to view a daily summary of the data from major smoke monitors or analyze data from a specific monitor, exploring trends with toggles, tooltips, and interactive graphs.
      
![app-daily-summary](https://github.com/user-attachments/assets/ee426929-a0df-4502-962a-9c10a2eb71df)
![single-smoke-data](https://github.com/user-attachments/assets/5048288d-794e-49b9-8eca-c4c9e365fec5)
3. **Custom Data Retrieval**
    - Provides customizable tools to fetch, preview, and download datasets, supporting researchers with detailed analysis needs such as building machine learning-based smoke dispersion models.
    - Users are able to download data from specific smoke monitors or daily summaries, with several additional options.
![fetch-data-app](https://github.com/user-attachments/assets/8dd6d792-25ca-429d-8555-0d7fdeb26cb2)
4. **AI Analysis and Insights**
    - Includes a custom AI model built on retrieval-augmented generation (RAG) for answering wildfire and climate-related queries, improving efficiency for researchers and raising public awareness.
    - Because the model is able to access specific dataset files, the AI bot allows users to ask both general questions and detailed questions about specific smoke data.
![app-ai-features](https://github.com/user-attachments/assets/ace158d7-6682-49cf-b7ad-cb6714827dc7)
## Technology Stack
- **Frontend:** Developed using Next.js with React and Tailwind CSS for a responsive and intuitive user interface. 
- **Backend:** Aggregated data from sources like the WRCC and EPA are fetched using Python and BeautifulSoup and stored in a No-SQL Google Firestore Database. The app integrates APIs from Google Maps to fetch geospatial data and provide real-time visualization. It also utilizes OpenAI for AI-powered features, particularly in developing the retrieval-augmented generation (RAG) system.
- **Data Sources:** Utilized custom programs to aggregate real-time AQI and wildfire smoke data from government websites and reputable third-party APIs. 
## How to Use
1. Visit the Smoke Aware web app at https://smoke-aware-app.vercel.app/
2. Enter your location for personalized air quality data on the home page.
3. Explore data visualization and analysis tools on wildfire smoke in the "Daily Summary" and "Smoke Monitoring" pages.
4. Fetch and export detailed wildfire smoke datasets in the "Fetch and Export" pages. Simply specify a date range and choose whether to download daily summaries or data from a specific monitor.
5. With data from the "Fetch and export" page or just data in general, query the AI in the "Analyze with AI" page.
*Future goals include community features like the ability for users to share local observations and photos to build a collaborative air quality map and improvements in responsiveness.*
---
Smoke Aware is a step forward in combining technology with environmental advocacy. This app is one step in helping track, adapt, and mitigate the effects of wildfire smoke on our health and planet.
Contact: For questions, feedback, or collaboration opportunities, email Alexander Xu at xualex008@gmail.com.
