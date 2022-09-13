export default class Heap {
  constructor(type = 'min') {
    this.list = [];
    this.size = 0;
    this.type = type;
    this.hash = {};
  }

  isEmpty() {
    return this.size === 0;
  }

  fixUp(k) {
    while (k > 1 && this.cmp(Math.floor(k / 2), k)) {
      this.swap(k, Math.floor(k / 2));

      k = Math.floor(k / 2);
    }
  }

  fixDown(k) {
    while (2 * k <= this.size - 1) {
      let j = 2 * k;

      if (j < this.size - 1 && this.cmp(j, j + 1)) j += 1;

      if (!this.cmp(k, j)) break;

      this.swap(k, j);

      k = j;
    }
  }

  insert(id, priority, data = {}) {
    this.hash[id] = this.size + 1;

    this.list[this.size += 1] = { id, priority, data };

    this.fixUp(this.size);
  }

  remove() {
    if (this.size === 0) return null;

    this.swap(1, this.size);

    this.fixDown(1);

    const item = this.list[this.size];

    delete this.list[this.size];

    this.size -= 1;

    return item;
  }

  getItem(id) {
    return this.list[this.hash[id]];
  }

  cmp(idxA, idxB) {
    return this.cmpPriorities(this.list[idxA].priority, this.list[idxB].priority);
  }

  cmpPriorities(priorityA, priorityB) {
    return this.type === 'max' ? priorityA < priorityB : priorityA > priorityB;
  }

  swap(idxA, idxB) {
    this.swapItemsInHash(idxA, idxB);

    const temp = this.list[idxA];
    this.list[idxA] = this.list[idxB];
    this.list[idxB] = temp;
  }

  swapItemsInHash(idxA, idxB) {
    this.hash[this.list[idxA].id] = idxB;

    this.hash[this.list[idxB].id] = idxA;
  }

  changePriority(id, newPriority) {
    const idx = this.hash[id];

    const currentPriority = this.list[idx].priority;

    if (currentPriority === newPriority) return;

    this.list[idx].priority = newPriority;

    if (this.cmpPriorities(currentPriority, newPriority)) {
      this.fixUp(idx);
    } else {
      this.fixDown(idx);
    }
  }
}
