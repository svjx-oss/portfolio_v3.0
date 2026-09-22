import pytest
from playwright.sync_api import Page
from typing import Generator


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption("--host", required=True)
    parser.addoption("--port", required=True)


@pytest.fixture
def site_url(pytestconfig: pytest.Config) -> str:
    host = pytestconfig.getoption("host")
    port = pytestconfig.getoption("port")
    return f"http://{host}:{port}"


@pytest.fixture(autouse=True)
def fail_on_console_errors(page: Page) -> Generator[None, None, None]:
    errors: list[str] = []
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)

    yield

    assert not errors, "Browser console errors:\n" + "\n".join(errors)
