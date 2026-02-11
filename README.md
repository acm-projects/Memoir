<h1 align="center">˖°.✧✒️ Memoir ✒️✧˖°</h1>

<p align="center">
  <img src="" width="300" alt="Handwritten Letter Aesthetic">
</p>

<h2 align="center">✨ Summary</h2>

Memoir is a digital memory preservation and personalized card creation app built to protect the moments that matter most. In a world where meaningful messages get lost in texts and screenshots, Memoir creates a dedicated space to scan, organize, and revisit handwritten cards and letters while also allowing users to design new personalized digital cards with music, animations, and voice notes.

By blending nostalgia with modern AI tools, Memoir preserves the past while helping create new moments worth saving.

---

<h2 align="center">⚙️ Minimum Viable Product (MVP)</h2>

### 1. Camera + OCR Scanning  
- Scan and upload handwritten cards  
- Text extraction using OCR  
- Side-by-side display of scanned image + transcribed text  
- Manual text correction  
- Custom tagging  

### 2. Folder Organization System  
- Automatic AI-powered tagging  
- Sorting by occasion (birthday, graduation, anniversary, etc.)  
- Custom folder names  
- Organized memory library  

### 3. Personalized Card Creation  
- Choose templates  
- Customize fonts, colors, and stickers  
- Drag and drop design features  
- Add music or voice notes  
- Save and send digital cards  

### 4. AI-Powered Smart Search  
- Search by mood, occasion, tags, sender, keywords  
- Vector search across OCR text + user tags  
- Returns both individual cards and folders  

---

<h2 align="center">🎯 Stretch Goals</h2>

- Timeline View → Display cards chronologically  
- Reflections Section → Add personal notes to saved cards  
- Calendar + Reminders → Upcoming birthdays/holidays + reminders to create cards  
- Generative AI Card Designer → Enter an occasion + message, AI designs the card  
- Analytics Dashboard → Spotify Wrapped–style yearly recap  
  - Number of cards saved  
  - Most common occasions  
  - Frequent senders  
  - Emotional trends  

---

<h2 align="center">🗓️ Milestones</h2>

Week 1  
- Finalize tech stack, MVPs, stretch goals  
- Assign roles (frontend, backend, full-stack)  
- Install necessary software  
- Frontend: begin wireframing on Figma  
- Backend: practice authentication flows  

Week 2  
- Frontend: finish wireframes, build login/signup pages  
- Backend: complete authentication and connect with frontend  

Week 3  
- Frontend: build search pages and card storage UI  
- Backend: create database tables and relationships  

Week 4  
- Backend: build REST API endpoints, integrate Expo Camera + OCR  
- Frontend: polish UI and design editor (fonts, colors, drag-and-drop)  

Week 5  
- Backend: integrate OpenAI for tagging + suggestions  
- Frontend: begin presentation prep  

Week 6  
- Backend: refine OCR + integrate vector search  
- Frontend: complete all core pages  

Week 7  
- Attempt stretch goals  
- Finalize presentation  

Week 8  
- Practice presentation  

Week 9  
- Polish presentation and gather feedback  

---

<h2 align="center">💻 Tech Stack</h2>

Wireframing: Figma  
IDE: VSCode  
Version Control: Git  

Frontend: React Native Expo (TypeScript)  
- Cross-platform iOS + Android  
- Component-based architecture  
- Tailwind via NativeWind  

Backend: Supabase  
- PostgreSQL database  
- Built-in authentication  
- Realtime updates  
- Storage  
- Edge Functions  

Database: PostgreSQL (via Supabase)  

AI:  
- Google Cloud Vision API (OCR)  
- OpenAI API (tagging, search, design suggestions)  
- Supabase Vector Search  

Useful APIs:  
- Unsplash API  
- ElevenLabs Voice AI API  
- Spotify API  
- Giphy API  

---

<h2 align="center">⚙️ Software to Install</h2>

- VSCode  
- Git  
- Node.js (optional but recommended: NVM)  
- Postman  
- Expo Go app  

---

<h2 align="center">🚧 Roadblocks</h2>

OCR Quality on Handwritten Cards  
- Handwriting varies in cursive, print, faded ink  
- Solution: show OCR text beside image and allow manual correction  
- Optional preprocessing for improved recognition  

Automatic Tagging Accuracy  
- AI may misinterpret emotion or occasion  
- Suggest tags for user approval instead of auto-assigning  
- Prioritize user tags in vector search  

Drag and Drop Performance  
- Multiple stickers, animations, and gestures may cause lag  
- Use React Native Gesture Handler + Reanimated  
- Limit design elements per card  
- Save card state as JSON instead of rendered images  

---

<h2 align="center">🌱 Inspiration</h2>

I read about elderly families who lost fifty years of handwritten letters and cards in the Palisades fire. It really stuck with me how something so meaningful could disappear overnight.

Almost everyone has a box somewhere filled with birthday cards, letters, and drawings from people they love. Those aren’t just pieces of paper, they hold relationships and moments. But today, most personal messages are reduced to quick texts or screenshots that eventually get lost.

Memoir is meant to preserve old memories while also keeping the act of sending thoughtful, personal messages alive. It’s a place to safely store meaningful cards and letters, and also create new personalized ones, especially when distance makes it hard to show up in person.

---

<h2 align="center">⚔️ Competition</h2>

Photomyne → Scans photos and documents but lacks personalization  
Canva → Great for design but no long-term memory preservation  
Greetings Island → Quick card creation, no memory storage  
Evite → Digital invitations only  
Paperless Post → Digital invites, not memory archiving  

---

<h1 align="center">👥 Meet the Team</h1>

### ⭐ Project Manager
Tamanna Khurana

### ⭐ Team Members
(Coming Soon)
