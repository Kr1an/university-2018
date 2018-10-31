from functools import wraps

def tested(cases):
    def __tested(fn):
        @wraps(fn)
        def tested_phi(*args, **kwarg):
            return fn(*args, **kwarg)
        
        for index, case in enumerate(cases):
            assert case, '{} test #{} failed'.format(fn.func_name, index)

        return tested_phi
    return __tested

def try_read_file(file, elsewhere):
    try:
        file = open(file, 'r')
        return file.read() 
    except:
        return elsewhere


    
    