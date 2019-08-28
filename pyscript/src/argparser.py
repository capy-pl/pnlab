import argparse

parser = argparse.ArgumentParser('pntool', description="""
    The program provides serveral commands to help user to trigger some
    action by using command line tools. The tool will be extremely useful
    for debugging or when message queue is not available.
    """
                                 )
parser.add_argument(
    '-r',
    '--report',
    type=str,
    nargs='?',
    metavar='report id',
    help='Run an network analysis on the given report id.'
)

parser.add_argument(
    '-i',
    '--import',
    type=str,
    nargs='?',
    metavar='file path',
    help='Import transaction data from given file path.'
)

parser.add_argument(
    '-c',
    '--create-user',
    type=str,
    nargs='?',
    metavar='file path',
    help='Create a new user.'
)
