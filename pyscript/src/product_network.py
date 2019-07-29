import json

class ProductNerwork:
    def __init__(self, graph):
        self.graph = graph
        self.communities = self.get_communities()
        self.product_rank = self.get_product_rank(20)
        self.hooks = self.get_hooks()

    def get_product_rank(self, num):
        # The function must come after get_communities, which compute the weight for all vertex.
        items = [node for node in self.graph.vs]
        items.sort(key=lambda x: x['weight'], reverse=True)
        top_20 = [{ 'name': node['name'], 'weight': node['weight']} for node in items[:20]]
        return top_20

    def get_communities(self, sort=True):
        # Use native method to get community
        _communities = self.graph.community_fastgreedy(
            'weight').as_clustering()

        # Update graph vertex attributes.
        for index, vertex in enumerate(self.graph.vs):
            vertex.update_attributes(
                {'community': _communities.membership[index], 'id': index})

        communities = []
        for subgraph in _communities.subgraphs():
            weight_sum = sum([edge['weight'] for edge in subgraph.es])
            nodes_ids = [node['name'] for node in subgraph.vs]
            community = {
                'weight': weight_sum,
            }
            # Only compute core for those communities have node number larger than 3.
            nodes = []
            for node in nodes_ids:
                node_dict = {
                    'name': node
                }
                edges_ids = subgraph.incident(node, mode='ALL')
                total_weight = sum([subgraph.es[e]['weight']
                                   for e in edges_ids])

                # Update the vertex's weight in the parent graph.
                self.graph.vs.find(node)['weight'] = total_weight
                node_dict['weight'] = total_weight
                nodes.append(node_dict)

            # Sort nodes according to its weight.
            community['items'] = list(sorted(nodes, key=lambda x: x['weight'], reverse = True))

            if len(subgraph.vs) > 3:
                community['core'] = community['items'][0]['name']
            communities.append(community)

        # Add core attribute to graph vertex.
        for community in communities:
            if 'core' in community:
                node = self.graph.vs.find(community['core'])
                node.update_attributes({'core': True})

        if sort:
            return sorted(communities, key=lambda x: x['weight'], reverse=True)
        return communities

    def get_hooks(self):
        betweeness = self.graph.betweenness(weights='weight')
        ls = [(self.graph.vs[index], value) for index, value in enumerate(betweeness)]
        sorted_ls = list(filter(lambda x: x[0]['core'] and x[1] > 0, sorted(ls, key=lambda x: x[1], reverse=True)))
        connectors = []
        for vx, _ in sorted_ls:
            connected_communities = set()
            for neighbor in vx.neighbors():
                if neighbor['community'] != vx['community']:
                    connected_communities.add(neighbor['community'])
            if len(connected_communities) > 0:
                connectors.append({
                    'name': vx['name'],
                    'weight': vx['weight'],
                    'connectTo': list(connected_communities)
                })
        return connectors

    def to_document(self):
        nodes = []
        edges = []
        for edge in self.graph.es:
            edge_attr = {}
            edge_attr['from'], edge_attr['to'] = edge.tuple
            edge_attr['weight'] = edge['weight']
            edges.append(edge_attr)
        for node in self.graph.vs:
            node_attr = {}
            node_attr = { key: node[key] for key in node.attributes()}
            node_attr['degree'] = node.degree()
            nodes.append(node_attr)
        return {
            'nodes': nodes,
            'edges': edges,
            'communities': self.communities,
            'rank': self.product_rank,
            'hooks': self.hooks
        }

    def to_json(self):
        return json.dumps(self.to_document(), indent=4)
