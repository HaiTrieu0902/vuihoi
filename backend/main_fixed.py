"""
Fixed main.py for Windows Playwright compatibility
"""
import asyncio
import sys

if sys.platform == "win32":
    # Use ProactorEventLoop on Windows to fix Playwright issues
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

import uvicorn
from api.main import app

if __name__ == "__main__":
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        loop="asyncio"
    )