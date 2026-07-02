# KTU One — Play Store Publishing Checklist

Everything needed to take the signed AAB to production. Items marked **[you]**
require your Google Play Developer account (pending); the rest are prepared in
this repo.

---

## 1. Build the release artifact

Prereqs: Android Studio + SDK (installed at `%LOCALAPPDATA%\Android\Sdk`), JDK 21.

```bash
# 1. Set the live backend origin the app will call.
#    Edit .env → CAP_API_BASE_URL=https://<your-domain>

# 2. Produce the static web bundle (out/).
bun run cap:build

# 3. Copy web assets into the native project + install plugins.
bun run cap:sync            # cap sync android

# 4. Build the signed release bundle.
cd android && ./gradlew bundleRelease
#   → android/app/build/outputs/bundle/release/app-release.aab

# (debug APK for on-device testing)
./gradlew assembleDebug
#   → android/app/build/outputs/apk/debug/app-debug.apk
```

## 2. Signing (one-time)

```bash
keytool -genkeypair -v -keystore ktuone-upload.keystore \
  -alias ktuone -keyalg RSA -keysize 2048 -validity 10000
```

- Store `ktuone-upload.keystore` somewhere safe and **backed up** (losing it
  means you can't push updates unless enrolled in Play App Signing key reset).
- Create `android/keystore.properties` (gitignored):

  ```properties
  storeFile=../../ktuone-upload.keystore
  storePassword=********
  keyAlias=ktuone
  keyPassword=********
  ```

- `android/app/build.gradle` reads it for `signingConfigs.release` (wired during
  Phase 5). Enable **Play App Signing** when creating the app in Console —
  Google holds the app signing key; you upload with this upload key.

## 3. App identity

| Field | Value |
|---|---|
| Application ID | `com.ktuone.app` |
| App name | KTU One |
| versionCode | `1` (increment every upload) |
| versionName | `1.0.0` |
| Min SDK | 23 (Capacitor default) |
| Target SDK | latest required by Play (34+) |

## 4. Store listing assets

- [x] App icon — generated from `public/logo.svg` via `bun run cap:assets`
      (source: `assets/icon-only.png`, 1024×1024).
- [ ] **512×512** hi-res icon PNG (Console field).
- [ ] **1024×500** feature graphic.
- [ ] Phone screenshots (≥2, up to 8) — reuse `download/ktu-one-v3-*.png`
      (dashboard, calculators, search, dark). Confirm ≥320px, 16:9 or 9:16.
- [ ] Short description (≤80 chars), e.g.
      *"KTU results, CGPA/SGPA calculators, question papers & notices — one app."*
- [ ] Full description (≤4000 chars) — see `store/listing.md` (draft).

## 5. Policy & compliance **[you]**

- [ ] **Privacy policy URL** — host `store/privacy-policy.md` at a public URL
      (e.g. `https://<domain>/privacy`) and paste it in Console. **Required**
      because the app handles KTU register number + academic results.
- [ ] **Data safety form** — declare:
  - Collected: *KTU register number* (account/identifier), *academic results/CGPA*
    (personal info). Purpose: **App functionality**. Not shared with third
    parties. Not sold. Encrypted in transit (HTTPS). User can request deletion
    (logout revokes tokens; add a deletion contact).
  - Razorpay processes payments — declare *financial info* handled by the payment
    processor (not stored by the app).
- [ ] Content rating questionnaire → likely **Everyone**.
- [ ] Target audience: 18+ / university students (avoid "designed for children").
- [ ] App category: **Education**.
- [ ] Ads declaration: **Yes** (banner ads present, unless supporter).

## 6. Release track

1. **[you]** Create app in Play Console (needs Developer account, $25).
2. Upload `app-release.aab` to **Internal testing** first.
3. Add testers, install via the opt-in link, run the smoke test (section 7).
4. Promote to **Closed → Open → Production** once verified.

## 7. On-device smoke test (before promoting)

- [ ] App opens to the dashboard (no blank/white screen).
- [ ] Login with KTU credentials succeeds; profile, results, CGPA load
      (confirms CapacitorHttp cookie flow + `CROSS_SITE_COOKIES=true` on backend).
- [ ] Calculators compute offline; history persists.
- [ ] Papers / syllabus / calendar / notices render.
- [ ] Bookmarks + calc history sync when logged in.
- [ ] Airplane mode → no crash; reconnect → data loads.
- [ ] Razorpay supporter purchase completes and returns to the app.

## 8. Backend prerequisites (must be deployed first)

- [ ] `CROSS_SITE_COOKIES=true` set on the deployment serving the mobile app.
- [ ] New public GET routes live: `/api/v1/{calendar,timetable,notices,papers}`,
      `/api/v1/dashboard/stats`, `/api/v1/events/upcoming`.
- [ ] Backend reachable over **HTTPS** at `CAP_API_BASE_URL`.
