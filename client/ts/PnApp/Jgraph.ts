interface Node {
  id: number;
  name?: string;
}

interface Edge {
  from: number;
  to: number;
  weight?: number;
}

export class JgraphNode {
  public id: number;
  public name?: string;
  public edges: JgraphEdge[];
  constructor(id: number, name?: string) {
    this.id = id;
    if (name) {
      this.name = name;
    }
    this.edges = [];
  }

  get connectedNodes(): number[] {
    return this.edges.map((edge) => edge.to);
  }

  get weight(): number {
    return this.edges.reduce((prev, current) => {
      return prev + current.weight;
    }, 0);
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
  private _length: number;

  /**
   * The function will return a set of nodes which are included in all graphs.
   * @param {boolean} set The argument decide return value type. If set is set to true
   * the function will return a set of string, else return a string array.
   */
  public static union(set = true, ...graphs: Jgraph[]): Set<string> | string[] {
    const baseNodeSet = new Set<string>();
    for (const graph of graphs) {
      for (const key in graph.adjacencyList) {
        if (!baseNodeSet.has(graph.adjacencyList[key].name as string)) {
          baseNodeSet.add(graph.adjacencyList[key].name as string);
        }
      }
    }
    if (set) return baseNodeSet;
    return Array.from(baseNodeSet);
  }

  /**
   * The function will return the intersection nodes of all graphs.
   * @param {boolean} set The argument decide return value type. If set is set to true
   * the function will return a set of string, else return a string array.
   */
  public static intersection(set = true, ...graphs: Jgraph[]): Set<string> | string[] {
    const intersection = graphs
      .map((graph) => {
        const nodesSet = new Set<string>();
        for (const key in graph.adjacencyList) {
          if (!nodesSet.has(graph.adjacencyList[key].name as string)) {
            nodesSet.add(graph.adjacencyList[key].name as string);
          }
        }
        return nodesSet;
      })
      .reduce((currentSet, newSet) => {
        currentSet.forEach((name) => {
          if (!newSet.has(name)) {
            currentSet.delete(name);
          }
        });
        return currentSet;
      });
    if (set) {
      return intersection;
    }
    return Array.from(intersection);
  }

  /**
   * The function will return a set of node that is only in base graph,
   * but not in other graph.
   * @param {Jgraph} baseGraph The base graph.
   * @param {boolean} set The argument decide return value type. If set is set to true
   * the function will return a set of string, else return a string array.
   */
  public static reverseComplement(
    baseGraph: Jgraph,
    set = true,
    ...graphs: Jgraph[]
  ): Set<string> | string[] {
    const baseNodeSet = new Set<string>();
    for (const key in baseGraph.adjacencyList) {
      baseNodeSet.add(baseGraph.adjacencyList[key].name as string);
    }
    for (const graph of graphs) {
      for (const key in graph.adjacencyList) {
        if (baseNodeSet.has(graph.adjacencyList[key].name as string)) {
          baseNodeSet.delete(graph.adjacencyList[key].name as string);
        }
      }
    }
    if (set) {
      return baseNodeSet;
    }
    return Array.from(baseNodeSet);
  }

  constructor(nodes: Node[], edges: Edge[]) {
    this.adjacencyList = {};
    this._length = 0;
    for (const node of nodes) {
      const newNode = new JgraphNode(node.id, node.name);
      this.adjacencyList[node.id] = newNode;
      this._length++;
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

  get length() {
    return this._length;
  }

  // return the ids nodes which connect to given node id.
  public getConnectedNodes(id: number): number[] {
    return this.adjacencyList[id].connectedNodes;
  }

  public getNode(id: number): JgraphNode {
    return this.adjacencyList[id];
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

  public union(set = true, ...graphs: Jgraph[]): Set<string> | string[] {
    return Jgraph.union(set, this, ...graphs);
  }

  public intersection(set = true, ...graphs: Jgraph[]): Set<string> | string[] {
    return Jgraph.intersection(set, this, ...graphs);
  }

  public reverseComplement(set = true, ...graphs: Jgraph[]): Set<string> | string[] {
    return Jgraph.reverseComplement(this, set, ...graphs);
  }
}
