import joblib
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd

model = joblib.load('Mental_health_Model.pkl')

app = FastAPI()

class StudentData(BaseModel):
    Age                     : int
    Gender                  : str
    Country                 : str
    Academic_Level          : str
    Most_Used_Platform      : str
    Purpose_Of_Use          : str
    Avg_Daily_Usage_Hours   : float
    Daily_Unlocks           : int
    Study_Hours             : float
    Physical_Activity_Hours : float
    Sleep_Hours_Per_Night   : float
    Stress_Level            : float




@app.get('/')
def greet():
    return {'Welcome to Spacex '}

top_counties = ['Other','India','USA','Canada','Australia',
'UK','Germany','Mexico','Turkey','France']

@app.post('/predict')
def predict(data: StudentData):

    country_group = data.country if data.country in top_counties else "Other"

    input_row = pd.DataFrame([{
        
        'Age': data.Age,
        'Gender': data.Gender,
        'Country': country_group,
        'Academic_Level': data.Academic_Level,
        'Most_Used_Platform': data.Most_Used_Platform,
        'Purpose_Of_Use': data.Purpose_Of_Use,
        'Avg_Daily_Usage_Hours': data.Avg_Daily_Usage_Hours,
        'Daily_Unlocks': data.Daily_Unlocks,
        'Study_Hours': data.Study_Hours,
        'Physical_Activity_Hours': data.Physical_Activity_Hours,
        'Sleep_Hours_Per_Night': data.Sleep_Hours_Per_Night,
        'Stress_Level': data.Stress_Level,
        'Grouped_country' : country_group
    }])
    
    
    
