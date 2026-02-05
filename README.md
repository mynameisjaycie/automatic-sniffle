# Senior Full-Stack Engineer Assessment

This repository contains my submission for the DecryptCode Senior Full-Stack Engineer take-home assessment.

![optional alt text](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3Zkbm1zNDNhOXVucmM4bjl0YTQ4bDdieHh5aHI2MXBpZmV5ZHFjaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cXblnKXr2BQOaYnTni/giphy.gif)

## Table of Contents

- [Overview](#overview)
- [What Was Requested](#what-was-requested)
- [Quick Start](#quick-start)
- [Technologies](#technologies)
- [Approach](#approach)
- [Notes](#notes)

## Overview

This is a simple e-commerce application built with:
- Frontend: React
- Backend: Node.js
- Data: In-memory mock data (products, categories, orders)

The app supports:
- Browsing products
- Viewing product details
- Viewing a cart and placing an order

## What Was Requested

The assessment asked for a 40–60 minute implementation of a basic storefront with:
- A product list page that fetches products, shows loading and error states, and links to details
- A product detail page that fetches by id and handles not-found cases
- A cart page that shows line items and a total
- Backend support for `GET /api/products/:id` with a proper 404 response
- Middleware validation for `POST /api/orders`

Two optional enhancements were also requested:
- Add product filtering and/or sorting on the list page
- Allow placing an order from the cart

## Quick Start

### Backend
> `cd backend && npm install && npm run dev`

* API (Node.js)
  * http://localhost:3001
  * Contains routes, middleware, controllers, & mock data.

### Frontend
> ` cd frontend && npm install && npm run dev`
 
* App (React/Vite)
  * http://localhost:5173
  * Contains product list, product detail & cart pages.

## Technologies

- IDE: JetBrains Rider
- Git client: GitKraken
- OS: macOS Tahoe 26.2
- AI support: Codex integrated with my ChatGPT account (GPT-5.2-codex model)

## Notes

This solution is intentionally lightweight and focused on the requested functionality. With more time, I would expand error handling, test coverage, and state management patterns for production readiness.
