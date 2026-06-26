
JIVRAKSHAK – Smart Collar for Pet Monitoring

Because Pets Deserve Smart Care

Jivrakshak is a low-cost IoT-based smart pet monitoring system designed to improve pet safety, health monitoring, and location tracking. The system integrates multiple sensors with cloud connectivity to continuously monitor a pet's vital parameters and provide timely alerts to the owner. Collected data is stored on ThingSpeak and visualized through a dedicated web dashboard, enabling owners to monitor their pets remotely.

📌 Project Overview

The primary objective of Jivrakshak is to provide an affordable alternative to expensive commercial smart pet collars while maintaining essential monitoring features.

The system continuously monitors:

🌡 Temperature
❤️ Heart Rate
📍 GPS Location
🐕 Activity & Movement

Sensor data is transmitted to the cloud and later visualized using a web-based dashboard for health analysis, historical records, and alert generation.

✨ Features
Real-Time GPS Tracking
Temperature Monitoring
Heart Rate Monitoring
Activity & Movement Detection
Cloud Data Logging (ThingSpeak)
CSV-Based Data Visualization
Google Maps Location Tracking
Temperature & Heart Rate Graphs
Alert Generation for Abnormal Conditions
Pet Profile Management
Health & Activity Logs
Vet Connect Module
Pet Care & Nutrition Portal
Low-Cost Hardware Design
Future Ready for Machine Learning Integration
🛠 Hardware Components
Component	Purpose
Arduino Mega 2560	Main Controller
ESP-01 WiFi Module	Cloud Communication
SIM800L GSM Module	SMS Alerts & Location Requests
NEO-6M GPS Module	Live Location Tracking
DHT11 Sensor	Temperature Monitoring
MAX30100 Sensor	Heart Rate Monitoring
ADXL335 Accelerometer	Activity Detection
16×2 LCD Display	Local Status Display
RF 433 MHz Module	Wireless Communication
HT12E / HT12D	RF Encoder & Decoder
Buzzer	Alert Notification
Relay Module	External Device Control
18650 Batteries	Power Supply
BMS	Battery Protection
Voltage Regulator	Stable Power Supply
💻 Software Stack
HTML5
CSS3
JavaScript
Wix Studio / Wix Vibe
ThingSpeak Cloud Platform
Google Maps
Arduino IDE
Embedded C/C++
CSV Data Processing
🌐 Website Modules
🏠 Home

Project overview, features, navigation, and introduction.

📊 Live Monitoring Dashboard
Pet Status
Temperature
Heart Rate
GPS Location
Current Health Status
🐶 Pet Profile
Pet Details
Owner Information
Medical Notes
Collar ID
📈 Health & Activity Logs
Temperature Graph
Heart Rate Graph
Activity Level
CSV Reports
🚨 Alerts
Fever Alerts
Heart Rate Alerts
Movement Alerts
Tamper Alerts
🧠 ML Insights (Future Scope)
Health Prediction
Behavior Analysis
Trend Analysis
🍖 Pet Care & Nutrition
Blogs
Nutrition Tips
Gourmet Recipes
Pet Care Articles
👨‍⚕️ Vet Connect
Vet Directory
Appointment Request
Consultation Form
⚙ Working
Sensors collect temperature, heart rate, movement, and GPS data.
Arduino processes the collected information.
Data is uploaded to ThingSpeak through WiFi/GSM.
CSV data is exported from ThingSpeak.
The website visualizes data using graphs and maps.
Threshold-based alerts notify users of abnormal conditions.
🚨 Alert Conditions
Temperature
Condition	Value
Normal	37.2°C – 39.4°C
Fever	>39.4°C
Critical	≥41°C
Hypothermia	<37.2°C
Heart Rate
Condition	Value
Normal	70–160 BPM
Bradycardia	<60 BPM
Tachycardia	>180 BPM
📡 Communication Protocols
UART
I2C
HTTP
GSM
NMEA (GPS)
RF 433 MHz Communication
📂 Cloud Platform

ThingSpeak is used for:

Data Logging
Historical Records
CSV Export
Health Monitoring
Sensor Data Storage
📷 Dashboard Features
Temperature Graph
Heart Rate Graph
Activity Analysis
Google Maps Tracking
Alert History
Health Logs
CSV Download
🎯 Objective

To develop a low-cost IoT-based smart collar that enables real-time monitoring of a pet's health, location, and safety with alert-based tracking and cloud data logging, while providing an intuitive web-based dashboard for visualization, analysis, and improved pet care.

🚀 Future Enhancements
Real-Time API Integration
Machine Learning Health Prediction
Behavior Analysis
Mobile Application
Multi-Pet Management
Veterinary Analytics
Geofencing Notifications
👨‍💻 Project Team
Vedant Bhor
Rajnandini Kanade
Ketaki Mahamuni
Siddesh Choudhari

Project Guide

Mrs. Swapnali Londhe

🏫 Institution

Department of Computer Engineering
PES Modern College of Engineering, Pune

📄 License

This project has been developed for academic and educational purposes as part of the undergraduate Computer Engineering curriculum.

⭐ Tagline

Because Pets Deserve Smart Care

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
