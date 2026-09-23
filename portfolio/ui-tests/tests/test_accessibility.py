from playwright.sync_api import Page


def test_skip_link_reaches_main_content(page: Page, site_url: str) -> None:
    page.goto(site_url, wait_until="networkidle")

    page.keyboard.press("Tab")
    page.keyboard.press("Enter")

    assert page.url == f"{site_url}/#main-content"
    assert page.locator("#main-content").is_visible()


def test_images_have_alt_text(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/artifacts", wait_until="networkidle")
    post_url = page.locator(".artifacts-entry__link").last.get_attribute("href")
    assert post_url
    page.goto(f"{site_url}{post_url}", wait_until="networkidle")

    missing_alt = page.locator("img:not([alt]), img[alt='']")
    assert missing_alt.count() == 0


def test_external_links_announce_new_tab(page: Page, site_url: str) -> None:
    page.goto(site_url, wait_until="networkidle")
    external_links = page.locator('a[target="_blank"]')

    assert external_links.count() > 0
    for index in range(external_links.count()):
        label = external_links.nth(index).get_attribute("aria-label")
        assert label and "opens in a new tab" in label
