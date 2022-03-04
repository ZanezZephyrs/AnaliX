from pydantic import BaseSettings


class Settings(BaseSettings):
    development:bool=True
    openai_api_key:str=""
    openai_endpoint:str=""

    class Config:
        env_file = ".env"


settings = Settings()
