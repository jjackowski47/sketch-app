from sketch_api.database.models import db, User
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os
from contextlib import contextmanager

engine = create_engine(os.getenv("DATABASE_URL"))
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
