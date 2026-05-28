import requests
import os
import zipfile
import tempfile

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
