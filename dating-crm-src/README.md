# Dating CRM

A minimalist, modern CRM for keeping track of dates — who's who, what you talked
about, their interests, family, friends, food preferences, status, last contact,
upcoming plans, and more.

Built with **React + Vite**. All data is stored **locally in the browser**
(`localStorage`) — nothing is sent anywhere, no account or backend required.

## Features

- **People list** with search (name, interests, notes…), status filters, and
  sorting (recently active, upcoming plans, name, rating, newest).
- **Rich profiles** per person:
  - Status (New → Talking → Dating → Exclusive → Paused → Ended → Ghosted) and a heart rating
  - Where & when you met, location, occupation, contact handles
  - Interests as tags
  - About: hobbies, family, friends
  - Food & drink: likes, dislikes, dietary needs / allergies
  - Green flags / red flags and free-form notes
- **Next plan** highlight with overdue warnings, so you never forget to follow up.
- **Timeline** of every interaction (dates, calls, texts…) you can log in one click.
- **Dashboard stats**: total people, active, and how many need a follow-up.
- Fully responsive and keyboard-friendly.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Notes

- Data lives in your browser under the `dating-crm.people.v1` key. Clearing site
  data will erase it.
- The app seeds a few example people on first run — delete them anytime.
