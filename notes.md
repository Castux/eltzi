From the playthrough video we can see:

- merge check is done on the falling step where the falling block cannot go further
- if no merging: new block appears
- if merging: try merge again, and if not do a fall step immediately. New merges might happen. Continue until no merges, then new block.

IE: no new block while merging/still falling!

- when dropping, perform merge check immediately at arrival