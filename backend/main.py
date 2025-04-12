from fastapi import FastAPI, BackgroundTasks
import uvicorn
from backend.test.app import run_growjo_scraper, run_growthlist_scraper

app = FastAPI(title="Scraper API", version="1.0")

@app.get("/run-growjo-scraper", status_code=202)
async def growjo_scraper(background_tasks: BackgroundTasks):
    """
    Endpoint to start the Growjo Scraper.
    """
    background_tasks.add_task(run_growjo_scraper)
    return {"message": "Growjo Scraper has been started."}

@app.get("/run-growthlist-scraper", status_code=202)
async def growthlist_scraper(background_tasks: BackgroundTasks):
    """
    Endpoint to start the GrowthList Scraper.
    """
    background_tasks.add_task(run_growthlist_scraper)
    return {"message": "GrowthList Scraper has been started."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)