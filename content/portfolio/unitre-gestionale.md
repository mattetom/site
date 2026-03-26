---
title: Gestionale UNITRE
date: 2026-03-26T10:00:00+00:00
draft: false
thumbnail: images/portfolio/unitre-dashboard.png
hideMainImage: true
service: Full-Stack Web Application, SaaS Platform Design
client: UNITRE Tradate
screenshots:
  - images/portfolio/unitre-dashboard.png
  - images/portfolio/unitre-corsi.png
  - images/portfolio/unitre-iscrizione.png
  - images/portfolio/unitre-news.png
  - images/portfolio/unitre-notifiche.png
  - images/portfolio/unitre-audit.png
  - images/portfolio/unitre-documenti.png
shortDescription: A comprehensive management platform built for Università della Terza Età (University of the Third Age) — handling members, courses, enrollments, trips, payments, notifications, and document generation. Designed for UNITRE Tradate, architected to serve any association or institution that delivers courses and manages subscriptions.
challenge: Running a University of the Third Age involves juggling member registrations, course scheduling across dozens of subjects, trip organization, payment tracking, PDF document generation, and multi-channel communications — all managed through a legacy Microsoft Access database, spreadsheets, and paper forms that couldn't synchronize between online services and in-person office operations.
solution: I designed and built a unified web platform that digitizes the entire association lifecycle — from public course catalog and self-service enrollment, through back-office management with role-based access, to automated notifications, PDF generation, and audit logging. The architecture is multi-tenant ready, so other UNITRE branches or similar organizations can adopt it with minimal configuration.
---

This project started from a real operational need: UNITRE Tradate — a cultural association offering 100+ courses per academic year to hundreds of members — was running its operation on a legacy Microsoft Access application, paper forms, and Excel sheets — a fragmented setup where the Access database couldn't synchronize with online services, forcing staff to duplicate work between the in-person office and the web. The goal was not just digitization, but building a platform that could be adopted by any organization with a similar model: courses, enrollments, membership fees, and communications.

## Project goals

- Replace all paper-based and spreadsheet-driven workflows with a single, integrated web platform.
- Enable members to browse courses, enroll online, manage their profile, and receive notifications autonomously.
- Give staff and directors a powerful back-office with role-specific access and real-time visibility into enrollments, payments, and attendance.
- Design the data model and architecture to be reusable — any UNITRE branch, adult education center, or course-based association should be able to run on this system.
- Generate all official documents (receipts, attendance sheets, membership forms, course registers) as PDFs directly from the platform.

## Platform scope

The system covers the full lifecycle of an academic year:

**Public area** — Course catalog with category filters and search, trip listings, shopping cart with multi-item checkout, member self-registration, news and announcements, location directory with maps.

**Member portal** — Personal dashboard with enrolled courses and trips, calendar view, payment history, downloadable receipts, notification preferences, push notifications via Firebase Cloud Messaging.

**Management area** — Academic year configuration, full course CRUD with scheduling and teacher assignment, member directory, order and payment management, waitlist handling, trip administration, news and notification broadcasting, Google Contacts synchronization, audit log with complete change history, printer integration for attendance sheets.

**Document engine** — Serverless PDF generation (Puppeteer + Chromium) for attendance registers, course booklets, membership cards, receipt PDFs, and liability waivers — all generated on-demand with live data.

## Technical and product decisions

- **Next.js App Router with Server Actions** as the backbone — server-side rendering for performance, progressive enhancement for forms, and a clean data flow from Zod validation through Prisma to the database.
- **Role-based access control** with six distinct roles (Admin, Managing Director, Course Director, Trips Director, Services Director, Volunteer, Student) — each role sees only what it needs.
- **Shopping cart with real-time availability** — members can add courses and trips, check seat availability, choose between in-person and remote attendance, and register companions for trips.
- **Multi-channel communications** — Firebase Cloud Messaging for push notifications, MailerSend for transactional emails, Mailchimp for marketing campaigns, with per-member notification preferences.
- **Google Contacts API integration** — automatic synchronization of members into contact groups organized by academic year, course, and trip, keeping the association's contact directory always up to date.
- **Full audit trail** — every data change is logged with old/new values, user identity, and timestamp, ensuring accountability and regulatory compliance.
- **Italian-first UX** — all interfaces, validation messages, date formats (dd/MM/yyyy), and document templates are natively in Italian.

## Architecture for reusability

The platform was built with multi-tenancy in mind from day one:

- The data model is organized around generic concepts — `AcademicYear`, `Course`, `CourseCategory`, `MemberProfile`, `Order`, `Enrollment` — that apply to any course-based organization, not just UNITRE.
- Configuration is environment-driven: academic year structure, payment methods, notification channels, and branding can be adapted without code changes.
- The enrollment engine supports multiple delivery modes (in-person, remote, hybrid), variable course frequencies, waitlist management, and companion registration — covering use cases from language schools to cultural associations to senior universities.
- PDF templates are parameterized and can be customized per organization.

Any UNITRE branch, adult education association, or institution that manages courses, subscriptions, and member communications could adopt this platform as-is or with minimal adaptation.

## Tech stack

- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Server Actions, Prisma ORM
- **Database:** MySQL (Aiven)
- **Auth:** NextAuth.js v5 with JWT sessions and role-based middleware
- **Storage:** Vercel Blob for files and images
- **PDF:** Puppeteer + @sparticuz/chromium (serverless), pdf-lib for merging
- **Notifications:** Firebase Cloud Messaging, MailerSend, Mailchimp
- **Integrations:** Google Contacts API, QZ Tray (direct printing)
- **Hosting:** Vercel with cron jobs, analytics, and speed insights

## Why this project matters

This is not a toy CRUD app — it is a production system used daily by staff and hundreds of members to run a real organization. It demonstrates end-to-end product thinking: understanding operational workflows, designing a data model that captures real-world complexity (waitlists, companions, multi-role access, academic year cycles), building a polished member-facing experience alongside a powerful back-office, and engineering for reliability with audit logging and serverless PDF generation.

More importantly, it was designed as a platform, not a one-off. The same system that manages UNITRE Tradate today could manage any association tomorrow — and that architectural foresight is what turns a project into a product.
