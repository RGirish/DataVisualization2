library(igraph)
ga.data <- read.csv('/Users/student/Girish/Personal/DV/Homeworks/HW3/assign3_emal.csv', header=TRUE)
g <- graph.data.frame(ga.data, directed=TRUE)
deg = centralization.degree(g)
bet = centralization.betweenness(g)
vecSize = eigen_centrality(g)
eig = eigen_centrality(g)$vector * 1000
eig = as.integer(eig)

V(g) [ eig == 1000 ]$color <- "red"
V(g) [ eig < 1000 ]$color <- "red"
V(g) [ eig < 900 ]$color <- "red"
V(g) [ eig < 800 ]$color <- "red"
V(g) [ eig < 700 ]$color <- "orange"
V(g) [ eig < 600 ]$color <- "orange"
V(g) [ eig < 500 ]$color <- "orange"
V(g) [ eig < 400 ]$color <- "orange"
V(g) [ eig < 300 ]$color <- "yellow"
V(g) [ eig < 200 ]$color <- "yellow"
V(g) [ eig < 100 ]$color <- "yellow"
V(g) [ eig < 90 ]$color <- "yellow"
V(g) [ eig < 80 ]$color <- "yellowgreen"
V(g) [ eig < 70 ]$color <- "yellowgreen"
V(g) [ eig < 60 ]$color <- "yellowgreen"
V(g) [ eig < 50 ]$color <- "yellowgreen"
V(g) [ eig < 40 ]$color <- "blue"
V(g) [ eig < 30 ]$color <- "blue"
V(g) [ eig < 20 ]$color <- "blue"
V(g) [ eig < 10 ]$color <- "blue"

plot(g, layout = layout.star, edge.width = 1, edge.color = "gray", edge.arrow.width = 0.6, vertex.size = 40 * vecSize$vector, edge.arrow.size = 0.3, vertex.label.cex = 0.9, margin = -0.4, vertex.label.color= "black", vertex.color=V(g)$color, vertex.label.family = "sans", vertex.label.dist = vecSize$vector + 0.36)
