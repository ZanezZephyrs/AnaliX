
import requests

from fastapi.responses import JSONResponse
from fastapi import APIRouter, Request
from app.models import SensitivityRequestBody,SensitivityRequestResponse
from app.settings import settings
from app.util.headers import make_openai_header

router = APIRouter()
@router.post("/sensitivity")
def get_sensitivity(request:Request, body:SensitivityRequestBody):
    text=body.text
    req_header=make_openai_header(settings.openai_api_key)

    req_body={
        "prompt": f"<|endoftext|>{text}\n--\nLabel:",
        "temperature": 0, 
        "max_tokens": 1, 
        "top_p": 0, 
        "logprobs": 10
    }

    response=requests.post(settings.openai_endpoint, headers=req_header, json=req_body)

    if response.status_code != 200:
        return JSONResponse(
            status_code=503,
            content={
                "message": f"sorry, we could not classify the message at this moment, please try again later"
            }
        )

    assigned_label=response.json()["choices"][0]["text"]

    if assigned_label == "0":
        message="the content was judged safe"
        human_label="safe"
    elif assigned_label == "1":
        message="the content was judged sensitive, it may disccuss a delicate subject and should be handled carefully"
        human_label="sensitive"
    elif assigned_label == "2":
        message="the content was judged unsafe, it may contain inappropriate language, offensive statements, among other things "
        human_label="unsafe"
    else:
        message="the content could not be classified, this usually means that the content treats something that the model could not handle, be careful"
        human_label="unknown"

    return SensitivityRequestResponse(
        message=message,
        human_readable_label=human_label,
        label=assigned_label
    )
    


    


