import pytest
from playwright.sync_api import Page


def test_artifacts_index_redirects_to_all(page: Page, site_url: str) -> None:
    response = page.goto(f"{site_url}/artifacts", wait_until="networkidle")

    assert response and response.ok
    assert page.url == f"{site_url}/artifacts?type=all"


def test_published_artifacts_posts_render(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/artifacts", wait_until="networkidle")
    post_urls = page.locator(".artifacts-entry__link").evaluate_all(
        "links => links.map(link => link.getAttribute('href'))",
    )

    assert post_urls
    for post_url in post_urls:
        response = page.goto(f"{site_url}{post_url}", wait_until="networkidle")
        assert response and response.ok
        assert page.locator(".artifacts-post h1").count() == 1
        assert page.locator("img:not([alt]), img[alt='']").count() == 0
        has_headings = page.locator(".artifacts-post__prose h1, .artifacts-post__prose h2").count() > 0
        assert page.locator(".artifacts-post__toc").count() == int(has_headings)


def test_artifact_feed_sitemap_and_assets_render(page: Page, site_url: str) -> None:
    for path, content_type in [
        ("/artifacts/feed.xml", "application/rss+xml"),
        ("/sitemap.xml", "application/xml"),
        ("/artifacts/purdue-projects/usb-rtl.png", "image/png"),
    ]:
        response = page.goto(f"{site_url}{path}")

        assert response and response.ok
        assert content_type in response.headers["content-type"]


@pytest.mark.no_console_error_check
def test_removed_things_routes_return_not_found(page: Page, site_url: str) -> None:
    for path in ["/things", "/things/purdue-projects"]:
        response = page.goto(f"{site_url}{path}", wait_until="networkidle")

        assert response and response.status == 404
