import git
import os
import shutil
import stat
from datetime import datetime
from collections import defaultdict
from graph import build_knowledge_graph
from health import calculate_health_metrics

def force_remove(path):
    def handle_error(func, path, exc_info):
        os.chmod(path, stat.S_IWRITE)
        func(path)
    if os.path.exists(path):
        shutil.rmtree(path, onexc=handle_error)

def clone_repo(repo_url: str, clone_path: str = "./temp_repo"):
    force_remove(clone_path)
    print(f"Cloning {repo_url}...")
    repo = git.Repo.clone_from(
        repo_url,
        clone_path,
        depth=50,
        no_single_branch=True
    )
    print("Clone complete!")
    return repo

def analyze_commits(repo_url: str):
    clone_path = "./temp_repo"
    repo = clone_repo(repo_url, clone_path)

    commits = list(repo.iter_commits(max_count=50))
    print(f"Found {len(commits)} commits")

    commit_data = []
    author_stats = defaultdict(int)
    daily_commits = defaultdict(int)

    for commit in commits:
        date = datetime.fromtimestamp(commit.committed_date)
        date_str = date.strftime("%Y-%m-%d")
        author = commit.author.name
        author_stats[author] += 1
        daily_commits[date_str] += 1

        commit_data.append({
            "hash": commit.hexsha[:7],
            "message": commit.message.strip()[:100],
            "author": author,
            "date": date_str,
            "files_changed": len(commit.stats.files)
        })

    # Build knowledge graph
    print("Building knowledge graph...")
    graph_data = build_knowledge_graph(commits)

    # Calculate health metrics
    print("Calculating health metrics...")
    health_data = calculate_health_metrics(commits, repo)

    summary = {
        "total_commits": len(commits),
        "total_authors": len(author_stats),
        "top_contributors": sorted(
            [{"name": k, "commits": v}
             for k, v in author_stats.items()],
            key=lambda x: x["commits"],
            reverse=True
        )[:10],
        "daily_activity": [
            {"date": k, "commits": v}
            for k, v in sorted(daily_commits.items())
        ][-30:],
        "recent_commits": commit_data[:10],
        "graph": graph_data,
        "health": health_data
    }

    return summary