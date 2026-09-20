from playwright.sync_api import Page


def test_published_things_posts_render(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/things", wait_until="networkidle")
    post_urls = page.locator(".things-entry__link").evaluate_all(
        "links => links.map(link => link.getAttribute('href'))",
    )

    assert post_urls
    for post_url in post_urls:
        response = page.goto(f"{site_url}{post_url}", wait_until="networkidle")
        assert response and response.ok
        assert page.locator(".things-post h1").count() == 1
        assert page.locator("img:not([alt]), img[alt='']").count() == 0
        has_headings = page.locator(".things-post__prose h1, .things-post__prose h2").count() > 0
        assert page.locator(".things-post__toc").count() == int(has_headings)
