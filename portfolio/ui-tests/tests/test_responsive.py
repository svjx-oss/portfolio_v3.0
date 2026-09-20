from playwright.sync_api import Page
from test_things import visit_post_with


def test_about_portrait_reflows_for_mobile(page: Page, site_url: str) -> None:
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(f"{site_url}/about", wait_until="networkidle")

    portrait = page.locator(".about__image")
    style = portrait.evaluate("element => getComputedStyle(element)")
    assert style["float"] == "none"
    assert portrait.bounding_box()["width"] == 192


def test_things_filter_and_code_card_do_not_overflow_mobile(page: Page, site_url: str) -> None:
    page.set_viewport_size({"width": 390, "height": 844})
    visit_post_with(page, site_url, ".things-post__code-block")

    assert page.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth")
    assert page.locator(".things-post__code-block").first.is_visible()
