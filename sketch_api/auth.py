import re
from typing import List
from flask import Blueprint, jsonify, current_app, Response
from flask.globals import request
from pydantic.networks import EmailStr
from sketch_api.database import User, session_manager

from pydantic import BaseModel, ValidationError, validator


class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str

    @validator("password")
    def password_valid(cls, value):
        if not re.compile(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$").search(value):
            raise ValueError(
                "must be longer than 8 characters, contain at least 1 letter and 1 digit"
            )
        return value


class SignInRequest(CreateUserRequest):
    pass


auth = Blueprint("auth", __name__)


@auth.route("/test")
def index():
    return jsonify(test_api_response="Flask api working correctly yup not!")


@auth.route("/user", methods=["GET"])
def get_users():
    users: List[User] = User.query.all()
    current_app.logger.info(users)
    return jsonify([u.to_dict() for u in users])


@auth.route("/signin", methods=["POST"])
@cross_origin(supports_credentials=True)
def signin_user():
    try:
        request_data = SignInRequest(**request.json)
    except ValidationError as e:
        current_app.logger.error(e)
        return Response(
            e.json(),
            400,
        )
    user: User = User.authenticate(
        email=request_data.email, password=request_data.password
    )

    if not user:
        return Response("Invalid credentials", 401)

    token = jwt.encode(
        {
            "sub": user.email,
            "iat": datetime.now(),
            "exp": datetime.utcnow() + timedelta(minutes=30),
        },
        current_app.config["SECRET_KEY"],
    )
    response = Response(token, content_type="application/json")
    response.set_cookie("session", token, 30, httponly=True)

    return response


@auth.route("/signup", methods=["POST"])
def signup_user():
    try:
        request_data = CreateUserRequest(**request.json)
    except ValidationError as e:
        current_app.logger.error(e)
        return Response(
            {"errors": e.errors},
            400,
        )

    if User.query.filter_by(email=request_data.email).first():
        return Response("User with given email already exists", 400)

    with session_manager() as session:
        user = User(request_data.email, request_data.password)
        session.add(user)
        session.commit()
        if user:
            return jsonify({"user_id": user.id})
        else:
            return Response("An error occurred when adding user", 500)
