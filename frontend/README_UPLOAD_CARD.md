Files created:
- src/app/upload-card.tsx

Dependencies to add (run in frontend/):
- uuid
- react-datepicker (web only; for now date field is a placeholder)
- react-icons

Run:
cd frontend && npm install uuid react-datepicker react-icons

Notes:
- upload-card.tsx uses a web file input for image selection. For native image picker, integrate Expo ImagePicker or react-native-image-picker later.
- Router calls to non-typed paths are cast to `any` to avoid TypeScript route typing errors for temporary routes.
- To connect to backend, onSave() should POST the created card object to your API endpoint and upload the image (use FormData).
