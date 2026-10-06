from functools import lru_cache

from sqlalchemy import create_engine

from src.utils.constants import DB_URL


@lru_cache(maxsize=1)
def get_engine():
    return create_engine(DB_URL)
