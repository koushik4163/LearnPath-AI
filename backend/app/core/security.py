import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
import os

# Initialize Firebase Admin SDK only once
if not firebase_admin._apps:
    cred_path = settings.FIREBASE_CREDENTIALS_PATH
    if not os.path.exists(cred_path):
        raise RuntimeError(
            f"Firebase service account JSON not found at: {cred_path}\n"
            "Download it from Firebase Console → Project Settings → "
            "Service Accounts → Generate new private key"
        )
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

bearer_scheme = HTTPBearer()

def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
) -> dict:
    """Verify Firebase ID token sent from frontend."""
    token = credentials.credentials
    try:
        decoded = firebase_auth.verify_id_token(token)
        return decoded
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Firebase token"
        )