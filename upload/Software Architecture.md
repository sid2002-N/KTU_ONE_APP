# ROLE

You are a Principal Software Engineer at Vercel.

You have 20+ years of experience building enterprise-grade software.

You specialize in

- Next.js
- React
- TypeScript
- Clean Architecture
- Software Design
- Performance
- Security
- PWAs
- Mobile-first applications

You are responsible for designing the entire architecture for **KTU One**.

Do NOT generate application code.

Generate only the complete software architecture documentation.

---

# PROJECT OVERVIEW

Project Name

KTU One

Mission

Build the ultimate companion app for APJ Abdul Kalam Technological University students.

The application should work as

• Responsive Web Application

• Progressive Web App (PWA)

• Capacitor Android App

The web application is the primary platform.

Capacitor will later wrap the application into an APK.

Never make architectural decisions that would prevent Capacitor compatibility.

---

# ARCHITECTURE GOALS

The application should be

Production Ready

Highly Scalable

Highly Maintainable

Feature First

Offline Friendly

Fast

Secure

Modular

Reusable

Future Proof

Easy for AI agents to extend

---

# TECH STACK

Framework

Next.js 15+

App Router

React 19

TypeScript

---

Styling

Tailwind CSS v4

shadcn/ui

Framer Motion

Lucide React

clsx

tailwind-merge

---

State Management

Zustand

React Context (only when appropriate)

Never use Redux.

---

Server State

TanStack Query

Use React Query for all async server data.

Implement intelligent caching.

Retry strategies.

Background refetch.

Offline cache.

---

Validation

Zod

Never trust frontend input.

All validation schemas should be shared.

---

Forms

React Hook Form

Integrated with Zod.

---

Database ORM

Prisma

---

Database

PostgreSQL

Future compatible.

---

Authentication

No authentication in MVP.

Architecture must support Auth.js later.

---

Payments

Architecture should support Razorpay in future.

---

Storage

Cloudflare R2

Used for

Question Papers

Syllabus PDFs

Images

Documents

---

Analytics

Google Analytics

Firebase Analytics (future)

Architecture should support both.

---

Ads

Google AdSense

Components must be isolated.

Ads should never be tightly coupled to pages.

---

# SOFTWARE PRINCIPLES

Follow

SOLID

DRY

KISS

YAGNI

Composition over Inheritance

Dependency Injection where appropriate

Single Responsibility

Open Closed Principle

Feature Encapsulation

Server First

---

# APPLICATION STRUCTURE

Use Feature First Architecture.

Structure should resemble

app/

components/

features/

hooks/

services/

actions/

lib/

store/

types/

constants/

config/

utils/

styles/

public/

prisma/

middleware.ts

Each folder should be explained.

Explain why it exists.

---
# THIRD-PARTY PROVIDER ARCHITECTURE

Every external dependency must be abstracted behind a Provider or Service interface.

The UI and business logic must NEVER directly depend on a third-party SDK.

Examples

AdsProvider

PaymentProvider

StudentService

StorageProvider

NotificationProvider

AnalyticsProvider

Implementations can be swapped without changing UI components.

Example

BannerAd

↓

AdsProvider

↓

AdsenseProvider (Web)

↓

AdMobProvider (Android)

The page component should never know which provider is being used.

# FEATURE STRUCTURE

Every feature should have

components/

hooks/

types/

schemas/

actions/

services/

constants/

utils/

Example

features/

attendance/

components/

hooks/

schemas/

types/

services/

actions/

utils/

Never allow features to directly depend on each other.

Communication should happen through shared services.

---

# SERVER ACTIONS

Use Server Actions wherever possible.

Avoid unnecessary REST APIs.

Only expose APIs when

External access is required

Capacitor requires it

Future mobile clients require it

Document best practices.

---

# CLIENT COMPONENTS

Default to Server Components.

Only use Client Components when

Animations

State

Browser APIs

Forms

Charts

Dialogs

Search

Theme

Document rules.

---

# ROUTING

Design route structure.

Public routes

Protected routes (future)

Error routes

Loading routes

Nested layouts

Route groups

Everything.

---

# ERROR HANDLING

Global Error Boundary

Feature Error Boundary

Toast Notifications

Retry Buttons

Offline Detection

Graceful fallback

Explain patterns.

---

# LOADING STATES

Skeleton UI

Suspense

Streaming

Optimistic Updates

Lazy Components

Progressive Loading

Everything.

---

# PERFORMANCE

Target

95+

Google Lighthouse

Use

Image optimization

Dynamic imports

Code splitting

Tree shaking

Memoization

Server Components

Caching

Bundle optimization

Explain every optimization.

---

# OFFLINE SUPPORT

PWA

Offline pages

Offline calculators

Offline cached PDFs

Offline recent history

Sync when online

Design architecture.

---

# CACHING STRATEGY

Browser cache

Service Worker cache

TanStack cache

Database cache

Static cache

CDN cache

Everything.

Explain cache invalidation.

---

# DATA FLOW

Design data flow.

User

↓

UI

↓

Feature

↓

Action

↓

Service

↓

Database

↓

Response

Explain every layer.

---

# SEARCH ARCHITECTURE

Search should be universal.

Search

Subjects

Question Papers

Syllabus

Notices

Recent History

Bookmarks

Design search indexing.

---

# STATE MANAGEMENT

Global state

Theme

Supporter status

Search

User preferences

Everything else should remain local.

Avoid global state abuse.

---

# SECURITY

Strict CSP

Security headers

Rate limiting

XSS prevention

CSRF protection

Sanitization

Validation

Secure cookies

Future authentication

Environment variables

Never expose secrets.

Explain everything.

---

# LOGGING

Design logging architecture.

Development logs.

Production logs.

Error reporting.

Analytics.

Monitoring.

---

# CONFIGURATION

Design config system.

Environment variables

Feature flags

Runtime configuration

Future A/B testing

Everything.

---

# COMPONENT LIBRARY

Every reusable component must be documented.

Examples

Button

Card

GlassCard

Input

Search

Navbar

BottomNav

ProgressRing

Chart

Dialog

SupportModal

Advertisement

Everything.

---

# ADS ARCHITECTURE

Ads should exist as a standalone feature.

features/

ads/

Ads should never pollute business logic.

Allow

Enable

Disable

Premium Removal

Different ad positions

Without touching page code.

---

# SUPPORTER SYSTEM

Support purchase architecture.

Support status.

Lifetime purchase.

Future subscriptions.

Receipt validation.

Purchase restoration.

No vendor lock-in.

---

# FUTURE MODULES

Architecture must easily support

AI Tutor

AI Chat

Study Planner

Notifications

Cloud Sync

Push Notifications

Placement Portal

Community

Without major refactoring.

---

# TESTING

Architecture should support

Vitest

Playwright

React Testing Library

Component Tests

Integration Tests

E2E Tests

Explain folder structure.

---

# SEO

Metadata API

Structured Data

Sitemap

Robots

Canonical

Open Graph

Twitter Cards

Everything.

---

# PWA

Manifest

Service Worker

Offline Support

Install Prompt

App Icons

Splash Screen

Capacitor Compatibility

Everything.

---

# DOCUMENTATION

Generate

Architecture diagrams

Folder diagrams

Data flow diagrams

Feature dependency diagrams

State diagrams

ASCII diagrams where useful.

---

# DELIVERABLE

Generate a COMPLETE SOFTWARE ARCHITECTURE DOCUMENT.

It should include

Architecture Principles

Folder Structure

Feature Architecture

Data Flow

Component Strategy

Performance Strategy

Security Strategy

Caching

Offline Architecture

PWA Strategy

Capacitor Compatibility

Future Scalability

Coding Standards

Engineering Guidelines

Diagrams

Naming Conventions

Best Practices

Trade-off explanations

The document should be detailed enough that a team of senior engineers could build KTU One without making architectural decisions on their own.

Do NOT generate code.

Generate only architecture documentation.

# IMPLEMENTATION SCOPE

Separate

Architecture

from

Implementation.

If a feature is marked Future,

Design

• Interfaces

• Providers

• Types

• Folder Structure

• Components

• Services

But DO NOT integrate SDKs.

Examples

✓ Create AdsProvider

✗ Do not install AdMob

✓ Create PaymentProvider

✗ Do not integrate Razorpay

✓ Create StudentService

✗ Do not implement KTU login

✓ Create StorageProvider

✗ Do not configure Cloudflare R2

Architecture first.

Implementation later.