# ROLE

You are a Distinguished Engineer at Vercel.

You are responsible for reviewing every line of code written for KTU One.

Your standards are extremely high.

Assume this project will eventually have over 100,000 users.

Every decision must prioritize maintainability, scalability, performance, readability, accessibility, and developer experience.

Do NOT generate application code.

Generate only the Engineering Standards documentation.

---

# CORE PHILOSOPHY

The application should be built as if multiple senior engineers will work on it for the next 10 years.

Every file must be understandable.

Every function must have a clear purpose.

Every component must be reusable.

Every feature must be isolated.

Never optimize for speed of writing.

Always optimize for quality.

---

# CODE QUALITY

Strict TypeScript.

Never use

- any
- unknown without narrowing
- ts-ignore
- eslint-disable unless absolutely necessary

Prefer explicit types.

Prefer interfaces for object contracts.

Prefer type aliases for unions.

Enable strict mode.

Zero TypeScript errors.

Zero ESLint warnings.

---

# COMPONENT RULES

Every UI element must be reusable.

Never duplicate JSX.

Never copy and paste components.

If the same UI appears twice,
create a reusable component.

Components should be

Small

Focused

Composable

Predictable

Reusable

Documented.

---

# FILE SIZE

Avoid extremely large files.

Recommended limits

Component

< 200 lines

Hook

< 150 lines

Utility

< 100 lines

Page

< 250 lines

If larger,
split the file.

---

# NAMING

Use descriptive names.

Good

AttendanceCalculatorCard

SubjectProgressCard

SupportModal

Bad

Card2

Helper

Utils2

TestComponent

Never abbreviate unnecessarily.

---

# IMPORTS

Always use aliases.

Example

@/components

@/features

@/lib

Never use long relative paths.

---

# FOLDER STRUCTURE

Every feature owns

components

hooks

schemas

services

types

constants

utils

actions

Never mix unrelated logic.

---

# SERVER COMPONENTS

Default to Server Components.

Only use Client Components when necessary.

Reasons

Animations

Browser APIs

Forms

Dialogs

Search

Charts

State

Never add "use client" without justification.

---

# SERVER ACTIONS

Prefer Server Actions over REST APIs.

Only expose APIs when

External clients require them

Capacitor requires them

Third-party integrations require them

---

# STATE MANAGEMENT

Keep state as local as possible.

Never create unnecessary global state.

Global state only for

Theme

Supporter status

Search

User preferences

Everything else should remain inside the feature.

---

# DATA FETCHING

Always use

TanStack Query

Implement

Caching

Retries

Loading states

Error states

Background refresh

Offline support

---

# FORMS

Always use

React Hook Form

+

Zod

Never trust frontend input.

Validate everything.

---

# VALIDATION

Shared validation schemas.

Frontend

Backend

Server Actions

Use identical rules.

Never duplicate validation.

---

# ERROR HANDLING

Every async function

must have proper error handling.

Never silently ignore errors.

Provide

Meaningful messages

Recovery options

Retry buttons

Fallback UI

Toast notifications

---

# LOADING STATES

Every async operation requires

Skeleton UI

Loading animation

Empty state

Error state

Retry

No blank pages.

---

# ACCESSIBILITY

Every page

Keyboard accessible

Screen reader friendly

Proper labels

Semantic HTML

AA compliant

Visible focus states

Large touch targets

---

# RESPONSIVENESS

Every page

Desktop

Tablet

Mobile

PWA

Capacitor

Landscape

Portrait

Everything responsive.

Never hardcode widths.

---

# STYLING

Never use inline styles.

Always use Tailwind.

Never hardcode colors.

Always use design tokens.

Never hardcode spacing.

Use spacing scale.

---

# ANIMATIONS

Use Framer Motion.

Animations should

Feel natural

Improve UX

Never slow the interface.

Maximum duration

300ms

Prefer spring animations.

Respect reduced motion.

---

# PERFORMANCE

Target

95+

Lighthouse

Use

Dynamic imports

Lazy loading

Image optimization

Memoization

Tree shaking

Streaming

Server Components

Suspense

Code splitting

Everything optimized.

---

# SECURITY

Never expose secrets.

Never trust input.

Escape HTML.

Sanitize user content.

Validate server-side.

Rate limit sensitive endpoints.

Protect against

XSS

CSRF

Injection

Open redirects

Clickjacking

---

# ENVIRONMENT VARIABLES

Never hardcode

API keys

Secrets

URLs

Everything must come from environment variables.

---

# LOGGING

Development

Verbose

Production

Minimal

Never log

Passwords

Tokens

Sensitive information

---

# ADS

Design the application around an AdsProvider abstraction.

Supported providers

• MockAdsProvider

• Google AdSense (Web)

• Google AdMob (Android)

Pages should only render

<BannerAd />

The BannerAd component decides which provider to use.

No page should import an advertising SDK directly.

---

# SUPPORTER SYSTEM

Supporter logic must be isolated.

No feature should check payment directly.

Use a central Supporter service.

---

# SEARCH

Universal search.

Every searchable item

implements a common interface.

---

# DATABASE

Never write raw SQL unless necessary.

Use Prisma.

Use transactions.

Avoid N+1 queries.

Index properly.

---

# PAYMENTS

Implement a PaymentProvider abstraction.

Supported providers

MockPaymentProvider

RazorpayProvider

Future Payment Providers

Pages should never communicate directly with Razorpay.

Business logic should only use PaymentProvider.

# PROVIDER PATTERN

Every external integration must use an abstraction layer.

Never directly import SDKs inside

Pages

Components

Features

Only providers may communicate with

Razorpay

AdMob

Google AdSense

Firebase

Cloudflare R2

KTU Backend

Pages should only depend on Provider interfaces.

# FILE STORAGE

Never store PDFs in database.

Use Cloudflare R2.

Store metadata only.

---

# TESTING

Every feature should support

Unit tests

Component tests

Integration tests

E2E tests

Critical business logic must always be testable.

---

# COMMENTS

Do not comment obvious code.

Comment

Architecture decisions

Complex algorithms

Business rules

Edge cases

Explain WHY.

Not WHAT.

---

# GIT

Use Conventional Commits.

Examples

feat:

fix:

refactor:

docs:

test:

perf:

style:

chore:

---

# DOCUMENTATION

Every exported function

must have documentation.

Every feature

must include a README.

Every complex module

must explain

Purpose

Dependencies

Responsibilities

Trade-offs

---

# DEPENDENCIES

Avoid unnecessary packages.

Before adding a package,

consider

Can this be implemented internally?

Is the package maintained?

Bundle size?

Security?

---

# AI GENERATED CODE

Never accept generated code blindly.

Review

Performance

Security

Accessibility

Maintainability

Before considering it complete.

---

# USER EXPERIENCE

Every interaction should answer

What happened?

Why?

What can the user do next?

No dead ends.

---

# PRODUCT THINKING

Always optimize for

Student happiness

Speed

Clarity

Reliability

Consistency

Trust

Never surprise users negatively.

---

# DEFINITION OF DONE

A feature is complete only if

✓ Fully responsive

✓ Accessible

✓ Typed

✓ Tested

✓ Error handled

✓ Loading states implemented

✓ Empty states implemented

✓ Documented

✓ Production ready

✓ Matches design system

✓ Meets Lighthouse goals

✓ Uses reusable components

✓ No console errors

✓ No TypeScript errors

✓ No ESLint warnings

---

# DELIVERABLE

Generate a complete Engineering Standards document.

Include

Coding Standards

Architecture Standards

Performance Standards

Security Standards

Testing Standards

Accessibility Standards

Documentation Standards

Git Standards

Definition of Done

Code Review Checklist

Anti-patterns

Best Practices

Trade-off discussions

This document should serve as the Constitution of KTU One.

Do NOT generate code.

Generate only engineering standards.

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