<h1 align="center">˖°.✧✒️ Memoir ✒️✧˖°</h1>

<p align="center">
  <img src="[https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif](https://y.yarn.co/70f7a135-e0a0-4b41-bd70-bbb8d0e8e8f9_text.gif)" width="300" alt="Handwritten Letter Aesthetic">
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
- Sorting by occasion  
- Custom folder names  
- Organized memory library  

### 3. Personalized Card Creation  
- Choose templates  
- Customize fonts, colors, stickers  
- Drag-and-drop design features  
- Add music or voice notes  
- Save and send digital cards  

### 4. AI-Powered Smart Search  
- Search by mood, occasion, tags, sender, keywords  
- Vector search across OCR text + user tags  
- Returns both individual cards and folders  

---

<h2 align="center">🎯 Stretch Goals</h2>

- Timeline View → Display cards chronologically  
- Reflections Section → Add personal notes  
- Calendar + Reminders → Upcoming events + reminders  
- Generative AI Card Designer → AI designs card from prompt  
- Analytics Dashboard → Spotify Wrapped–style yearly recap  

---

<h2 align="center">🗓️ Milestones</h2>

Week 1  
- Finalize tech stack  
- Assign roles  
- Install software  
- Frontend wireframing (Figma)  
- Backend auth practice  

Week 2  
- Login / Signup pages  
- Connect authentication  

Week 3  
- Search UI + card storage  
- Database schema design  

Week 4  
- REST APIs  
- Integrate Expo Camera + OCR  
- UI polish  

Week 5  
- OpenAI tagging integration  
- Presentation prep  

Week 6  
- Refine OCR  
- Integrate vector search  

Week 7  
- Attempt stretch goals  

Week 8  
- Practice presentation  

Week 9  
- Final polish  

---

<h2 align="center">💻 Tech Stack</h2>

**Wireframing:** Figma  
**IDE:** VSCode  
**Version Control:** Git  

**Frontend:** React Native Expo (TypeScript)  
- Tailwind via NativeWind  

**Backend:** Supabase  
- PostgreSQL  
- Authentication  
- Storage  
- Edge Functions  

**AI:**  
- Google Cloud Vision API  
- OpenAI API  
- Supabase Vector Search  

---

<h2 align="center">⚙️ Software to Install</h2>

- [VSCode](https://code.visualstudio.com/download)  
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) → [Quick Guide](https://rogerdudler.github.io/git-guide/)  
- [Node.js](https://nodejs.org/en) (Optional: [NVM](https://github.com/nvm-sh/nvm))  
- [Postman](https://www.postman.com/downloads/)  
- Expo Go app (mobile)

---

<h2 align="center">📚 Documentation</h2>

**Core Stack**
- [React Native Docs](https://reactnative.dev/docs/getting-started)  
- [Expo Docs](https://docs.expo.dev/)  
- [Supabase Docs](https://supabase.com/docs)  
- [PostgreSQL Docs](https://www.postgresql.org/docs/)  

**Styling + UI**
- [NativeWind Docs](https://www.nativewind.dev/)  
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)  
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)  
- [React Native Skia](https://shopify.github.io/react-native-skia/)  

**Camera + OCR**
- [Expo Camera Docs](https://docs.expo.dev/versions/latest/sdk/camera/)  
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)  
- [Open Source OCR Tools Guide](https://unstract.com/blog/best-opensource-ocr-tools-in-2025/)  

**AI + Search**
- [OpenAI API Docs](https://platform.openai.com/docs)  
- [Supabase Vector Search](https://supabase.com/docs/guides/ai/vector-columns)  

---

<h2 align="center">🎥 Tutorials</h2>

**Full Stack Setup**
- [React Native + Supabase Full Stack Tutorial](https://www.youtube.com/watch?v=kyphLGnSz6Q)  
- [TikTok Clone with React Native + Supabase](https://www.youtube.com/watch?v=hV6Lc6zePrU)  

**Authentication**
- [Supabase Auth Tutorial](https://www.youtube.com/watch?v=AE7dKIKMJy4)  
- [React Native Login/Signup](https://www.youtube.com/watch?v=M8u_w6_o584)  

**Camera + Image Upload**
- [React Native Image Uploading](https://www.youtube.com/watch?v=uX5E_QFJubU)  
- [Snapchat Clone with Expo Camera](https://www.youtube.com/watch?v=Cw08RqFel6I)  

**Drag & Drop + Design**
- [Gesture Handler for Stickers](https://www.youtube.com/watch?v=yBuhnVDXekQ)  
- [Drawing with React Native Skia](https://www.youtube.com/watch?v=EHxEX78alZE)  

**Backend + APIs**
- [Intro to APIs](https://www.youtube.com/watch?v=WXsD0ZgxjRw)  
- [REST APIs Explained](https://www.youtube.com/watch?v=-0exw-9YJBo)  
- [Designing a Database](https://www.youtube.com/watch?v=ztHopE5Wnpc)  
- [Supabase Database Course](https://www.youtube.com/watch?v=4yVSwHO5QHU)  

---

<h2 align="center">🚧 Roadblocks</h2>

OCR Quality on Handwritten Cards  
- Handwriting varies widely  
- Solution: show OCR text beside image + allow manual edits  

Automatic Tagging Accuracy  
- AI may misinterpret emotion  
- Suggest tags for approval instead of auto-assign  

Drag and Drop Performance  
- Too many animations may lag  
- Use Gesture Handler + Reanimated  
- Save card state as JSON  

---

<h2 align="center">🌱 Inspiration</h2>

I read about elderly families who lost fifty years of handwritten letters and memories in the Palisades fire. It made me realize how fragile meaningful memories can be.

Almost everyone has a box filled with birthday cards and handwritten notes. They hold moments, not just words. But today, personal messages are reduced to texts and screenshots that disappear over time.

Memoir is meant to preserve those old memories while also encouraging people to continue creating thoughtful ones.

---

<h2 align="center">⚔️ Competition</h2>

- Photomyne  
- Canva  
- Greetings Island  
- Evite  
- Paperless Post  

---

<h1 align="center">👥 Meet the Team</h1>

### ⭐ Project Manager
Tamanna Khurana

### ⭐ Industry Mentor
Umaymah Sultana

### ⭐ Team Members
1. Jiya Khurana
2. Tejasvi Annamaraju
3. Harleen Gill
4. Kasish Jain
