import pytest


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption("--host", required=True)
    parser.addoption("--port", required=True)


@pytest.fixture
def site_url(pytestconfig: pytest.Config) -> str:
    host = pytestconfig.getoption("host")
    port = pytestconfig.getoption("port")
    return f"http://{host}:{port}"
