from playwright.sync_api import Page


def test_homepage_typography_spacing_and_hover(page: Page, site_url: str) -> None:
    page.goto(site_url, wait_until="networkidle")

    assert page.title() == "Sahil Jaganmohan"

    hero = page.locator(".hero-name")
    assert "Inter" in hero.evaluate("element => getComputedStyle(element).fontFamily")
    assert hero.evaluate("element => getComputedStyle(element).fontWeight") == "700"

    tagline = page.locator(".tagline")
    assert tagline.evaluate("element => getComputedStyle(element).color") == "rgb(197, 202, 211)"
    assert float(tagline.evaluate("element => getComputedStyle(element).marginBottom").removesuffix("px")) >= 16

    link_label = page.locator(".landing-connect__link span:last-child").first
    link_style = link_label.evaluate("element => getComputedStyle(element)")
    assert link_style["backgroundSize"] == "0px 1px"
    assert link_style["color"] == "rgb(197, 202, 211)"
    assert "background-size" in link_style["transitionProperty"]
    link_label.hover()
    page.wait_for_timeout(250)
    hover_style = link_label.evaluate("element => getComputedStyle(element)")
    assert hover_style["backgroundSize"] == "100% 1px"
    assert hover_style["color"] == "rgb(243, 244, 246)"
