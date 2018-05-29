'use strict';
const questions= require('../db/questions');

const _Node = require('./node');

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }
  
  insertLast(item) {
    if(this.head === null) {
      this.insertFirst(item);
    } 
    else {
      let tempNode = this.head;

      while(tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }
  
  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;
  
    while ((currNode !== null) && (currNode.value !== item)) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Item not found');
      return;
    }
    previousNode.next = currNode.next;
  }
  
  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while(currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }
  
  insertBefore(newItem, beforeNode) {
    if (!this.head) {
      this.insertFirst(newItem);
    }
    if (this.head.value === beforeNode) {
      this.insertFirst(newItem);
    }
  
    let currNode = this.head;
    let prevNode = this.head;
  
    while ((currNode.next !== null) && (currNode.value !== beforeNode) ) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    prevNode.next = new _Node(newItem, currNode);
  }
  
  insertAfter(newItem, afterNode) {
    if (!this.head) {
      this.insertFirst(newItem);
    }
    if (!this.head.next) {
      this.insertLast(newItem);
    }
  
    let currNode = this.head;
    let nextNode = this.head;
  
    while (currNode.value !== afterNode) {
      currNode = nextNode;
      nextNode = nextNode.next;
    }
  
    currNode.next = new _Node(newItem, nextNode);
  }
  
  
  insertAt(newItem, position) {
    if (!this.head === null) {
      this.insertFirst(newItem);
    } else {
      let currNode = this.head;
      let prevNode = this.head;
      let counter = 0;
  
      while(counter !== position) {
        prevNode = currNode;
        currNode = currNode.next;
        counter++;
      }
      let n = new _Node(newItem);
      prevNode.next = n;
      n.next = currNode;
  
    }
  }
  
}

function qList(){
  const QuestionList= new LinkedList();
  questions.map(question=>{
    QuestionList.insertFirst(question);
  });

  return QuestionList;
}
// console.log(JSON.stringify(qList()));
  
function display(list) {
  
  let currNode = list.head;
  
  while (currNode !== null) {
    console.log(currNode.value);
    currNode = currNode.next;
  }
}
  
function size(list) {
  let num = 0;
  if (list.head) {
    num = 1;
  } else {
    console.log('The list is empty');
    return;
  }
  
  let currNode = list.head;
  
  while (currNode.next !== null) {
    currNode = currNode.next;
    num++;
  }
  console.log('The size of the linked list is ', num);
  return num;
}
  
function isEmpty(list) {
  if(!list.head) {
    console.log('This list is empty');
    return;
  } else {
    console.log('Not an empty list');
    return;
  }
}
  
  
function findPrevious(list, item) {
  if (!list.head) {
    return;
  }
  
  let currNode = list.head;
  let prevNode = list.head;
  
  while (currNode.value !== item) {
    prevNode = currNode;
    currNode = currNode.next;
  }
  
  console.log('This is the previous node:', prevNode.value);
  return prevNode.value;
}
  
function findLast(list) {
  if(!list.head) {
    return;
  }
  
  let currNode = list.head;
  
  while (currNode.next !== null) {
    currNode = currNode.next;
  }
  
  console.log('This is the last value in the list:', currNode.value);
  return currNode.value;
}
  
function reverseList(list) {
  if(!list.head) {
    return;
  }
  
  let currNode = list.head;
  let prevNode = null;
  let nextNode = null;
  
  while (currNode !== null) {
    nextNode = currNode.next;
    currNode.next = prevNode;
    prevNode = currNode;
    currNode = nextNode;
  }
  
  list.head = prevNode;
  return list; 
}
  
function thirdFromEnd(list) {
  if (!list.head) {
    return;
  }
  
  let currNode = list.head;
  
  while (currNode.next.next.next !== null) {
    currNode = currNode.next;
  }
  
  let thirdItem = currNode.value;
  console.log('this is the third item from the end:', thirdItem);
  return thirdFromEnd;
}
  
function middleOfList(list) {
  if (!list.head) {
    return;
  }
  
  let fastPtr = list.head;
  let slowPtr = list.head;
  
  while (fastPtr !== null && fastPtr.next !== null) {
    fastPtr = fastPtr.next.next;
    slowPtr = slowPtr.next;
  }
  
  console.log('this is the middle of the list', slowPtr.value);
  return slowPtr.value;
}
  
function middleOfList2(list) {
  if (!list.head) {
    return;
  }
  
  let currNode = list.head;
  let counter = 0;
  
  while (currNode !== null) {
    currNode = currNode.next;
    counter++;
  }
  
  let half = counter / 2;
  
  while (currNode !== half && currNode.next !== null) {
    currNode = currNode.next;
  }
  
  console.log('this is the middle of list using method 2:', currNode.value);
  return currNode.value;
}

module.exports = LinkedList;
