import pytest
from playwright.sync_api import Page


def test_homepage_loads(page: Page, pytestconfig: pytest.Config) -> None:
    host = pytestconfig.getoption("host")
    port = pytestconfig.getoption("port")
    page.goto(f"http://{host}:{port}", wait_until="networkidle")

    assert page.title() == "Sahil Jaganmohan"
