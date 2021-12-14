import jwt
from flask import Blueprint, Response, current_app, jsonify, request
from pydantic import BaseModel
from pydantic.networks import EmailStr
from functools import wraps

from sketch_api.database import User, session_manager
from sketch_api.database.models import Note


class GetUserNotesRequest(BaseModel):
    email: EmailStr
    token: str


notes = Blueprint("notes", __name__)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("x-access-token")
        if not token:
            return "Token is missing", 401

        try:
            data = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            current_user = User.query.filter_by(email=data["sub"]).first()
        except jwt.InvalidTokenError as e:
            current_app.logger.error(e)
            return "Invalid authentication token", 401

        return f(current_user, *args, **kwargs)

    return decorated


@notes.route("/notes", methods=["GET"])
@token_required
def get_user_notes(current_user: User):
    notes = Note.query.filter_by(owner=current_user.id).all()
    notes_list = [note.to_dict() for note in notes]
    return jsonify(notes_list)


@notes.route("/notes", methods=["POST"])
@token_required
def upload_note(current_user: User):
    request_data = request.json

    title = request_data.get("title")
    if not title:
        return "note title is missing in request body", 400
    content = request_data.get("content")
    if not content:
        return "note content is missing in request body", 400

    with session_manager() as session:
        note = Note(title=title, content=content, owner=current_user.id)
        session.add(note)
        session.commit()
        if note:
            return jsonify({"note_id": note.id})
        else:
            return Response("An error occurred when adding note", 500)
