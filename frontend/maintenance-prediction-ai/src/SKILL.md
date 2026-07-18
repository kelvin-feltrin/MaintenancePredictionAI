# MaintenancePredictionAI React Development Skill

## Overview

You are developing the frontend application for **MaintenancePredictionAI**, an AI-powered predictive maintenance platform.

The application must be built using **React + TypeScript** with a modern, scalable, and professional architecture. The interface will consume a Python Machine Learning API responsible for equipment maintenance predictions.

The goal is to create a production-quality dashboard interface that allows users to input equipment data, request predictions, and visualize maintenance risk information clearly.

---

# Core Technology Requirements

The project must use:

- React
- TypeScript
- Vite
- CSS Modules or organized component-level CSS
- Axios for API communication
- React Router for navigation
- React Icons for interface icons

Optional libraries:

- Recharts for charts and visualizations
- date-fns for date manipulation
- react-hook-form for complex forms
- zod for validation

Avoid unnecessary dependencies.

---

# Project Architecture Rules

Maintain a clean and scalable folder structure:

```
src
│
├── api
│   ├── api.ts
│   └── endpoints.ts
│
├── assets
│
├── components
│   ├── Button
│   ├── Card
│   ├── Input
│   ├── Modal
│   ├── Sidebar
│   └── Header
│
├── layouts
│   └── DashboardLayout
│
├── pages
│   ├── Dashboard
│   ├── Prediction
│   └── History
│
├── hooks
│
├── services
│
├── types
│
├── utils
│
├── App.tsx
└── main.tsx
```

Rules:

- Components must be reusable.
- Avoid large components.
- A component should have one main responsibility.
- Business logic should not live inside UI components.
- API calls must be isolated from pages/components.

---

# Code Quality Rules

Always:

- Use TypeScript types/interfaces.
- Avoid using `any`.
- Use meaningful variable names.
- Keep functions small.
- Prefer composition over inheritance.
- Keep components readable.
- Remove unused imports.
- Follow React best practices.

Avoid:

- Huge JSX blocks.
- Inline complex logic.
- Duplicated code.
- Hardcoded values.

---

# API Integration Requirements

The frontend must connect directly to the Python Machine Learning API.

Do NOT create fake/mock APIs.

The API layer must be created from the beginning.

Example structure:

```
src/api/api.ts
```

Responsibilities:

- Configure Axios instance.
- Configure base URL using environment variables.
- Handle HTTP errors.
- Centralize API requests.

Example:

```ts
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});
```

---

# Environment Configuration

Use environment files:

```
.env.development
.env.production
```

Example:

```
VITE_API_URL=http://localhost:8000
```

Never hardcode API URLs.

---

# API Service Pattern

Create services separated by domain.

Example:

```
src/services/predictionService.ts
```

Example responsibility:

```ts
export async function predictMaintenance(data: PredictionRequest)
{
    const response = await api.post(
        "/predict",
        data
    );

    return response.data;
}
```

Components should never call Axios directly.

---

# Type Definitions

All API responses must have TypeScript interfaces.

Example:

```
src/types/prediction.ts
```

Example:

```ts
export interface PredictionRequest {

    temperature:number;
    vibration:number;
    operatingHours:number;

}


export interface PredictionResponse {

    prediction:number;

    status:string;

    probability:number;

    risk:string;

    recommendation:string;

    message:string;

}
```

---

# User Interface Guidelines

The interface must have a modern SaaS dashboard appearance.

Design principles:

- Clean layout.
- Good spacing.
- Clear hierarchy.
- Professional enterprise style.
- Responsive design.
- Avoid excessive colors.
- Avoid default browser styling.

The visual inspiration should be:

- Industrial IoT dashboards.
- Predictive analytics platforms.
- Enterprise monitoring systems.

---

# Main Application Layout

Create a dashboard layout containing:

## Sidebar

Requirements:

- Application logo/name.
- Navigation items.
- Active route highlight.
- Icons.
- Collapsible behavior if necessary.

Navigation examples:

- Dashboard
- New Prediction
- Prediction History
- Analytics

---

## Header

Include:

- Page title.
- User area placeholder.
- Notifications placeholder.

---

# Dashboard Page

The dashboard should display:

## Summary Cards

Examples:

- Total Predictions
- High Risk Equipment
- Low Risk Equipment
- Maintenance Required

Cards must be reusable components.

---

# Prediction Page

This is the main feature.

The page should contain:

## Input Form

The user enters equipment information.

Examples:

- Temperature
- Vibration
- Pressure
- Operating hours
- Usage information
- Other ML features

Requirements:

- Proper labels.
- Validation.
- Loading state.
- Error handling.

---

## Prediction Result

After calling the Python API display:

- Maintenance status.
- Risk level.
- Failure probability.
- Recommendation.
- Explanation message.

Use visual indicators:

Example:

Low Risk:

- Green indicator.

Medium Risk:

- Yellow indicator.

High Risk:

- Red indicator.

---

# Loading States

Every asynchronous operation must have:

- Loading indicator.
- Disabled buttons while processing.
- User feedback.

Never leave the user wondering if something is happening.

---

# Error Handling

API failures must display friendly messages.

Examples:

Bad:

```
AxiosError 500
```

Good:

```
Unable to process prediction. Please try again.
```

---

# Responsive Design

The application must work on:

- Desktop.
- Tablet.
- Mobile.

Avoid fixed widths.

Prefer:

- Flexbox.
- CSS Grid.
- Responsive breakpoints.

---

# State Management

Use React built-in state whenever possible.

Prefer:

- useState
- useEffect
- custom hooks

Do not introduce global state libraries unless necessary.

---

# Component Creation Rules

Before creating a component ask:

1. Is this reused?
2. Does it have a clear responsibility?
3. Does extracting it improve readability?

Create components such as:

```
RiskCard
PredictionForm
PredictionResult
MetricCard
LoadingSpinner
```

---

# Naming Convention

Use:

Components:

```
PascalCase

PredictionCard.tsx
SidebarMenu.tsx
```

Functions:

```
camelCase

fetchPrediction()
handleSubmit()
```

Files:

```
camelCase for utilities
PascalCase for components
```

---

# UX Rules

Always provide:

- Feedback after actions.
- Clear empty states.
- Clear errors.
- Consistent spacing.
- Accessible labels.

Buttons must clearly communicate actions.

---

# Future Expansion

The architecture must allow adding:

- Prediction history.
- Authentication.
- User permissions.
- Equipment monitoring.
- Charts.
- Reports.
- Export functionality.

Do not create a structure that blocks future growth.

---

# Final Goal

The final application should feel like a professional predictive maintenance product, not a simple machine learning demo.

Prioritize:

1. Good architecture.
2. Maintainable code.
3. Professional UI.
4. Clear API integration.
5. Excellent user experience.