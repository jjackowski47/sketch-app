from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import String, Integer
from werkzeug.security import check_password_hash, generate_password_hash
from uuid import uuid4

db = SQLAlchemy()


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(Integer, primary_key=True)
    title = db.Column(String(255))
    content = db.Column(JSONB)
    owner = db.Column(Integer, ForeignKey("users.id"))
    share_uuid = db.Column(String(50), unique=True)

    def __init__(self, title, content, owner):
        self.title = title
        self.content = content
        self.owner = owner
        self.share_uuid = uuid4()

    def to_dict(self):
        return dict(
            id=self.id,
            title=self.title,
            content=self.content,
            share_uuid=self.share_uuid,
        )


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(Integer, primary_key=True)
    email = db.Column(String(120), unique=True, nullable=False)
    password = db.Column(String(255), nullable=False)
    notes = relationship("Note")

    def __init__(self, email, password):
        self.email = email
        self.password = generate_password_hash(password, method="sha256")

    @classmethod
    def authenticate(cls, **kwargs):
        email = kwargs.get("email")
        password = kwargs.get("password")

        if not email or not password:
            return None

        user = cls.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return None

        return user

    def to_dict(self):
        return dict(id=self.id, email=self.email)
