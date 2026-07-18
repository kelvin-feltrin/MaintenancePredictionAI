import joblib
import pandas as pd
from fastapi import HTTPException

modelo = joblib.load("modelo_random_forest.pkl")
scaler = joblib.load("scaler.pkl")
features = joblib.load("features.pkl")

numeric = [
        "Air temperature [K]",
        "Process temperature [K]",
        "Rotational speed [rpm]",
        "Torque [Nm]",
        "Tool wear [min]"
    ]

def predict(data):
    try:
        df = pd.DataFrame([{
            "Air temperature [K]": data.air_temperature,
            "Process temperature [K]": data.process_temperature,
            "Rotational speed [rpm]": data.rotational_speed,
            "Torque [Nm]": data.torque,
            "Tool wear [min]": data.tool_wear,
            "Type": data.type
        }])

        df = pd.get_dummies(df, columns=["Type"])

        for col in features:
            if col not in df.columns:
                df[col] = 0

        df = df[features]

        df = df.astype(float)

        df[numeric] = scaler.transform(df[numeric])

        prediction = modelo.predict(df)[0]

        status = "Manutenção Necessária" if prediction else "Sem Necessidade de Manutenção"

        recommendation = (
            "Agendar manutenção preventiva."
            if prediction
            else
            "Continuar monitorando o equipamento."
        )

        probability = modelo.predict_proba(df)[0][1]

        risk = "Alto" if prediction else "Baixo"

        if prediction:
            message = (
                "Foi identificado um risco elevado de falha. "
                "Recomenda-se realizar manutenção preventiva."
            )
        else:
            message = (
                "Não foram identificados indícios de falha. "
                "O equipamento apresenta baixo risco de manutenção."
            )

        return {
            "prediction": int(prediction),
            "status": status,
            "probability": round(float(probability * 100), 2),
            "risk": risk,
            "recommendation": recommendation,
            "message": message
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )