import json

class ProductNerwork:
    def __init__(self, graph):
        self.graph = graph
        self._communities = graph.community_fastgreedy(
            'weight').as_clustering()
        for index, vertex in enumerate(self.graph.vs):
            # add neighbors
            vertex.update_attributes(
                {'community': self._communities.membership[index], 'id': index, 'neighbors': self.graph.neighbors(vertex.index)})
        self.communities = self.get_communities()
        for community in self.communities:
            if 'core' in community:
                node = self.graph.vs.find(community['core'])
                node.update_attributes({'core': True})

    def get_product_rank(self, num):
        items_weight_dict = {}
        for node in self.graph.vs:
            edges_id = self.graph.incident(node['name'], mode='ALL')
            node_weight = sum([self.graph.es[e]['weight'] for e in edges_id])
            items_weight_dict[node['name']] = node_weight 
        products = [item for item in sorted(items_weight_dict, key=items_weight_dict.get, reverse=True)[:num]]
        return products

    def get_communities(self, sort=True):
        communities = []
        for subgraph in self._communities.subgraphs():
            number = len(subgraph.vs)
            weight_sum = sum([edge['weight']
                              for edge in subgraph.es]) * (number) / number / (number + 1)
            nodes_ids = [node['name'] for node in subgraph.vs]
             # add community id
            comm_id = self.graph.vs[[node['id'] for node in subgraph.vs][0]]['community']
            community = {
                'id': comm_id,
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
                node_dict['weight'] = total_weight
                nodes.append(node_dict)
            community['items'] = list(map(lambda x: x['name'],
                                     sorted(nodes, key=lambda x: x['weight'], reverse = True)
                                    ))
            if number > 3:
                community['core'] = community['items'][0]
            communities.append(community)
        if sort:
            return sorted(communities, key=lambda x: x['weight'], reverse=True)
        return dics

    def get_connectors(self):
        items = []
        for index, value in enumerate(self.graph.betweenness(weights=['weight'])):
            if value > 0:
                items.append({ 'name': self.graph.vs[index]['name'], 'betweeness': value })
        items.sort(key=lambda x: x['betweeness'], reverse=True)
        return items

    def normalizer(self, max_degree):
        max_value = max_degree
        min_value = 1
        def normalize(value):
            return (value - min_value) / max_value + 1
        return normalize

    def to_document(self):
        norm = self.normalizer(self.graph.maxdegree())
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
            # neighbor nodes
            # node_attr['neighbors'] = self.graph.neighbors(self.graph.vs.find(node.index)
            nodes.append(node_attr)
        # for node in self.graph.vs:
        #     # neighbor nodes
        #     node_attr['neighbors'] = self.graph.neighbors(self.graph.vs.find(name == node['name']).index)
        #     nodes.append(node_attr)
        return {
            'nodes': nodes,
            'edges': edges,
            'communities': self.communities,
            'rank': self.get_product_rank(20)
        }

    def to_json(self):
        return json.dumps(self.to_document(), indent=4)
