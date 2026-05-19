import networkx as nx
from collections import defaultdict

def build_knowledge_graph(commits):
    """
    Build a code knowledge graph from commit data.
    Files that change together are connected.
    """
    G = nx.Graph()
    
    # Track which files change together
    file_pairs = defaultdict(int)
    file_commit_count = defaultdict(int)
    
    for commit in commits:
        # Get all files changed in this commit
        files = list(commit.stats.files.keys())
        
        # Count how many times each file was changed
        for f in files:
            file_commit_count[f] += 1
            # Add file as a node in the graph
            if not G.has_node(f):
                G.add_node(f, commits=0)
            G.nodes[f]['commits'] = file_commit_count[f]
        
        # Connect files that changed together
        for i in range(len(files)):
            for j in range(i + 1, len(files)):
                pair = tuple(sorted([files[i], files[j]]))
                file_pairs[pair] += 1
    
    # Add edges between files that changed together
    for (file1, file2), count in file_pairs.items():
        if count >= 1:  # Changed together at least once
            G.add_edge(file1, file2, weight=count)
    
    # Convert graph to JSON-friendly format
    nodes = []
    for node in G.nodes():
        nodes.append({
            "id": node,
            "commits": G.nodes[node].get('commits', 0),
            "connections": G.degree(node)
        })
    
    edges = []
    for edge in G.edges(data=True):
        edges.append({
            "source": edge[0],
            "target": edge[1],
            "weight": edge[2].get('weight', 1)
        })
    
    # Get most connected files (hotspots)
    hotspots = sorted(
        nodes,
        key=lambda x: x['connections'],
        reverse=True
    )[:10]
    
    return {
        "nodes": nodes[:50],  # Limit to 50 nodes for performance
        "edges": edges[:100], # Limit to 100 edges
        "hotspots": hotspots,
        "total_files": len(nodes),
        "total_connections": len(edges)
    }