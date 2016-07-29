# coding=utf-8

def compare_dates(item1, item2):
    if item1.revised is None:
        return 1
    elif item2.revised is None:
        return -1
    elif item1.revised < item2.revised:
        return 1
    else:
        return -1
