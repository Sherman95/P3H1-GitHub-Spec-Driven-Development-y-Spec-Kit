from ..core.config import get_json_path, get_supabase_config
from ..repositories.json_repo import JsonTaskRepository
from ..repositories.supabase_repo import SupabaseTaskRepository


def build_repository():
    url, key, table = get_supabase_config()
    if url and key:
        return SupabaseTaskRepository(url, key, table)
    return JsonTaskRepository(get_json_path())
