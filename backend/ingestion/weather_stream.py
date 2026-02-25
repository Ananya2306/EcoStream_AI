# ingestion/rss_stream.py

import pathway as pw
import feedparser
import time
from datetime import datetime

RSS_URL = "https://news.google.com/rss/search?q=air+pollution+India"

def generate_news():
    """Fetches RSS news periodically"""
    while True:
        feed = feedparser.parse(RSS_URL)
        for entry in feed.entries[:5]:
            yield {
                "title": entry.title,
                "summary": entry.get("summary", ""),
                "published": datetime.utcnow()
            }
        time.sleep(60)

def rss_stream():
    schema = pw.Schema.from_columns(
        title=str,
        summary=str,
        published=pw.DateTimeUtc
    )

    return pw.io.python.read(
        generate_news,
        schema=schema,
        autocommit_duration_ms=2000
    )