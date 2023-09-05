window.onload = (e) => {
    /* Sample graph lookes like
    const graph = {
        nodes : [
            {name: "Aman", severity : 4},
            {name: "Balwir", severity : 2},
            {name: "Chatter", severity : 3},
            {name: "Datta", severity : 6},
            {name: "Emerson", severity : 3},
            {name: "Falcon", severity : 5},
            {name: "Gramhan", severity : 4},
        ],
        links : [
            {source: "Aman", target :"Balwir", weight : 3},
            {source: "Aman", target :"Chatter", weight : 4},
            {source: "Datta", target :"Balwir", weight : 3},
            {source: "Aman", target :"Balwir", weight : 3},
            {source: "Emerson", target :"Falcon", weight : 5},
            {source: "Falcon", target :"Gramhan", weight : 4},
            {source: "Emerson", target :"Gramhan", weight : 2},
        ]
    }
    */
    fetch("/graph")
    .then(res => res.json())
    .then(data => visualize(convert_graph(data)))
}

const convert_graph = (data) => {
    return {
        nodes : data.nodes.map(node => ({name : node, severity : Math.floor(1 + Math.random() * 6)})),
        links : data.edges.map(edge => ({source : edge[0], target : edge[1], weight : Math.floor(1 + Math.random() * 6)}))
    }
}

const visualize = (graph) => {
    // Set the position attributes of links and nodes each time the simulation ticks.
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).id(d => d.name).distance(() => 30))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("x", d3.forceX())
        .force("y", d3.forceY());


    // Create the SVG container.
    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Add a line for each link, and a circle for each node.
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", d => d.weight);

    const graphContainer = svg.append("g")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)

    const node = graphContainer
        .append("ellipse")
        .attr("rx", 10)
        .attr("ry",8)
        .attr("fill",d => color(d.severity));

    const label = graphContainer
        .append("text")
        .attr("stroke", "green")
        .attr("font-weight", 100)
        .attr("font-size", '15px')
        .text(d => d.name)

    // Add a drag behavior.
    graphContainer.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
        graphContainer
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    });

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(d) {
        if (!d.active) simulation.alphaTarget(0.3).restart();
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(d) {
        if (!d.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}
