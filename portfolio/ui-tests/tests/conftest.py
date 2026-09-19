import pytest


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption("--host", required=True)
    parser.addoption("--port", required=True)
