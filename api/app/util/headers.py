

def make_openai_header(openai_secret):
    return {
        "Authorization": f"Bearer {openai_secret}"
    }