FROM python:3.10.0-alpine
WORKDIR /sketch_api
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
# ENV DATABASE_URL= <fill with database connection URL>
# ENV APP_SECRET_KEY= <fill with random generated secret string (e.g. base64)>
RUN apk update && apk add --no-cache postgresql-dev gcc python3-dev musl-dev linux-headers
RUN apk add build-base
RUN pip install psycopg2-binary
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY /sketch_api /sketch_api
CMD ["flask", "run"]