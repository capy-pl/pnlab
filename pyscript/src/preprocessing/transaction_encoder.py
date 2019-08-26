class TransactionEncoder:
    """The class creates an instance aims to transform transactions' pandas dataframe into dictionary.

        Attributes:
            transaction_id_name: The transaction's id column name.
            item_name: The item/product's column name.
            transaction_amount_name: The transaction amount 's column name.
            transaction_attrs(optional): A list contains all attributes' column names that belong to the transaction.
            item_attrs(optional):  A list contains all attributes' column names that belong to the transaction.
    """

    def __init__(self, transaction_id_name, item_name, transaction_amount_name, transaction_attrs=[], item_attrs=[]):
        self.transaction_id_name = transaction_id_name
        self.item_name = item_name
        self.transaction_attrs = transaction_attrs
        self.item_attrs = item_attrs
        self.transaction_amount_name = transaction_amount_name

    def to_dict(self, df, group_by, aggregation_option, filter_cols=[]):
        df = df.filter(filter_cols)
        groupbyObject = df.groupby([group_by])
        df = groupbyObject.agg(aggregation_option)
        dic = df.to_dict('index')
        for index, value in dic.items():
            value[group_by] = index
        return dic

    def get_transaction_dict(self, df):
        filter_columns = [self.transaction_id_name,
                          self.transaction_amount_name] + self.transaction_attrs
        aggr_option = {key: 'first' for key in self.transaction_attrs}
        aggr_option[self.transaction_amount_name] = 'sum'
        return self.to_dict(df, self.transaction_id_name, aggr_option, filter_columns)

    def get_item_dict(self, df):
        filter_columns = [self.item_name] + self.item_attrs
        aggr_option = {key: 'first' for key in self.item_attrs}
        return self.to_dict(df, self.item_name,  aggr_option, filter_columns)

    def transform(self, df):
        df = df.dropna()
        transaction_dict = self.get_transaction_dict(df)
        item_dict = self.get_item_dict(df)
        for _, value in transaction_dict.items():
            value['items'] = []

        for index, data in df.iterrows():
            if index in transaction_dict:
                ts = transaction_dict[index]
                item_name = data[self.item_name]
                if item_name in item_dict:
                    item = dict(item_dict[item_name])
                    item['amount'] = data[self.transaction_amount_name]
                    ts['items'].append(item)
        return list(transaction_dict.values())
