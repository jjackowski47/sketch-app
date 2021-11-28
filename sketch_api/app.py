import os

from sketch_api.app_factory import create_app


sketch_app = create_app(
    {
        "DEBUG": True,
        "SQLALCHEMY_DATABASE_URI": os.environ["DATABASE_URL"],
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    }
)
