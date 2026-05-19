from datetime import datetime
from collections import defaultdict

def calculate_health_metrics(commits, repo):
    """
    Calculate repository health metrics
    """
    if not commits:
        return {}

    # ---- 1. Commit Frequency ----
    daily_commits = defaultdict(int)
    weekly_commits = defaultdict(int)
    author_commits = defaultdict(int)

    for commit in commits:
        date = datetime.fromtimestamp(commit.committed_date)
        day = date.strftime("%Y-%m-%d")
        week = date.strftime("%Y-W%W")
        daily_commits[day] += 1
        weekly_commits[week] += 1
        author_commits[commit.author.name] += 1

    total_commits = len(commits)
    total_authors = len(author_commits)

    # ---- 2. Bus Factor ----
    # Bus factor = how many people own 80% of commits
    sorted_authors = sorted(
        author_commits.values(),
        reverse=True
    )
    cumulative = 0
    bus_factor = 0
    target = total_commits * 0.8

    for count in sorted_authors:
        cumulative += count
        bus_factor += 1
        if cumulative >= target:
            break

    # ---- 3. Activity Score (0-100) ----
    days_with_commits = len(daily_commits)
    activity_score = min(100, int((days_with_commits / 30) * 100))

    # ---- 4. Collaboration Score (0-100) ----
    collaboration_score = min(100, total_authors * 10)

    # ---- 5. Commit consistency ----
    commit_counts = list(daily_commits.values())
    avg_commits_per_day = (
        sum(commit_counts) / len(commit_counts)
        if commit_counts else 0
    )

    # ---- 6. Overall Health Score ----
    health_score = int(
        (activity_score * 0.4) +
        (collaboration_score * 0.3) +
        (min(100, bus_factor * 20) * 0.3)
    )

    # ---- 7. Weekly activity for chart ----
    weekly_data = [
        {"week": k, "commits": v}
        for k, v in sorted(weekly_commits.items())
    ][-12:]  # Last 12 weeks

    return {
        "health_score": health_score,
        "activity_score": activity_score,
        "collaboration_score": collaboration_score,
        "bus_factor": bus_factor,
        "total_commits": total_commits,
        "total_authors": total_authors,
        "avg_commits_per_day": round(avg_commits_per_day, 2),
        "weekly_activity": weekly_data,
        "author_breakdown": [
            {"name": k, "commits": v}
            for k, v in sorted(
                author_commits.items(),
                key=lambda x: x[1],
                reverse=True
            )
        ][:10]
    }