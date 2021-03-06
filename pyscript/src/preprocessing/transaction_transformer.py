import igraph
from itertools import filterfalse, combinations
from pandas import Series

from ..model import ProductNerwork, Promotion
from ..error import ZeroNodeError


def all_pass(promotion_list, arg):
    for promotion in promotion_list:
        if not promotion.is_in(arg):
            return False
    return True


class TransactionTransformer:
    def __init__(self, transactions, org_schema, method='frequency'):
        self.method = method
        self.transactions = transactions
        self._done = False
        self.org_schema = org_schema
        self.promotion_filter = {
            'direct': {},
            'combination': {}
        }
        self.item_filter = {}

    def add_promotion_filters(self, promotions):
        if not self.is_done():
            promotions = [Promotion(promotion) for promotion in promotions]
            for promotion in promotions:
                if promotion.type == 'combination':
                    for item in promotion.group_one:
                        if item not in self.promotion_filter['combination']:
                            self.promotion_filter['combination'][item] = {}
                        for item2 in promotion.group_two:
                            if item2 in self.promotion_filter['combination'][item]:
                                self.promotion_filter['combination'][item][item2].append(
                                    promotion)
                            else:
                                self.promotion_filter['combination'][item][item2] = [
                                    promotion]
                            # Add a reverse entry.
                            if item2 not in self.promotion_filter['combination']:
                                self.promotion_filter['combination'][item2] = {
                                }
                            if item not in self.promotion_filter['combination'][item2]:
                                self.promotion_filter['combination'][item2][item] = [
                                    promotion]
                            else:
                                self.promotion_filter['combination'][item2][item].append(
                                    promotion)
                if promotion.type == 'direct':
                    for item in promotion.group_one:
                        if item not in self.promotion_filter['direct']:
                            self.promotion_filter['direct'][item] = []
                        self.promotion_filter['direct'][item].append(promotion)
        else:
            raise Exception('Cannot add promotion after calling done.')

    def add_category_filters(self, categories):
        if not self.is_done():
            for category in categories:
                for item in category['items']:
                    if item not in self.item_filter:
                        self.item_filter = 1
        else:
            raise Exception('Cannot add category after calling done.')

    def done(self):
        self._done = True

    def is_done(self):
        return self._done

    def is_valid_edge(self, edge, time):
        item1 = edge[0][self.org_schema['itemName']]
        item2 = edge[1][self.org_schema['itemName']]
        # See if the item is in filter list.
        if item1 in self.item_filter or item2 in self.item_filter:
            return False

        # See if the item is in promotion(direct).
        if item1 in self.promotion_filter['direct'] and all_pass(self.promotion_filter['direct'][item1], time) \
                or item2 in self.promotion_filter['direct'] and all_pass(self.promotion_filter['direct'][item2], time):
            return False

        # See if the item is in promotion(combination).
        if item1 in self.promotion_filter['combination'] and item2 in self.promotion_filter['combination'][item1] \
                and all_pass(self.promotion_filter['combination'][item1][item2], time):
            return False
        return True

    def get_edges(self, transaction):
        edges = [edge for edge in combinations(
            transaction['items'], 2) if self.is_valid_edge(edge, transaction[self.org_schema['transactionTime']])]
        return edges

    def weight(self, edge, transaction, nums):
        if self.method == 'adjust-frequency':
            return 1 / nums
        if self.method == 'adjust-price':
            return sum([item['amount'] for item in edge]) / (len(transaction['items']) - 1)
        if self.method == 'frequency':
            return 1

    def transform(self, support=0.001):
        if not self.is_done():
            raise Exception()
        support_total = 0
        edge_dict = {}
        nodes_dict = {}
        for transaction in self.transactions:
            edges = self.get_edges(transaction)
            number = len(edges)
            for edge in edges:
                edge_one = tuple(item[self.org_schema['itemName']]
                                 for item in edge)
                edge_two = (edge_one[1], edge_one[0])
                weight = self.weight(edge, transaction, number)
                support_total += 1
                if edge_one in edge_dict or edge_two in edge_dict:
                    edge_in_list = edge_one if edge_one in edge_dict else edge_two
                    edge_dict[edge_in_list]['weight'] += weight
                else:
                    edge_dict[edge_one] = {}
                    edge_dict[edge_one]['weight'] = weight
        series = Series([edge['weight'] for edge in edge_dict.values()])
        support = series.quantile(1 - support)
        for edge in list(edge_dict.keys()):
            if edge_dict[edge]['weight'] < support:
                del edge_dict[edge]
        for edge in edge_dict.keys():
            for node in edge:
                if node not in nodes_dict:
                    nodes_dict[node] = {
                        'weight': edge_dict[edge]['weight']
                    }
                else:
                    nodes_dict[node]['weight'] += edge_dict[edge]['weight']
        if len(nodes_dict.keys()) <= 0:
            raise ZeroNodeError(
                'The resulted graph does not contain any node. Consider lower the support.')
        return self.to_graph(nodes_dict, edge_dict)

    def to_graph(self, nodes, edges):
        g = igraph.Graph()
        for node in nodes.keys():
            g.add_vertex(node, core=False, weight=nodes[node]['weight'])
        for edge, attrs in edges.items():
            weight = attrs['weight'] if attrs['weight'] > 0 else 1
            g.add_edge(edge[0], edge[1], weight=weight)
        return ProductNerwork(g)
