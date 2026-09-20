from playwright.sync_api import Page


def test_things_filter_and_entry_hover(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/things", wait_until="networkidle")

    active_filter = page.locator('.things-filter__option[aria-current="page"]')
    assert active_filter.inner_text() == "All"
    assert active_filter.evaluate("element => getComputedStyle(element).backgroundSize") == "100% 1px"

    entry = page.locator(".things-entry__link").first
    assert entry.get_attribute("href").startswith("/things/")
    cue = entry.locator(".things-entry__cue")
    cue_style = cue.evaluate("element => getComputedStyle(element)")
    assert cue_style["color"] == "rgb(170, 177, 189)"
    assert cue_style["transform"] == "none"
    assert "transform" in cue_style["transitionProperty"]
    entry.hover()
    page.wait_for_timeout(250)
    hover_style = cue.evaluate("element => getComputedStyle(element)")
    assert hover_style["color"] != cue_style["color"]
    assert hover_style["transform"] != "none"


def test_things_post_content_images_and_navigation(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/things", wait_until="networkidle")
    post_url = page.locator(".things-entry__link").first.get_attribute("href")
    assert post_url
    page.goto(f"{site_url}{post_url}", wait_until="networkidle")

    assert page.locator(".things-post h1").is_visible()
    assert page.get_by_role("link", name="Back to Things").get_attribute("href") == "/things"

    image = page.locator(".things-post__prose img").first
    image_box = image.bounding_box()
    prose_box = page.locator(".things-post__prose").bounding_box()
    assert image.is_visible()
    assert image.evaluate("element => element.complete && element.naturalWidth > 0")
    assert image_box and prose_box
    assert image_box["width"] <= prose_box["width"]

    page.get_by_text("On this page").click()
    assert page.locator(".things-post__toc[open]").is_visible()


def test_things_code_block_themes(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/things", wait_until="networkidle")
    post_url = page.locator(".things-entry__link").last.get_attribute("href")
    assert post_url
    page.goto(f"{site_url}{post_url}", wait_until="networkidle")

    card = page.locator(".things-post__code-block").first
    header = card.locator(".things-post__code-header")
    assert card.evaluate("element => getComputedStyle(element).backgroundColor") == "rgb(17, 24, 39)"

    page.locator("html").evaluate("element => element.dataset.theme = 'light'")
    assert card.evaluate("element => getComputedStyle(element).backgroundColor") == "rgb(248, 250, 252)"
    assert header.evaluate("element => getComputedStyle(element).backgroundColor") == "rgb(226, 232, 240)"


def test_things_callout_variants(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/things", wait_until="networkidle")
    post_url = page.locator(".things-entry__link").last.get_attribute("href")
    assert post_url
    page.goto(f"{site_url}{post_url}", wait_until="networkidle")

    callouts = page.locator(".things-post__callout")
    assert callouts.count() > 0
    assert callouts.locator(".things-post__callout-title").count() == callouts.count()

    page.locator("html").evaluate("element => element.dataset.theme = 'light'")
    assert callouts.nth(0).evaluate("element => getComputedStyle(element).backgroundColor") != "rgba(0, 0, 0, 0)"
