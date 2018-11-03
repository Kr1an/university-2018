#!/bin/python3
from math import inf

graph = [
    [0, 1, inf, inf, inf],
    [inf, 0, 5, inf, inf],
    [inf, inf, 0, 3, inf],
    [inf, inf, inf, 0, 6],
    [4, inf, inf, inf, 0],
]

size = len(graph)

mids = [list(range(size)) for _ in range(size)]

print('init graph', graph)
print('init mids', mids)

for k in range(size):
    for i in range(size):
        for j in range(size):
            if graph[i][k] < inf and graph[k][j] < inf:
                old = graph[i][j]
                graph[i][j] = min(graph[i][j], graph[i][k] + graph[k][j])
                if graph[i][j] < old:
                    mids[i][j] = k

print('graph', graph)
print('mids', mids)

