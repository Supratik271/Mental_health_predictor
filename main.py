import joblib
import pandas as pd
from typing import Literal
import traceback
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from pydantic import BaseModel, Field

model = joblib.load("Mental_health_Model.pkl")
top_counties = [
    "Other", "India", "USA", "Canada", "Australia",
    "UK", "Germany", "Mexico", "Turkey", "France"
]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentData(BaseModel):
    Age: int = Field(..., ge=0, le=120, description="Age of the student (0-120)")
    Gender: Literal["Male", "Female", "Others"] = Field(..., description="Gender of the student")
    Country: str
    Academic_Level: Literal["High School", "Undergraduate", "Graduate"] = Field(..., description="Academic level of the student")
    Most_Used_Platform: Literal["Facebook", "LinkedIn", "Instagram", "Snapchat", "Twitter", "YouTube", "TikTok", "LINE", "KakaoTalk", "VKontakte", "WhatsApp", "WeChat"] = Field(..., description="Most used social media platform")
    Purpose_Of_Use: Literal["Networking", "Entertainment", "Education", "News"] = Field(..., description="Purpose of social media use")
    Avg_Daily_Usage_Hours: float = Field(..., ge=0, le=24, description="Average daily usage hours of social media (0-24)")
    Daily_Unlocks: int = Field(..., ge=0, description="Number of times the phone is unlocked daily")
    Study_Hours: float = Field(..., ge=0, le=24, description="Average study hours per day (0-24)")
    Physical_Activity_Hours: float = Field(..., ge=0, le=24, description="Average physical activity hours per day (0-24)")
    Sleep_Hours_Per_Night: float = Field(..., ge=0, le=24, description="Average sleep hours per night (0-24)")
    Stress_Level: Literal["Low", "Medium", "High", "Very High"] = Field(..., description="Stress level of the student")



# Describe what we send back 
class PredictionResponse(BaseModel):
    predicted_mental_health_score:float 
    





@app.get("/")
def greet():
    return {"Welcome to Spacex"}



@app.post("/predict", response_model=PredictionResponse)
def predict(data: StudentData):
    print("PREDICT FUNCTION CALLED!")
    try:
        country_group = (
            data.Country if data.Country in top_counties else "Other"
        )

        input_row = pd.DataFrame([{
            "Age": data.Age,
            "Gender": data.Gender,
            "Country": country_group,
            "Academic_Level": data.Academic_Level,
            "Most_Used_Platform": data.Most_Used_Platform,
            "Purpose_Of_Use": data.Purpose_Of_Use,
            "Avg_Daily_Usage_Hours": data.Avg_Daily_Usage_Hours,
            "Daily_Unlocks": data.Daily_Unlocks,
            "Study_Hours": data.Study_Hours,
            "Physical_Activity_Hours": data.Physical_Activity_Hours,
            "Sleep_Hours_Per_Night": data.Sleep_Hours_Per_Night,
            "Stress_Level": data.Stress_Level,
            "Grouped_Country": country_group,
        }])

        print("INPUT COLUMNS:", input_row.columns.tolist())
        print("INPUT DATA:", input_row.to_dict(orient="records"))

        prediction = model.predict(input_row)[0]

        return PredictionResponse(
            predicted_mental_health_score=round(float(prediction), 1)
        )

    except Exception:
        traceback.print_exc()
        raise

    
    
    
    
