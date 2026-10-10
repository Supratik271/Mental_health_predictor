NeuroPulse updates

Frontend: mindscope-ai/ (branding and full multi-page app retained)
- Country is now a dropdown matching the platform selector. Choose Other for countries not listed.
- Gender includes Male, Female, Other.
- Results animate and display one decimal place.

Backend update: backend-main.py
1. Back up your current E:\Mental_health_predictor\main.py.
2. Copy backend-main.py into E:\Mental_health_predictor and rename the copy to main.py, replacing the old main.py only after making a backup.
3. Restart FastAPI.

Important: allowing Gender='Other' in Pydantic does not guarantee the trained model was trained to handle that category. If prediction fails for Other, the preprocessing pipeline needs to support unknown categories or the model needs retraining with suitable data. Do not silently map Other to Male/Female.

Run frontend from the mindscope-ai folder:
npm install
npm run dev

Run backend from E:\Mental_health_predictor:
uvicorn main:app --reload --port 8000
