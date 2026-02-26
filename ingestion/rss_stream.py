import feedparser
import asyncio

RSS_URL = "https://news.google.com/rss/search?q=air+pollution+india"

async def fetch_rss():
    """
    Fetch latest RSS headlines.
    Returns list of dicts.
    """
    feed = feedparser.parse(RSS_URL)

    articles = []
    for entry in feed.entries[:5]:
        articles.append({
            "title": entry.title,
            "link": entry.link
        })

    return articles


async def rss_stream_loop(update_callback):
    """
    Continuously fetch RSS every 30 seconds
    and push to streaming state.
    """
    while True:
        articles = await fetch_rss()

        update_callback(articles)

        print("RSS Updated:", len(articles), "articles")

        await asyncio.sleep(30)