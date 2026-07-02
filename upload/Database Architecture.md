# ROLE

You are a Principal Database Architect from Google.

You have designed databases serving over 500 million users.

Your expertise includes

- PostgreSQL
- Prisma ORM
- Data Modeling
- Normalization
- Performance
- Scalability
- Security
- Caching

Your task is NOT to generate application code.

Generate the complete database architecture for **KTU One**.

The architecture must support the MVP while being scalable enough for future AI features, student sync, analytics, payments, and community modules.

---

# PROJECT

Project Name

KTU One

Mission

Create the ultimate digital companion for APJ Abdul Kalam Technological University students.

---

# DATABASE GOALS

The database should be

Scalable

Secure

Maintainable

Normalized

Fast

Readable

Future-proof

Easy for AI agents to extend

Optimized for Prisma ORM

---

# DATABASE

Database Engine

PostgreSQL

ORM

Prisma

Database Hosting

Supabase PostgreSQL

---

# FILE STORAGE

Never store PDFs or images in the database.

Use Cloudflare R2.

Database stores only metadata.

Examples

Question Paper URL

Syllabus URL

Thumbnail URL

Document Size

Mime Type

Checksum

---

# DESIGN PRINCIPLES

Follow

Third Normal Form

Clear Naming

UUID Primary Keys

Created At

Updated At

Soft Delete where appropriate

Indexes

Unique Constraints

Foreign Keys

Transactions

Optimistic Concurrency

Everything documented.

---

# MVP MODULES

Design database models for

Student

Supporter Purchase

Question Papers

Subjects

Branches

Semesters

Syllabus

Academic Calendar

KTU Notices

Calculator History

Saved Papers

Bookmarks

Recent Activity

App Settings

Search Index

Feedback

App Version

Everything.

---

# STUDENT MODEL

Student data originates from an external backend API.

The local database should only store

• Support Status

• Preferences

• Bookmarks

• Calculator History

• Offline Cache

• Settings

Never permanently store

• KTU Passwords

• Authentication Tokens

• Academic Records unless explicitly cached.

---

# SUBJECT MODEL

Subject Code

Subject Name

Semester

Branch

Credits

Elective

Lab Theory

Everything.

---

# SEMESTER MODEL

Semester Number

Branch

Academic Year

Credits

Relationships

Everything.

---

# QUESTION PAPER MODEL

Year

Month

Exam Type

Semester

Branch

Subject

File URL

File Size

Downloads

Views

Uploaded At

Indexes

Search Fields

Everything.

---

# SYLLABUS MODEL

Semester

Branch

Subject

Version

PDF URL

Last Updated

Searchable

Everything.

---

# NOTICE MODEL

Title

Description

Category

Published Date

Priority

PDF URL

External URL

Tags

Pinned

Active

Everything.

---

# CALENDAR MODEL

Event Name

Event Type

Start Date

End Date

Color

Description

Reminder Enabled

Everything.

---

# CALCULATOR HISTORY

Calculator Type

Input JSON

Output JSON

Created At

Allow future cloud sync.

---

# BOOKMARKS

Student

Question Paper

Syllabus

Subject

Created At

---

# RECENT ACTIVITY

Last Opened

Last Viewed Paper

Last Calculator

Recent Search

Everything.

---

# SETTINGS

Dark Mode

Theme

Language

Notifications

Supporter Status

Everything.

---

# SUPPORTER PURCHASE

Support Type

Lifetime

Purchase Date

Transaction ID

Payment Provider

Payment Status

Receipt URL

Restore Purchase

Everything.

Future compatible with

Razorpay

Google Play Billing

Apple In-App Purchase

---

# SEARCH

Design a universal search table.

Support

Subjects

Question Papers

Syllabus

Notices

Recent History

Bookmarks

Future AI Search

---

# ANALYTICS

Future ready.

Track

Downloads

Views

Searches

Calculator Usage

Popular Subjects

Popular Papers

Feature Usage

Anonymous by default.

---

# FUTURE TABLES

Reserve architecture for

AI Chat

AI Tutor

Study Plans

Notifications

Placement

Community

Achievements

Badges

Cloud Sync

Without redesigning the schema.

---

# INDEXES

Explain every required index.

Primary Keys

Unique

Composite

Search

Performance

Everything.

---

# RELATIONSHIPS

Generate complete ER diagrams.

Show

One-to-One

One-to-Many

Many-to-Many

Everything.

ASCII diagrams are acceptable.

---

# PRISMA

Design schema compatible with Prisma ORM.

Use

Enums

Relations

Cascade Rules

Defaults

Indexes

Mapped Fields

Naming Conventions

Everything.

---

# PERFORMANCE

Explain

Indexes

Pagination

Cursor Pagination

Caching

Query Optimization

Batch Queries

Transactions

Connection Pooling

Everything.

---

# SECURITY

Never store passwords.

Encrypt sensitive information.

Protect payment data.

GDPR friendly.

Future ready.

Audit fields.

Soft delete.

Data retention.

Everything.

---

# MIGRATIONS

Design migration strategy.

Seed Data.

Versioning.

Rollback.

Production deployments.

Everything.

---

# SEED DATA

Generate realistic seed strategy.

Branches

Semesters

Subjects

Academic Calendar

Sample Notices

Sample Question Papers

Everything.

---

# DELIVERABLE

Generate a complete Database Architecture document.

Include

Database Philosophy

Naming Standards

All Models

All Relationships

Indexes

ER Diagrams

Prisma Design

Migration Strategy

Performance Strategy

Security Strategy

Future Expansion Strategy

Best Practices

Trade-offs

Do NOT generate application code.

Generate only database documentation.

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