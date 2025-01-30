> [!Important]
> The web app is deployed at https://slts-8e29d.web.app

> [!Note]
> This web app was used by 70+ judges concurrently to judge over 750 participants across 36 events, with each it’s unique criteria to grade!

# SLTS 2024

Firebase powered app to view, analyze registrations and judge(grade) participants for different events of SLTS-2024.

- [x] Firebase Auth with email password.
- [x] Dashboard for district wise DEC's and admin.
- [x] Filter by group, event name, district. 
- [x] Search by student id and name.
- [x] Cached Login.
- [x] Data being read from Firestore.
- [x] Deployed using Firebase hosting.
- [x] Dashboards for event judges.
- [x] Judge can grade participants for individual events.
- [x] Admin can view events.
- [x] Admin can view leaderboard of individual events.
- [x] Admin can update the marking criteria of events.
- [x] Dynamic routes were optimized for cost through URL query parameters.
- [x] Admin dashboard, filter by needsPickup, needsDrop, arrivalDate, departureDate, checkInDate, checkOutDate.
- [x] Judge can grade participants for group events.
- [x] Judges can access curated-leaderboard.
- [x] Participants sorted in the judge view list to ensure that any student participating in 2 events gets more priority as the judges might be waiting for the student in other event.
- [x] On the day of actual event, registration desk can mark entry, report any corrections through corrections. Load optimized here by loading only one district data at a time as the participants are expected to arrive in a district-clustered manner.
- [x] Accomodation details well formatted and accessible where data is grouped by arrival time, and district wise count inside each arrival time for precise logistics preparation. 

## Judging (a.k.a Grading)
Mobile View for Judge-related Pages

![judge-phone-mockup](https://github.com/user-attachments/assets/e050a12d-6678-4b5e-a824-56f25732fa22)

## Admin Dashboard
Laptop View for Dashboard Page

![dashboard-laptop-mockup](https://github.com/user-attachments/assets/e7803f44-d240-475f-ae2a-e8b5982e63dc)

## Events Dashboard

![slts-events](https://github.com/user-attachments/assets/134cab0a-3809-4e70-9ba8-26fa0f1506a7)

### Event - Update Criteria

![slts-events-updateCriteria](https://github.com/user-attachments/assets/02e1ab9e-55b7-4220-b477-7e50ec2f434a)

### Event - Leaderboard

![slts-events-leaderboard](https://github.com/user-attachments/assets/7bd964e2-0060-48bd-9b57-c92b10d9e290)

## Accomodations Dashboard

![slts-accommodation](https://github.com/user-attachments/assets/89505ed6-605c-41dc-90e3-126529fb93e6)

## Registration Desk

### Select District
![image](https://github.com/user-attachments/assets/3310b321-e6c1-444a-b874-976d28419a8f)

### Mark Entry/Add comments from Registration Desk
<img width="1407" alt="Screenshot 2024-12-27 at 13 17 33" src="https://github.com/user-attachments/assets/0194f702-1a1d-4a83-bc87-5909e193ec6e" />

![image](https://github.com/user-attachments/assets/d8a7ae80-a617-420d-b09d-8cc579fe25ed)

## Registration Entries/Comments View Live
![slts-live](https://github.com/user-attachments/assets/7a75d378-81c5-4f65-9da9-a3ef400426b5)

# Setup Development

0. Fork the repo and clone the forked repo.
1. Install the latest LTS version of Node.js from https://nodejs.org/en in your machine.
2. Create a new project in [firebase](https://firebase.google.com) console with `Firestore, Email/Password Authentication, Web App` added.
3. Create a `.env` file in the root directory of the project in the below format and enter proper values. The values will be available in firebase console settings of the web app created.

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=""
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
   NEXT_PUBLIC_APP_ID=""
   ```
4. In the root directory, run the below command to install dependencies.
   ```sh
   npm i
   ```
5. In the root directory, to run the app in dev mode, run the below command.
   ```sh
   npm run dev
   ```

# Developers
`Ashwin Narayanan S`
`Gokula Krishnan`
`Vaibav V`
`Hari S K`
`Thilagan Iniyavan`
