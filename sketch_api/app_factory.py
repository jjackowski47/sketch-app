from logging.config import dictConfig

from flask import Flask
from flask_cors import CORS

from sketch_api.auth import auth
from sketch_api.database import db

dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
            }
        },
        "handlers": {
            "wsgi": {
                "class": "logging.StreamHandler",
                "stream": "ext://flask.logging.wsgi_errors_stream",
                "formatter": "default",
            }
        },
        "root": {"level": "INFO", "handlers": ["wsgi"]},
    }
)


def create_app(config=None):
    app = Flask("sketch_api.app")

    if config:
        app.config.update(config)

    db.init_app(app)
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:8080"}},
        support_credentials=True,
    )

    app.register_blueprint(auth)
    with app.app_context():
        db.create_all()

    return app
