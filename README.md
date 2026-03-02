<p align="center">
  <img src="https://img.shields.io/badge/AI-Environmental%20Intelligence-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Streaming-Pathway-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge">
  <img src="https://img.shields.io/badge/Backend-FastAPI-red?style=for-the-badge">
</p>
<p align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3CB371,100:1E90FF&height=250&section=header&text=EcoStream%20AI&fontSize=48&fontColor=ffffff&animation=fadeIn"/>

</p>

<p align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=22&duration=3000&color=00E0A4&center=true&vCenter=true&width=600&lines=Real-Time+Environmental+Decision+Engine;AI+Powered+Environmental+Intelligence;Streaming+Analytics+Using+Pathway;Hackathon+Project+by+Team+Chole+Bhature"/>

</p>
<p align="center">
Transforming environmental data into real-time intelligence using  
AI • Streaming Data • RAG • Policy Simulation
</p>

---

# 🚀 Overview

EcoStream AI is a **real-time environmental intelligence platform** that converts live environmental data into **actionable insights**.

Instead of just showing pollution data, EcoStream AI enables:

• real-time environmental monitoring  
• AI-powered environmental Q&A  
• environmental stress prediction  
• policy impact simulation

The platform combines **streaming analytics + AI reasoning + decision simulation** to help understand environmental risks.

---

# 🎯 Problem

Environmental dashboards today show **raw data but no intelligence**.

Problems:

• pollution data is fragmented  
• citizens cannot interpret AQI trends  
• policymakers lack simulation tools  
• environmental decision support is missing

---

# 💡 Solution

EcoStream AI provides:

✔ Real-time environmental monitoring  
✔ AI-powered environmental intelligence engine  
✔ Policy simulation system  
✔ Environmental stress prediction

This transforms environmental data into **decision-making intelligence**.

---

# ⚡ Key Features

### 🌍 Live Environmental Monitoring

• Real-time AQI data streaming  
• Temperature monitoring  
• Environmental stress score calculation  
• Auto refresh every few seconds

---

### 🤖 Environmental Intelligence Engine

AI powered **RAG system** that answers questions like:

• What is the AQI right now?  
• Is pollution dangerous today?  
• What are WHO guidelines?

---

### 🧠 Environmental Stress Score

AI model that converts environmental signals into:
```
Environmental Stress Score = f(AQI, Temperature)
```
Helps quantify environmental risk.

---

### 📊 Policy Simulator

Simulate environmental policies such as:

• traffic reduction  
• emission control  
• pollution mitigation

The system predicts **future environmental impact**.

---

# 🧩 System Architecture
```mermaid
flowchart LR

subgraph Data Sources
A[WAQI API]
B[Weather API]
C[User Location GPS]
end

subgraph Streaming Engine
D[Pathway Streaming Engine]
E[Real-Time Data Processing]
F[Environmental State Manager]
end

subgraph AI Intelligence Layer
G[RAG Retriever]
H[Document Store]
I[LLM Response Generator]
end

subgraph Decision Engine
J[Environmental Stress Model]
K[Policy Simulation Engine]
end

subgraph User Interface
L[Next.js Dashboard]
M[Live Metrics Visualization]
N[Environmental Chat Assistant]
end

A --> D
B --> D
C --> D

D --> E
E --> F

F --> J
F --> G

H --> G
G --> I

I --> N

J --> M
K --> M

M --> L
N --> L
```

---

# 🧠 AI Components

EcoStream AI integrates multiple AI modules:

### Retrieval Augmented Generation (RAG)

• environmental guidelines  
• WHO pollution thresholds  
• live environmental data

---

### Environmental Risk Model

AI formula used:
```
Stress Score = 0.6 × AQI + 0.4 × Temperature
```

Helps measure environmental impact.

---

# 🛠 Tech Stack

## Frontend

<img src="https://skillicons.dev/icons?i=nextjs,react,tailwind"/>

---

## Backend

<img src="https://skillicons.dev/icons?i=python,fastapi,docker"/>

---

## AI / Streaming

• Pathway Streaming Engine  
• Retrieval Augmented Generation (RAG)  
• Environmental Data APIs  

---


# 📦 Project Structure
```

EcoStream-AI/
│
├── backend/
│   │
│   ├── app.py                 # FastAPI / Flask entry point
│   ├── config.py              # Constants, thresholds, weights
│   │
│   ├── ingestion/
│   │   ├── aqi_stream.py
│   │   ├── weather_stream.py
│   │   └── rss_stream.py
│   │
│   ├── streaming/
│   │   ├── transformations.py   # rolling windows, joins
│   │   ├── risk_engine.py       # stress score logic
│   │   └── alerts.py            # event trigger logic
│   │
│   ├── rag/
│   │   ├── document_store.py
│   │   ├── retriever.py
│   │   └── llm_handler.py
│   │
│   ├── simulator/
│   │   └── policy_simulator.py
│   │
│   └── utils/
│       └── helpers.py
│
├── frontend/
│   │
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── docs/
│   └── architecture.png
│
├── requirements.txt
├── README.md
└── .venv

And Many others ..........
```

---

# 🌐 Deployment

EcoStream AI runs as a **cloud-based real-time system**.

Deployment stack:

• Docker containers  
• Render Cloud  
• Streaming backend  

---

# 📊 Live Capabilities

✔ Live AQI updates  
✔ Environmental risk prediction  
✔ AI environmental assistant  
✔ policy simulation engine  

---

# 🔮 Future Improvements

• Multi-city environmental monitoring  
• satellite pollution data integration  
• climate prediction models  
• government decision dashboards  

---

# 👥 Team

### Team Name  
Chole Bhature

### Project  
EcoStream AI

### Team Lead  
Ananya

### Team Members
• Chaithrika Yadav

• Ayush Rajput

• Jatin Gupta

---

# 🌱 Vision

EcoStream AI demonstrates how **AI + streaming analytics** can transform environmental monitoring into **decision intelligence platforms** for smart cities.

---

# ⭐ If you like this project

Give it a ⭐ on GitHub!

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:3CB371,100:1E90FF&height=250&section=footer"/>
</p>
