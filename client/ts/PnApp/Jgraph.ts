import { DataSet } from 'vis';

interface Node {
  id: number;
}

interface Edge {
  id: string;
  from: number;
  to: number;
  weight: number;
}

interface AdjencyList {

}

export default class Jgraph {
  public adjacencyList: {[key: number]: number[] };
  constructor(nodes: DataSet<Node>, edges: DataSet<Edge>) {
    this.adjacencyList = {};
    nodes.forEach((item, id) => {
      this.adjacencyList[id] = [];
    });
    edges.forEach((item) => {
      this.adjacencyList[item.from].push(item.to);
      this.adjacencyList[item.to].push(item.from);
    });
  }

  public getConnectedNodes(id: number): number[] {
    return this.adjacencyList[id];
  }

  public paintConnectedNodes(id: number): void {
  }
}
