import os
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from sketch_api.database.models import User, db

engine = create_engine(os.getenv("DATABASE_URL"), pool_pre_ping=True)
Session = sessionmaker(bind=engine)


@contextmanager
def session_manager():
    session = Session()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


__all__ = ["db", "User", "Session"]
