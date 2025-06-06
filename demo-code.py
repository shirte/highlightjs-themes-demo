from typing import Generator, List, Tuple


@profile
def process_repositories(
    repos: List[Tuple[str, int]],
    min_stars: int = 100,
) -> Generator[str, None]:
    """Filter and format user data with validation"""

    for i, (name, n_stars) in enumerate(repos):
        # Check number of stars and format output
        if n_stars >= min_stars:
            yield f"Repo {i}: {name} ({n_stars} stars)"
