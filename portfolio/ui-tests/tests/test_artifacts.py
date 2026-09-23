from playwright.sync_api import Page


def visit_post_with(page: Page, site_url: str, selector: str) -> None:
    page.goto(f"{site_url}/artifacts", wait_until="networkidle")
    post_urls = page.locator(".artifacts-entry__link").evaluate_all(
        "links => links.map(link => link.getAttribute('href'))",
    )
    for post_url in post_urls:
        page.goto(f"{site_url}{post_url}", wait_until="networkidle")
        if page.locator(selector).count():
            return
    raise AssertionError(f"No Artifacts post contains {selector}")


def test_artifacts_filter_and_entry_hover(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/artifacts", wait_until="networkidle")

    active_filter = page.locator('.artifacts-filter__option[aria-current="page"]')
    assert active_filter.inner_text() == "All"
    assert active_filter.evaluate("element => getComputedStyle(element).backgroundSize") == "100% 1px"

    entry = page.locator(".artifacts-entry__link").first
    assert entry.locator("xpath=..").get_attribute("data-analytics-context") == "artifacts-entry"
    assert entry.get_attribute("href").startswith("/artifacts/")
    cue = entry.locator(".artifacts-entry__cue")
    cue_style = cue.evaluate("element => getComputedStyle(element)")
    assert cue_style["color"] == "rgb(170, 177, 189)"
    assert cue_style["transform"] == "none"
    assert "transform" in cue_style["transitionProperty"]
    entry.hover()
    page.wait_for_timeout(250)
    hover_style = cue.evaluate("element => getComputedStyle(element)")
    assert hover_style["color"] != cue_style["color"]
    assert hover_style["transform"] != "none"

    filters = page.locator(".artifacts-filter__option")
    assert filters.count() > 1
    non_active_filter = filters.filter(has_not=active_filter).first
    destination = non_active_filter.get_attribute("href")
    assert destination
    page.goto(f"{site_url}{destination}", wait_until="networkidle")
    assert page.locator('.artifacts-filter__option[aria-current="page"]').inner_text() == non_active_filter.inner_text()


def test_artifacts_post_content_images_and_navigation(page: Page, site_url: str) -> None:
    page.goto(f"{site_url}/artifacts", wait_until="networkidle")
    post_url = page.locator(".artifacts-entry__link").first.get_attribute("href")
    assert post_url
    page.goto(f"{site_url}{post_url}", wait_until="networkidle")

    assert page.locator(".artifacts-post h1").is_visible()
    assert page.get_by_role("link", name="Back to Artifacts").get_attribute("href") == "/artifacts"

    image = page.locator(".artifacts-post__prose img").first
    image_box = image.bounding_box()
    prose_box = page.locator(".artifacts-post__prose").bounding_box()
    assert image.is_visible()
    assert image.evaluate("element => element.complete && element.naturalWidth > 0")
    assert image_box and prose_box
    assert image_box["width"] <= prose_box["width"]

    page.get_by_text("On this page").click()
    assert page.locator(".artifacts-post__toc[open]").is_visible()


def test_artifacts_code_block_themes(page: Page, site_url: str) -> None:
    visit_post_with(page, site_url, ".artifacts-post__code-block")

    card = page.locator(".artifacts-post__code-block").first
    header = card.locator(".artifacts-post__code-header")
    assert card.evaluate("element => getComputedStyle(element).backgroundColor") == "rgb(17, 24, 39)"

    page.locator("html").evaluate("element => element.dataset.theme = 'light'")
    assert card.evaluate("element => getComputedStyle(element).backgroundColor") == "rgb(248, 250, 252)"
    assert header.evaluate("element => getComputedStyle(element).backgroundColor") == "rgb(226, 232, 240)"


def test_artifacts_callout_variants(page: Page, site_url: str) -> None:
    visit_post_with(page, site_url, ".artifacts-post__callout")

    callouts = page.locator(".artifacts-post__callout")
    assert callouts.count() > 0
    assert callouts.locator(".artifacts-post__callout-title").count() == callouts.count()

    page.locator("html").evaluate("element => element.dataset.theme = 'light'")
    assert callouts.nth(0).evaluate("element => getComputedStyle(element).backgroundColor") != "rgba(0, 0, 0, 0)"
