#! ./env/bin/python
from pyscript.src.task import import_data, network_analysis
from pyscript.src.argparser import parser



args = vars(parser.parse_args())

if args['import']:
    print(args['import'])

if args['report']:
    network_analysis(args['report'])
