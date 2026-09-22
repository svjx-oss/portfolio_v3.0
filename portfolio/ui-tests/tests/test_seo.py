import pytest
from playwright.sync_api import Page


@pytest.mark.parametrize(
    ("path", "title"),
    [
        ("/", "Home | Sahil Jaganmohan"),
        ("/about", "About | Sahil Jaganmohan"),
        ("/experience", "Experience | Sahil Jaganmohan"),
        ("/things", "Things | Sahil Jaganmohan"),
    ],
)
def test_static_page_titles(page: Page, site_url: str, path: str, title: str) -> None:
    page.goto(f"{site_url}{path}", wait_until="networkidle")

    assert page.title() == title


def test_things_post_share_metadata(page: Page, site_url: str) -> None:
    path = "/things/purdue-projects"
    title = "Purdue Projects: Hardware, Firmware, and Data Analysis"
    description = (
        "A designed USB SoC peripheral, STM32 embedded game, and a statistical "
        "analysis report."
    )
    page.goto(f"{site_url}{path}", wait_until="networkidle")

    assert page.title() == title
    assert page.locator('meta[name="description"]').get_attribute("content") == description
    assert page.locator('link[rel="canonical"]').get_attribute("href") == (
        f"https://sahiljaganmohan.com{path}"
    )
    assert page.locator('meta[property="og:image"]').get_attribute("content") == (
        "https://sahiljaganmohan.com/og/things/purdue-projects.png"
    )
    assert page.locator('meta[name="twitter:card"]').get_attribute("content") == "summary_large_image"


def test_analytics_bootstrap_is_valid_javascript(page: Page, site_url: str) -> None:
    page.goto(site_url, wait_until="networkidle")

    scripts = page.locator("script:not([src])").all_text_contents()
    assert (
        'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}'
        'gtag("js",new Date());gtag("config","G-N5Q8SBSQYK");'
    ) in scripts
