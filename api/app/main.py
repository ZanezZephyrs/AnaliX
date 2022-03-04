from fastapi import FastAPI

from app.routers import sensitivity

app = FastAPI()


app.include_router(sensitivity.router, tags=["sensitivity"], prefix="/api")

if settings.development:
    app.mount(
        "/static",
        StaticFiles(directory=pkg_resources.resource_filename(__name__, "static")),
        name="static",
    )
    with open("app/static/asset-manifest.json") as manifest:
        app.state.manifest = json.load(manifest)

    @app.get("/manifest.json", include_in_schema=False)
    def manifest():
        return FileResponse(
            pkg_resources.resource_filename(__name__, "static/manifest.json")
        )

    @app.get("/favicon.ico", include_in_schema=False)
    def favicon():
        return FileResponse(
            pkg_resources.resource_filename(__name__, "static/favicon.ico")
        )

    @app.get("/logo.png", include_in_schema=False)
    def logo():
        return FileResponse(
            pkg_resources.resource_filename(
                __name__,
                app.state.manifest["files"]["static/media/neuralmind-logo.png"],
            )
        )

    @app.get("/logo512.png", include_in_schema=False)
    def favicon_512():
        return FileResponse(
            pkg_resources.resource_filename(__name__, "static/logo512.png")
        )

    @app.get("/.*", include_in_schema=False)
    def root():
        return HTMLResponse(
            pkg_resources.resource_string(__name__, "static/index.html")
        )
