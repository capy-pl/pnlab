class TransactionEncoder:
    def __init__(self, org_schema, org_name=None):
        self.transaction_id_name = org_schema['transactionName']
        self.item_name = org_schema['itemName']
        self.transaction_attrs = list(
            map(lambda x: x['name'], org_schema['transactionFields']))
        self.item_attrs = list(
            map(lambda x: x['name'], org_schema['itemFields']))
        self.transaction_amount_name = org_schema['amountName']
        self.org_name = org_name

    def to_dict(self, df, filter_cols, group_by, aggregation_option):
        total_cols = list(df.columns)
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
        return self.to_dict(df, filter_columns, self.transaction_id_name, aggr_option)

    def get_item_dict(self, df):
        filter_columns = [self.item_name] + self.item_attrs
        aggr_option = {key: 'first' for key in self.item_attrs}
        return self.to_dict(df, filter_columns, self.item_name,  aggr_option)

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
                    # TODO: Calculation here is hardcoded. Need to
                    # design another mechanism to handle this.
                    item['amount'] = data['銷售單價'] * data['銷售數量']
                    ts['items'].append(item)
        for key in list(transaction_dict.keys()):
            if len(transaction_dict[key]['items']) < 2:
                del transaction_dict[key]
        return (list(transaction_dict.values()), list(item_dict.values()))

    # The function may cause potential file lose.
    def transform_by_chunk(self, df_iterator):
        for df in df_iterator:
            yield self.transform(df)
