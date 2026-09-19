from playwright.sync_api import Page


def test_footer_links_and_theme_toggle(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/experience", wait_until="networkidle")

    footer = page.locator(".site-footer")
    assert footer.get_by_role("link", name="Home").get_attribute("href") == "/"
    assert footer.get_by_role("link", name="Things").get_attribute("href") == "/things"

    toggle = footer.get_by_role("button", name="Switch to light theme")
    toggle.click()
    assert page.locator("html").get_attribute("data-theme") == "light"
