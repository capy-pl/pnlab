import json
import igraph
from itertools import filterfalse, combinations

from .error import ZeroNodeError

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

class NetworkConverter:
    def __init__(self, purchase_list):
        self.purchase_list = purchase_list
    
    def convert(self, method='degree-price', support=0.001):
        support = int(len(self.purchase_list) * support)
        result = {}
        nodes = set()
        for transaction in self.purchase_list:
            itemsets = transaction['items']
            if len(itemsets) > 1:
                edge_list = list(self.find_edges_in_list(itemsets))
                length = len(edge_list)
                for edge_dict_tuple in edge_list:
                    edge = tuple([dic['單品名稱'] for dic in edge_dict_tuple])
                    weight = sum([dic['amount'] for dic in edge_dict_tuple]) / length
                    if edge in result or (edge[1], edge[0]) in result:
                        edge_in_list = edge if edge in result else (edge[1], edge[0])
                        result[edge_in_list]['count'] += 1
                        result[edge_in_list]['weight'] += weight
                    else:
                        result[edge] = {}
                        result[edge]['count'] = 1
                        result[edge]['weight'] = weight
        for key in list(result.keys()):
            if result[key]['count'] < support:
                del result[key]
        for items in result.keys():
            for item in items:
                if item not in nodes:
                    nodes.add(item)
        if len(nodes) <= 0:
            raise ZeroNodeError('The resulted graph does not contain any node. Consider lower the support.')
        return self.to_graph(nodes, result)

    def find_edges_in_list(self, itemsets):
        """Return the combinations of the itemsets.
        """
        return combinations(itemsets, 2)

    def to_graph(self, nodes, edges):
        g = igraph.Graph()
        for node in nodes:
            g.add_vertex(node)
        for edge, attrs in edges.items():
            weight = attrs['weight'] if attrs['weight'] > 0 else 1
            g.add_edge(edge[0], edge[1], weight=weight)
        return ProductNerwork(g)
