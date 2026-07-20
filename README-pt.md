<div align="center">

# 🔧 MaintenancePredictionAI

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-Random%20Forest-F7931E?logo=scikitlearn)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)

Read in [English](https://github.com/kelvin-feltrin/MaintenancePredictionAI/blob/main/README.md)

### Sistema Inteligente de Manutenção Preditiva utilizando Machine Learning

Uma aplicação web full-stack capaz de prever a necessidade de manutenção em equipamentos industriais utilizando um modelo de **Machine Learning Random Forest**, com uma interface moderna desenvolvida em **React** e uma API construída em **FastAPI**.

🚀 **Acesse a aplicação:** https://maintenance-prediction-ai.vercel.app

</div>

---

# 📖 Visão Geral

O **MaintenancePredictionAI** é uma plataforma de manutenção preditiva desenvolvida para auxiliar a tomada de decisão em ambientes industriais, identificando equipamentos com alta probabilidade de falha antes que ocorram paradas inesperadas.

O projeto combina técnicas de **Machine Learning**, **APIs REST** e uma interface moderna em **React** para fornecer previsões em tempo real por meio de um dashboard intuitivo.

---

# ✨ Funcionalidades

- 📊 Dashboard operacional interativo
- 🤖 Predições utilizando Machine Learning (Random Forest)
- 📈 Painel de análises e visualizações
- 📝 Histórico de previsões realizadas
- ⚠️ Classificação do nível de risco
- 💡 Recomendações de manutenção
- 🌐 API REST desenvolvida com FastAPI
- 📱 Interface responsiva
- 🚀 Aplicação publicada na nuvem (Vercel + Render)

---

# 🖥️ Aplicação

## Dashboard

> Visão geral da operação com indicadores, gráficos e histórico das últimas previsões.

---

## Nova Previsão

> Informe os parâmetros de telemetria do equipamento e obtenha uma predição em tempo real.

---

# 🏗️ Arquitetura

```text
                 React + TypeScript
                        │
                        │ HTTPS
                        ▼
               API REST FastAPI (Render)
                        │
                        ▼
         Modelo Random Forest (.pkl)
                        │
                        ▼
          Predição de Manutenção
```

---

# ⚙️ Tecnologias Utilizadas

## Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- Recharts
- CSS

## Backend

- FastAPI
- Python
- Scikit-Learn
- Pandas
- Joblib
- Uvicorn

## Machine Learning

- Random Forest Classifier
- StandardScaler
- One-Hot Encoding

## Deploy

- Vercel (Frontend)
- Render (Backend)

---

# 📊 Dataset

**Dataset utilizado:**

Machine Predictive Maintenance Classification

**Fonte:**

https://www.kaggle.com/datasets/shivamb/machine-predictive-maintenance-classification

---

# 🚀 Executando Localmente

## Clonando o repositório

```bash
git clone https://github.com/kelvin-feltrin/MaintenancePredictionAI.git

cd MaintenancePredictionAI
```

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📡 Endpoints da API

## Verificação de Status

```http
GET /
```

Retorna o status da API.

---

## Predição

```http
POST /predict
```

Exemplo de requisição:

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

# 📸 Galeria do Projeto

### Dashboard

<img src="https://raw.githubusercontent.com/kelvin-feltrin/MaintenancePredictionAI/refs/heads/main/assets/dashboard.png">

### Nova Previsão

<img src="https://raw.githubusercontent.com/kelvin-feltrin/MaintenancePredictionAI/refs/heads/main/assets/new-predict.png">

### Predição sem necessidade de manutenção

<img src="https://raw.githubusercontent.com/kelvin-feltrin/MaintenancePredictionAI/refs/heads/main/assets/no-maintenance-needed.png">

### Predição com necessidade de manutenção

<img src="https://raw.githubusercontent.com/kelvin-feltrin/MaintenancePredictionAI/refs/heads/main/assets/maintenance-needed.png">

---

# 🎯 Objetivos do Projeto

- Prever falhas em equipamentos industriais.
- Reduzir paradas inesperadas.
- Auxiliar a tomada de decisão em processos de manutenção.
- Demonstrar um pipeline completo de Machine Learning em produção.

---

# 📚 Projeto Acadêmico

Este projeto foi desenvolvido como parte de uma disciplina de **Machine Learning**, contemplando todas as etapas do desenvolvimento de uma solução baseada em Inteligência Artificial:

- Análise Exploratória dos Dados (EDA)
- Pré-processamento dos dados
- Comparação de modelos
- Avaliação de desempenho
- Desenvolvimento da API
- Desenvolvimento da interface web
- Publicação da aplicação na nuvem

---

# 👨‍💻 Autor

Desenvolvido por **Kelvin de Lucca Feltrin**
