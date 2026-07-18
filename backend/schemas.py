from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    type: str = Field(..., pattern="^[LMH]$")

    air_temperature: float
    process_temperature: float
    rotational_speed: int
    torque: float
    tool_wear: int

class PredictionResponse(BaseModel):
    prediction: int
    status: str
    probability: float
    risk: str
    recommendation: str
    message: str