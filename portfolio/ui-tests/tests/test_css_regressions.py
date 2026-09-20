from playwright.sync_api import Page
from test_things import visit_post_with


def test_things_post_surfaces_fit_desktop_and_mobile(page: Page, site_url: str) -> None:
    for width, height in [(1200, 900), (390, 844)]:
        page.set_viewport_size({"width": width, "height": height})
        visit_post_with(page, site_url, ".things-post__code-block")

        assert page.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth")
        for selector in [
            ".things-post__back",
            ".things-post__toc",
            ".things-post__code-block",
            ".things-post__callout",
            ".site-footer",
        ]:
            element = page.locator(selector).first
            box = element.bounding_box()
            assert element.is_visible()
            assert box and box["width"] <= width


def test_things_post_theme_surfaces_change_without_losing_layout(
    page: Page,
    site_url: str,
) -> None:
    page.set_viewport_size({"width": 1200, "height": 900})
    visit_post_with(page, site_url, ".things-post__code-block")

    code_card = page.locator(".things-post__code-block").first
    dark_background = code_card.evaluate("element => getComputedStyle(element).backgroundColor")
    page.get_by_role("button", name="Switch to light theme").click()
    light_background = code_card.evaluate("element => getComputedStyle(element).backgroundColor")

    assert page.locator("html").get_attribute("data-theme") == "light"
    assert light_background != dark_background
    assert page.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth")
    assert code_card.is_visible()
    assert page.locator(".things-post__callout").first.is_visible()


def test_shared_prose_stays_within_main_content(page: Page, site_url: str) -> None:
    page.set_viewport_size({"width": 390, "height": 844})

    for route in ["/", "/about", "/experience"]:
        page.goto(f"{site_url}{route}", wait_until="networkidle")
        prose = page.locator(".prose").first
        prose_box = prose.bounding_box()
        main_box = page.locator(".site-main").bounding_box()

        assert prose.is_visible()
        assert prose_box and main_box
        assert prose_box["width"] <= main_box["width"]
        assert page.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth")
