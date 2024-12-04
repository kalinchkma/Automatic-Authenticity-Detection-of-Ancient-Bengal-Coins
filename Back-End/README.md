# Back-End Service

This brance of folder servers as a back-end service of the application

## Getting Started

First create a `.env` file based on `.env.example` file and give appropriate
variable value and then run following command

```
# First Create virtualenv and run
pip install -r requirements.txt
# run the server
uvicorn main:app --reload
```

after that go to http://localhost:8000/docs to check Back-End api
