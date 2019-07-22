import json

class ProductNerwork:
    def __init__(self, graph):
        self.graph = graph
        self._communities = graph.community_fastgreedy(
            'weight').as_clustering()
        for index, vertex in enumerate(self.graph.vs):
            vertex.update_attributes(
                {'community': self._communities.membership[index], 'id': index})
        self.communities = self.get_communities()
        for community in self.communities:
            if 'core' in community:
                node = self.graph.vs.find(community['core'])
                node.update_attributes({'core': True})

    def get_communities(self, sort=True):
        dics = []
        for subgraph in self._communities.subgraphs():
            nums = len(subgraph.vs)
            weight_sum = sum([edge['weight']
                              for edge in subgraph.es]) * (nums) / nums / (nums + 1)
            items = [node['name'] for node in subgraph.vs]
            dic = {
                'weight': weight_sum,
                'items': items,
            }
            # Only compute core for those communities have node number larger than 3.
            if nums >= 3:
                items_weight_dict = {}
                for node in items:
                    edges_ids = subgraph.incident(node, mode='ALL')
                    node_weight = sum([subgraph.es[e]['weight']
                                       for e in edges_ids])
                    items_weight_dict[node] = node_weight
                dic['core'] = max(items_weight_dict, key=lambda x: items_weight_dict[x])
            dics.append(dic)
        if sort:
            return sorted(dics, key=lambda x: x['weight'], reverse=True)
        return dics

    def get_connectors(self):
        items = []
        for index, value in enumerate(self.graph.betweenness(weights='weight')):
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
            nodes.append(node_attr)
        return {
            'nodes': nodes,
            'edges': edges,
            'communities': self.communities,
        }

    def to_json(self):
        return json.dumps(self.to_document(), indent=4)
