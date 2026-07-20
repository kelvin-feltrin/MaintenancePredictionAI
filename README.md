<div align="center">

# 🔧 MaintenancePredictionAI 

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-Random%20Forest-F7931E?logo=scikitlearn)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)

Leia em [Português](https://github.com/kelvin-feltrin/MaintenancePredictionAI/blob/main/README-pt.md)

### Intelligent Predictive Maintenance System powered by Machine Learning

A full-stack web application that predicts industrial equipment maintenance needs using a **Random Forest** machine learning model, featuring a modern **React** dashboard and a **FastAPI** backend.

🚀 **Live Demo:** https://maintenance-prediction-ai.vercel.app

</div>

---

## 📖 Overview

MaintenancePredictionAI is a predictive maintenance platform designed to assist industrial decision-making by identifying equipment with a high probability of failure before unexpected downtime occurs.

The project combines **Machine Learning**, **REST APIs**, and a modern **React** interface to deliver predictions in real time through an intuitive dashboard.

---

## ✨ Features

- 📊 Interactive operational dashboard
- 🤖 Machine Learning predictions (Random Forest)
- 📈 Analytics and visualization
- 📝 Prediction history
- ⚠️ Risk classification
- 💡 Maintenance recommendations
- 🌐 REST API built with FastAPI
- 📱 Responsive interface
- 🚀 Cloud deployment (Vercel + Render)

---

## 🖥️ Application

### Dashboard

> Operational overview with KPIs, charts and recent predictions.

<p align="center">
<img src="./docs/dashboard.png" width="900">
</p>

---

### Prediction

> Submit telemetry parameters and receive a maintenance prediction in real time.

<p align="center">
<img src="./docs/prediction.png" width="900">
</p>

---

## 🏗️ Architecture

```text
                 React + TypeScript
                        │
                        │ HTTPS
                        ▼
             FastAPI REST API (Render)
                        │
                        ▼
             Random Forest Model (.pkl)
                        │
                        ▼
               Maintenance Prediction
```

---

## ⚙️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- Recharts
- CSS

### Backend

- FastAPI
- Python
- Scikit-Learn
- Pandas
- Joblib
- Uvicorn

### Machine Learning

- Random Forest Classifier
- StandardScaler
- One-Hot Encoding

### Deployment

- Vercel (Frontend)
- Render (Backend)

---

## 📊 Dataset

Dataset used:

**Machine Predictive Maintenance Classification**

Source:

https://www.kaggle.com/datasets/shivamb/machine-predictive-maintenance-classification?resource=download

---

## 🚀 Running Locally

### Clone the repository

```bash
git clone https://github.com/SEU-USUARIO/MaintenancePredictionAI.git

cd MaintenancePredictionAI
```

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 📡 API Endpoints

### Health Check

```
GET /
```

Returns the API status.

---

### Prediction

```
POST /predict
```

Example request:

```json
{
  "type": "L",
  "air_temperature": 298.15,
  "process_temperature": 308.15,
  "rotational_speed": 1500,
  "torque": 40,
  "tool_wear": 60
}
```

---

## 📸 Project Gallery

- Dashboard
  <img src="https://raw.githubusercontent.com/kelvin-feltrin/MaintenancePredictionAI/refs/heads/main/assets/dashboard.png">
  
- Prediction Screen
  <img src="https://raw.githubusercontent.com/kelvin-feltrin/MaintenancePredictionAI/refs/heads/main/assets/new-predict.png">
  
- Successful Prediction
  <img src="https://raw.githubusercontent.com/kelvin-feltrin/MaintenancePredictionAI/refs/heads/main/assets/no-maintenance-needed.png">
  
- Failure Prediction
  <img src="https://raw.githubusercontent.com/kelvin-feltrin/MaintenancePredictionAI/refs/heads/main/assets/maintenance-needed.png">

---

## 🎯 Project Goals

- Predict equipment failures
- Reduce unexpected downtime
- Support industrial maintenance decisions
- Demonstrate a complete Machine Learning deployment pipeline

---

## 📚 Academic Project

This project was developed as part of a Machine Learning course, covering the complete workflow:

- Exploratory Data Analysis (EDA)
- Data preprocessing
- Model comparison
- Model evaluation
- API development
- Frontend development
- Cloud deployment

---

## 👨‍💻 Author

Developed by **Kelvin de Lucca Feltrin**
