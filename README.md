# Kuwait Analytics Hub

A Firebase-authenticated landing portal for existing GitHub Pages dashboards.

## Included files

- `index.html` — login page
- `auth.js` — Firebase email/password login
- `dashboard.html` — dashboard catalogue
- `dashboard.js` — loads Firestore permissions
- `dashboards.js` — the only file you edit to add dashboard links
- `firebase-config.js` — Firebase web configuration
- `style.css` — portal styling

## Upload to GitHub

1. Open the `Kuwait-Analytics-Hub` repository.
2. Choose **Add file → Upload files**.
3. Upload all files from this package.
4. Commit to `main`.
5. Open **Settings → Pages**.
6. Choose **Deploy from a branch**.
7. Select `main` and `/(root)`.
8. Save.

## Firebase setup

### Authentication
Enable **Email/Password** and create each user.

### Firestore
Collection: `users`

Each document ID must be the user's Firebase Authentication UID.

Example admin document:

```text
name: "Dhanya"
email: "your email"
admin: true
```

Example restricted user:

```text
name: "Wholesale User"
email: "person@company.com"
admin: false
wholesale: true
retail: false
corporate: false
```

### Firestore rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null
                  && request.auth.uid == userId;
      allow write: if false;
    }
  }
}
```

### Authorized domain
Under **Authentication → Settings → Authorized domains**, add:

```text
dhanyamambilayil.github.io
```

## Add another dashboard

Edit `dashboards.js`, copy one dashboard object, and update:

- `id`
- `permissionKey`
- `title`
- `description`
- `category`
- `icon`
- `url`

Then add the same `permissionKey` as a Boolean field in the relevant Firestore user documents.

## Important limitation

This version protects the Analytics Hub and controls which links appear. Existing GitHub Pages dashboard URLs remain publicly accessible to anyone who already knows the direct URL.
