#! ./env/bin/python
from pyscript.src.task import import_from_file_path, network_analysis, test_send_message
from pyscript.src.argparser import parser


args = vars(parser.parse_args())

if args['import']:
    file_path = args['import']
    import_from_file_path(file_path)

if args['report']:
    network_analysis(args['report'])

if args['test_mq']:
    test_send_message()
