import os


def get_supabase_config() -> tuple[str | None, str | None, str]:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    table = os.getenv("SUPABASE_TABLE", "tasks")
    return url, key, table


def get_json_path() -> str:
    base_dir = os.path.dirname(os.path.dirname(__file__))
    return os.path.join(base_dir, "data", "tasks.json")
