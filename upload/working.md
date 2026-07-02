**Project Overview**

This repository is the KTU APP API — an Express-based Node.js service that scrapes student details from the KTU website, caches results in Redis, and fetches/publishes university notifications to Redis, Slack and Firebase.

**Quick facts**
- Entry point: `src/index.js`
- Main app: `src/core/app.js`
- Routes: `src/routes/index.js`
- Jobs (cron): `src/jobs/` — scheduled notification fetch
- Key utilities: `src/utils/*` (parsing, redis helpers, notifications)
- Tests: `tests/notification.test.js` (Jest)

**Environment / Requirements**
- Node 8+ (project uses `babel-node` in dev)
- Redis server accessible from `REDIS_HOST:REDIS_PORT`
- Firebase service account at `config/firebase.json` and `FIREBASE_DB_URL`
- Optional Slack token + channel for notifications

Create a `.env` file in project root with these variables (examples from README):

PORT=3000
NODE_ENV=development
REDIS_PORT=6379
REDIS_HOST=host.docker.internal
IMAGE_PATH=    # filesystem path used to save profile images (local folder)
IMAGE_URL=     # public URL prefix for profile images (served elsewhere)
API_KEY=       # key used by `validateRequest` middleware
FIREBASE_DB_URL=
SLACK_TOKEN=
SLACK_CHANNEL=

Also add `config/firebase.json` (Firebase service account) — the repo expects it at that path.

**NPM scripts** (see `package.json`)
- `npm start` — runs `babel-node src/index.js` (development style)
- `npm run dev` — runs `nodemon` with `babel-node`
- `npm test` — runs Jest tests
- `npm run build` and `npm run serve` — compile to `dist/` and run

**How the app is structured / flows**

1) Server startup (`src/index.js`)
   - Loads `.env`, imports `app` and `startJobs`.
   - Calls `startJobs()` (starts cron tasks) and starts Express on `PORT`.

2) Express app (`src/core/app.js`)
   - Configures `body-parser` and `cors` and mounts router from `src/routes/index.js`.

3) Routes (`src/routes/index.js`)
   - `GET /` — health check returning { status: 'working' }
   - `POST /api/v1/data` — protected by `validateRequest` middleware; calls `getStudentDetails` controller. Body must include `key` (API key), `userid`, and `password`.
   - `GET /api/v1/notifications` — returns saved notifications from Redis.

4) Student details flow (`src/controllers/studentDetails.js` + `src/utils/parseData.js`)
   - `getStudentDetails` does:
     - Build `user = { id: userid, password }` from request body.
     - Check Redis cache via `getUserRedis(user)` (key is md5 of id+password).
     - If cached, return JSON from Redis.
     - Otherwise: `getDetailsFromWebsite(user)` which:
         - Fetches CSRF token from `https://app.ktu.edu.in/login.jsp` (cookies with `request.jar`).
         - Posts credentials with CSRF token to login endpoint and follows redirects.
         - Requests `https://app.ktu.edu.in/eu/stu/studentDetailsView.htm` to get student HTML.
         - Calls `parseData` to extract fields and grades.
         - `parseData` saves a profile image by piping the image response to `IMAGE_PATH/proimg/{userid}.jpg` and sets `proimg` field to `IMAGE_URL + userid + '.jpg'` (so you must host those images where `IMAGE_URL` points).
         - The parsed object is stored in Redis for 24 hours (`setUserRedis`) and returned to the client.

Notes on scraping: the implementation uses `request`, `request-promise`, and `cheerio`. If the KTU site changes layout or CSRF flow, parsing will fail.

5) Notifications flow (cron job)
   - `src/jobs/index.js` schedules `src/jobs/notification.js` using `node-cron` at `0 3,6,9,12 * * *` (runs at minutes 0 of hours 3,6,9,12 daily).
   - The job fetches `https://ktu.edu.in/eu/core/announcements.htm`, parses the first few `<td>` cells using `parseNotifications` in `src/utils/notifications.js`.
   - `parseNotifications` builds a list of notification objects with `date`, `heading`, `key` (slugified heading), and `data`.
   - `saveNotifications` (in `src/utils/redis.js`) compares incoming notifications to existing saved ones in a Redis list `notifications`. New ones are pushed (RPUSH) and `sendNewNotifications` is called to:
       - Post messages to Slack (`src/core/slack.js`) using `@slack/web-api`.
       - Send Firebase Cloud Messaging messages via `src/core/firebase.js` (`admin.messaging().send(...)`) after transforming with `cleanNotificationForFirebase`.

6) Redis usage
   - A Redis client is created in `src/core/redis.js`. The code relies on `getAsync` and `lrangeAsync` promisified helpers.
   - User cache key: `user/<md5(id+password)>` (expires in 24 hours).
   - Notifications are stored in list `notifications` and retrieved with `lrange`.

**Important files quickmap**
- `src/index.js` — app bootstrap
- `src/core/app.js` — express app
- `src/core/redis.js` — redis client
- `src/core/firebase.js` — firebase messaging integration (uses `config/firebase.json`)
- `src/core/slack.js` — posts to Slack channel using `SLACK_TOKEN` and `SLACK_CHANNEL`
- `src/routes/index.js` — routes
- `src/middleware/index.js` — `validateRequest` checks body.key === `API_KEY`
- `src/controllers/studentDetails.js` — scraping + caching
- `src/controllers/notifications.js` — GET notifications
- `src/jobs/notification.js` — cron job fetching/processing notifications
- `src/utils/parseData.js` — HTML parsing of studentDetails and saving images
- `src/utils/notifications.js` — parsing and cleaning notifications, building messages
- `src/utils/redis.js` — helper wrappers around redis operations

**API usage examples**
- Health check:

  curl http://localhost:3000/

- Fetch student details (POST):

  curl -X POST http://localhost:3000/api/v1/data \
    -H 'Content-Type: application/json' \
    -d '{"key":"YOUR_API_KEY","userid":"<roll>","password":"<password>"}'

- Get saved notifications:

  curl http://localhost:3000/api/v1/notifications

**Run locally**
1. Install dependencies:

```
npm install
```

2. Create `.env` and `config/firebase.json` as described above.

3. Start Redis (or point `REDIS_HOST`/`REDIS_PORT` to a running instance).

4. Start app:

```
npm start
```

Or for development with auto-reload:

```
npm run dev
```

**Tests**
- Run `npm test`. The repo includes `tests/notification.test.js` which verifies `cleanNotificationForFirebase`.

**Troubleshooting & Notes**
- If scraping fails, inspect the selectors used in `parseData` and `parseNotifications` — the KTU site markup may have changed.
- Ensure `IMAGE_PATH/proimg` exists and is writable by the process or image writes will fail silently.
- Firebase errors will be logged; ensure `config/firebase.json` is valid and `FIREBASE_DB_URL` set.
- Slack will fail if `SLACK_TOKEN` or `SLACK_CHANNEL` are not set.

**Next steps / Improvements**
- Add proper error responses for endpoints instead of generic 403.
- Add CI and linting hooks. Replace deprecated `request`/`request-promise` (they are deprecated) with modern libraries like `node-fetch` or `axios` and maintain cookie support.
- Add pagination or size limits to the Redis `notifications` list and a pruning strategy.

---
Generated by developer review — file: working.md