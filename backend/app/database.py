from supabase import create_client, Client
from app.core.config import settings

# Uses service_role key — bypasses Row Level Security
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_KEY,
)