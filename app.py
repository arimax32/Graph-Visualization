from flask import Flask, render_template, jsonify
from itertools import combinations, groupby
import networkx as nx
import random

app = Flask(__name__)

def generate_graph() : 
    components = 5
    min_component_size,max_component_size = 50,100
    nodes = [random.randint(min_component_size,max_component_size) for _ in range(components)]
    return nx.random_partition_graph(nodes, 0.06, 0.001)

@app.route("/")
def index() : 
    return render_template("index.html")

@app.route("/graph", methods = ["GET"])
def show_graph():
    G = generate_graph()
    graph = {
        "nodes" : list(G.nodes()),
        "edges" : list(G.edges())
    }
    return jsonify(graph)

if __name__ == "__main__":
    app.run(debug=True)
