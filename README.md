<div align="center">
	<a><img src="https://res.cloudinary.com/dmis04mcg/image/upload/v1789885991/logo-klean_mlxrbb.png" alt="" width="15%"></a>
</div>

<br/>

<div align="center">
	<a><img src="https://img.shields.io/badge/Node.js-20.x-5FA04E?logo=nodedotjs&logoColor=white"></a>
	<a><img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black"></a>
	<a><img src="https://img.shields.io/badge/Vite-8.x-9135FF?logo=vite&logoColor=white"></a>
	<a><img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white"></a>
	<a><img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white"></a>
	<a><img src="https://img.shields.io/badge/TypeScript-5.x_%2F_6.x-3178C6?logo=typescript&logoColor=white"></a>
	<a><img src="https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma"></a>
	<a><img src="https://img.shields.io/badge/PostgreSQL-16.x-4169E1?logo=postgresql"></a>
  <a><img src="https://img.shields.io/badge/Supabase-gray?logo=supabase"></a>
  <a><img src="https://img.shields.io/badge/Midtrans-gray?logo=data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NS40MiA1OS43OTMiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojOWRkY2Y5O30uY2xzLTEsLmNscy0yLC5jbHMtM3tmaWxsLXJ1bGU6ZXZlbm9kZDt9LmNscy0ye2ZpbGw6IzAwYWNkYjt9LmNscy0ze2ZpbGw6IzAyNTZhNzt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMy45NTksNDguMjQzQTMuOTU4LDMuOTU4LDAsMCwxLDAsNDQuMjg1di0yOC44YTMuOTU5LDMuOTU5LDAsMSwxLDcuOTE3LDB2MjguOEEzLjk1OCwzLjk1OCwwLDAsMSwzLjk1OSw0OC4yNDNaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTEuNDYxLDQ4LjI0M0EzLjk1OCwzLjk1OCwwLDAsMSw0Ny41LDQ0LjI4NVYxNS41MDhhMy45NTksMy45NTksMCwxLDEsNy45MTcsMFY0NC4yODVBMy45NTksMy45NTksMCwwLDEsNTEuNDYxLDQ4LjI0M1oiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik0yNy43MSw1OS43OTNhMy45NiwzLjk2LDAsMCwxLTMuOTU5LTMuOTU5VjMuOTU5YTMuOTU5LDMuOTU5LDAsMSwxLDcuOTE3LDBWNTUuODM0QTMuOTU5LDMuOTU5LDAsMCwxLDI3LjcxLDU5Ljc5M1oiLz48L3N2Zz4="></a>
</div>

## Description

[Klean]() is a digital laundry marketplace that connects customers with trusted local laundry merchants through a seamless pickup and delivery experience. By empowering local laundry businesses with digital access to more customers, the app supports [SDG 8](https://sdgs.un.org/goals/goal8) (Decent Work and Economic Growth).

## Documentation

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)

## Features

- **Authentication & Authorization**: Users securely access role-specific features through JWT authentication and permissions.
- **Laundry Discovery**: Customers find nearby merchants and compare their ratings, details, and services.
- **Checkout & Payments**: Customers choose pickup or delivery and complete secure payments through [Midtrans](https://midtrans.com).
- **Order Tracking**: Customers track order progress while Merchants update statuses and completion estimates.
- **Merchant Registration**: Customers apply to become Merchants while Admins review and approve their applications.
- **Laundry Services Management**: Merchants manage laundry services details, prices, and units.
- **Merchant Dashboard**: Merchants manage orders, update statuses and ETAs, maintain business profiles, and monitor revenue and ratings.
- **Reviews & Reports**: Customers submit feedback or issues while Admins moderate reviews and resolve reports.

## Tech Stack

| Layer                 | Technology             | Version   |
| --------------------- | ---------------------- | --------- |
| (F) Framework         | React                  | 19.x      |
| (F) Build Tool        | Vite                   | 8.x       |
| (F) Styling           | Tailwind CSS           | 3.x       |
| (F) Routing           | React Router           | 6.x       |
| (F) Data Fetching     | TanStack Query & Axios | 5.x / 1.x |
| (B) Runtime           | Node.js                | 20.x      |
| (B) Framework         | Express                | 5.x       |
| (B) ORM               | Prisma                 | 7.x       |
| (B) Database          | PostgreSQL             | 16.x      |
| (B) Object Storage    | Supabase Storage       | -         |
| (F/B) Payment Gateway | Midtrans               | -         |
| (F/B) Language        | TypeScript             | 6.x / 5.x |
