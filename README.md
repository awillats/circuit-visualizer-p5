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
- [ ] calculate reachability (floyd warshall ??)
    - [ ] vis reachability (in adjMat only?)
    - [ ] system for drawing wiggly high order connections
- [ ] in / out degree quant & viz
- [.] delete edges / nodes gracefully
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
- [ ] duplicate edge protection (have collection of children be Sets)
