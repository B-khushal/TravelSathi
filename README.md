# TravelSathi 🌍

**TravelSathi** is a multilingual, localized travel guide app designed to help travelers explore destinations with ease. It provides curated travel information, cultural insights, and emergency contact details pulled from Wikipedia, Wikivoyage, and other trusted sources — all available in multiple Indian languages. It also supports offline mode for seamless access without internet connectivity.

---

## Features

- Search travel destinations and get detailed info about places, culture, and local rules.
- Automatic fact-based content powered by Wikipedia and Wikivoyage APIs.
- Emergency contact directory for police, hospitals, and other services at each destination.
- Multilingual support with easy language toggling.
- Offline mode with cached essential travel info for use without internet.
- Clean, responsive, and user-friendly interface.

---
## Team Members & Roles

- **A. Harinath Reddy**  
  Project Manager: Coordination, testing, documentation, demo preparation

- **S. Charitesh Reddy**  
  Backend Developer: Wikipedia & Wikivoyage API integration, emergency contacts, caching

- **Ananya Reddy**  
  Backend Developer: Translation & multilingual APIs, offline sync management

- **N. Dheeraj Chowdary**  
  Frontend Developer: Multilingual UI, language toggle, offline mode UI

- **B. Khushal**  
  Frontend Developer: UI enhancements, responsiveness, language toggle support

## Demo

> [Live Demo Link](#) *(Replace with your deployed app URL)*

---

## Tech Stack

- **Backend:** Python, FastAPI  
- **Frontend:** React.js (or Vanilla JS)  
- **APIs:** Wikipedia REST API, Wikivoyage API  
- **Translation:** Googletrans / Hugging Face models  
- **Offline Support:** Service Workers, localStorage / IndexedDB  
- **Deployment:** Netlify (Frontend), Render / Heroku (Backend)  
- **Version Control:** Git

---

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- Git

### Installation

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
