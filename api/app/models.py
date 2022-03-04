
from pydantic import BaseModel


class SensitivityRequestBody(BaseModel):
    text: str

class SensitivityRequestResponse(BaseModel):
    label: str,
    human_readable_label:str
    message: str