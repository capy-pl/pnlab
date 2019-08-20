interface Node {
  id: number;
  name?: string;
}

interface Edge {
  from: number;
  to: number;
  weight?: number;
}

class JgraphNode {
  public id: number;
  public name?: string;
  public edges: JgraphEdge[];
  constructor(id: number, name?: string) {
    this.id = id;
    if (name) {
      this.name = this.name;
    }
    this.edges = [];
  }

  public getConnectedNodes(): number[] {
    return this.edges.map((edge) => edge.to);
  }
}

class JgraphEdge {
  public from: number;
  public to: number;
  public weight: number;

  constructor(from: number, to: number, weight: number) {
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}

interface ShortestPathReturnedValue {
  previous: Map<number, number>;
  distance?: Map<number, number>;
}

export default class Jgraph {
  public adjacencyList: { [key: number]: JgraphNode };
  public edgeList: JgraphEdge[];
  constructor(nodes: Node[], edges: Edge[]) {
    this.adjacencyList = {};
    for (const node of nodes) {
      const newNode = new JgraphNode(node.id);
      this.adjacencyList[node.id] = newNode;
    }
    this.edgeList = [];
    edges.forEach((edge) => {
      const { from, to, weight } = edge;
      const fromEdge = new JgraphEdge(from, to, weight || 1);
      const toEdge = new JgraphEdge(to, from, weight || 1);
      this.adjacencyList[from].edges.push(fromEdge);
      this.adjacencyList[to].edges.push(toEdge);
      this.edgeList.push(fromEdge);
      this.edgeList.push(toEdge);
    });
  }

  /**
   * The function implement Dijkstra shortest path algorithm.
   * Instead of return the path, we return all edges
   * on the path of the graph.
   *
   * @param {number} id: the start node's id number.
   * @returns {ShortestPathReturnedValue}
   */
  public shortestPathTree(
    id: number,
    returnDistance?: boolean,
  ): ShortestPathReturnedValue {
    if (!(id in this.adjacencyList)) {
      throw new Error('id cannot be found in the list.');
    }
    const inGraph: Set<number> = new Set();
    const distance: Map<number, number> = new Map();
    const previous: Map<number, number> = new Map();
    for (const id in this.adjacencyList) {
      distance.set(parseInt(id), Number.MAX_VALUE);
    }
    distance.set(id, 0);
    let startVertex: JgraphNode | undefined = this.adjacencyList[id];
    while (startVertex !== undefined) {
      inGraph.add(startVertex.id);
      for (const edge of startVertex.edges) {
        const currentDistance = (distance.get(startVertex.id) as number) + edge.weight;
        if (currentDistance < (distance.get(edge.to) as number)) {
          distance.set(edge.to, currentDistance);
          previous.set(edge.to, startVertex.id);
        }
      }

      startVertex = undefined;
      let minimum = Number.MAX_VALUE;
      distance.forEach((distance, id) => {
        if (!inGraph.has(id) && minimum > distance) {
          minimum = distance;
          startVertex = this.adjacencyList[id];
        }
      });
    }

    if (returnDistance) return { previous, distance };
    else return { previous };
  }
}
