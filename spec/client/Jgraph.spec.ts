import Jgraph from '../../client/ts/PnApp/Jgraph';

describe('Jgraph', () => {
  const nodes = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
  ];
  const edges = [
    {
      from: 1,
      to: 2,
      weight: 7,
    },
    {
      from: 1,
      to: 3,
      weight: 9,
    },
    {
      from: 1,
      to: 6,
      weight: 14,
    },
    {
      from: 3,
      to: 6,
      weight: 2,
    },
    {
      from: 3,
      to: 2,
      weight: 10,
    },
    {
      from: 3,
      to: 4,
      weight: 11,
    },
    {
      from: 6,
      to: 5,
      weight: 9,
    },
    {
      from: 5,
      to: 4,
      weight: 6,
    },
    {
      from: 4,
      to: 2,
      weight: 5,
    },
  ];

  let graph: Jgraph;
  beforeAll(() => {
    graph = new Jgraph(nodes, edges);
  });

  test('can return correct shortest path tree.', () => {
    const shortestTree = graph.shortestPathTree(1);
    const answer = [
      { to: 1, from: 2 },
      { to: 1, from: 3 },
      { to: 3, from: 6 },
      { to: 2, from: 4 },
      { to: 4, from: 5 },
    ];
    expect(graph.adjacencyList).toBeDefined();
    expect(graph.edgeList.length).toBe(edges.length * 2);
    expect(shortestTree.edges.length).toBe(5);
    expect(shortestTree.edges).toEqual(answer);
  });
});
