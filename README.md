# circuit-visualizer-p5

the force distribution piece of this is a mess

may want links to have forces act on them in future

could add "angular attractors", i.e. attract individual nodes to an angle from the center, for default ordering of nodes

will connect "reachability" highlighting to matrix view


------------

have simple circuit generation lay nodes out in a static ring

should one unified representation be managed (i.e. adjMat?)
or should the graph and adjmat simply be synced?

-----
# Findings !

closed-loop control of a node reveals a lot if
    node N has many (non-reciprocal) inputs

for two nodes A,B,

if corr(A,B) > th for both ctrl(A) and ctrl(B)
    A <-> B



# Major Issues:
- all node creation functions reference global variables, this makes it difficult to extend


# Feature requests:
- [ ] after calculating reachability, topologically sort the network
    - all "leftmost" nodes propogate their "phase" to all their children
        - easy! all nodes with no in degree get their own phase
    - maybe have intrinsic noise only move in Y dimension
    - control only move in x direction
    - then addition can cause correlation in both?

    - wiggling should simply be a sum of all input wiggles?
    - control sets phase to follow control oscillator?

- [ x] calculate reachability (floyd warshall ??)
    - [x.] vis reachability (in adjMat only?)
        - [x] have direct connections
        - [x] can highlight Nth order connections
        - [F] can do offset connections to overlay multiple metrics
        - [ ] vis reachability with something directional!

    - [ ] system for drawing wiggly high order connections
        - "bouncing" arrows?
        - blob communities together?
            - metaballs :O
                - add edges to blobbables
                - subtract non-nodes and node-edges via distance field?
            - convex hull ?
        - offset connections?

- [ ] in / out degree quant & viz
    - this helps build intuition for which points are good to intervene
    - cytoscape scales nodes by total degree

- [~] delete edges / nodes gracefully
    - for now just clear everything
- [~] visualize self-connection with loop arrow
    - using circle around node for now

# Completed Features:
    - toggle directional edges! (with s)
    - highlight edges from a second adjacency matrix
    - basic binary matrix reps
    - can import connections from binary string (check order / convention)
    - can bitshift to "rotate connections"
    - can toggle connections via adj mat
    - can add connections via drag arrows
        - will also remove redundant connections!
    - clearMat()

# Bonus Features
- [ ] nodes wiggle to show correlation :)
- [ ] visualize where we're controlling
- [ ] visualize open-loop stim
- [ ] viz multiple mats on one tile
- [ ] highlight control-severed edges
    csev = m & !ctrl(m)
    overlay red Xs
- [ ] color nodes by community
    see: [Clustering and Community Detection in Directed Networks: A Survey](https://arxiv.org/pdf/1308.0971.pdf;)
- [ ] color nodes by K-means after force-directed layout?

- [ ] duplicate edge protection (have collection of children be Sets)


----------------------
## Additional topics
- generally, should be leveraging graph theory more, for instace
    - idea of where to control can be tied back to "minimum cut" and "highly connected subgraphs"
    - maximal clique
## Similar frameworks:
- [Gephi](https://youtu.be/371n3Ye9vVo)
    gephi network datasets, could be scanned for candidate networks to ID
    - https://github.com/gephi/gephi/wiki/Datasets
    - has lots of layout options, including "force atlats"

- Cytoscape
