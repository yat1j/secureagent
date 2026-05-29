import os
import tempfile
import zipfile

import requests

ALLOWED_EXTENSIONS = (".py", ".js", ".ts", ".jsx", ".tsx", ".php", ".java", ".go", ".rb")
MAX_FILES = 30


def _parse_github_url(url: str) -> tuple[str, str]:
    parts = url.rstrip("/").split("/")
    owner, repo = parts[-2], parts[-1]
    if repo.endswith(".git"):
        repo = repo[:-4]
    if not owner or not repo:
        raise ValueError(f"Invalid GitHub URL: {url}")
    return owner, repo


def _github_headers() -> dict:
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def fetch_github_repo(url: str) -> dict[str, str]:
    """
    Fetch source files from a public GitHub repo via the API and raw.githubusercontent.com.
    Returns {filepath: content} for up to 30 matching files.
    """
    result: dict[str, str] = {}

    try:
        owner, repo = _parse_github_url(url)
    except (ValueError, IndexError):
        return result

    headers = _github_headers()

    try:
        tree_resp = requests.get(
            f"https://api.github.com/repos/{owner}/{repo}/git/trees/HEAD",
            params={"recursive": "1"},
            headers=headers,
            timeout=30,
        )
        tree_resp.raise_for_status()
        tree_data = tree_resp.json()
    except Exception:
        return result

    ref = "main"
    try:
        repo_resp = requests.get(
            f"https://api.github.com/repos/{owner}/{repo}",
            headers=headers,
            timeout=30,
        )
        if repo_resp.status_code == 200:
            ref = repo_resp.json().get("default_branch", "main")
    except Exception:
        pass

    paths: list[str] = []
    for item in tree_data.get("tree", []):
        if item.get("type") != "blob":
            continue
        path = item.get("path", "")
        if not any(path.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS):
            continue
        paths.append(path)
        if len(paths) >= MAX_FILES:
            break

    for path in paths:
        try:
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{ref}/{path}"
            content_resp = requests.get(raw_url, timeout=30)
            if content_resp.status_code == 200:
                result[path] = content_resp.text
        except Exception:
            continue

    return result


def fetch_repo(url: str) -> str:
    """
    Takes a GitHub URL like https://github.com/user/repo
    Downloads the zip, extracts to a temp folder, returns the folder path
    """
    # Convert to zip download URL
    # https://github.com/user/repo → https://github.com/user/repo/archive/refs/heads/main.zip
    parts = url.rstrip("/").split("/")
    user, repo = parts[-2], parts[-1]
    zip_url = f"https://github.com/{user}/{repo}/archive/refs/heads/main.zip"

    response = requests.get(zip_url, stream=True)
    if response.status_code != 200:
        raise Exception(f"Could not download repo: {zip_url}")

    tmp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(tmp_dir, "repo.zip")

    with open(zip_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(tmp_dir)

    # Return extracted folder path (GitHub adds -main suffix)
    extracted = os.path.join(tmp_dir, f"{repo}-main")
    return extracted
