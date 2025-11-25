import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.mark.unit
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

@pytest.mark.unit
def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "api_docs" in response.json()

@pytest.mark.unit
def test_validate_email():
    from app.utils.validators import InputValidator
    assert InputValidator.validate_email("test@example.com")
    assert not InputValidator.validate_email("invalid-email")

@pytest.mark.unit
def test_text_normalization():
    from app.utils.text_normalizer import TextNormalizer
    result = TextNormalizer.normalize("  HELLO   WORLD  ")
    assert result == "hello world"

@pytest.mark.integration
def test_job_search():
    response = client.post(
        "/api/v1/jobs/search",
        json={"query": "developer", "limit": 5}
    )
    assert response.status_code in [200, 503]  # 503 if API unavailable

@pytest.mark.unit
def test_invalid_file_type():
    from app.utils.validators import InputValidator
    assert not InputValidator.validate_file_type("document.doc")
    assert InputValidator.validate_file_type("cv.pdf")