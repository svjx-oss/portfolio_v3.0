from playwright.sync_api import Page


def test_about_portrait_and_experience_link(page: Page, site_url: str) -> None:
    page.set_viewport_size({"width": 1200, "height": 900})
    page.goto(f"{site_url}/about", wait_until="networkidle")

    portrait = page.locator(".about__image")
    portrait_box = portrait.bounding_box()
    assert portrait.get_attribute("alt")
    assert portrait.evaluate("element => getComputedStyle(element).objectFit") == "cover"
    assert portrait_box and portrait_box["width"] == portrait_box["height"] == 272

    page.get_by_role("link", name="View experience").click()
    assert page.url == f"{site_url}/experience"
    assert page.get_by_role("heading", name="Experience").is_visible()
