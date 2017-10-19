"use strict";

const todoBody = {
    listBody: document.getElementById("todo-list"),
    listItems: document.getElementsByClassName("checkbox"),
    deleteIcons: document.getElementsByClassName("delete"),
    input: document.getElementsByTagName("input"),
};


//TODO: Make delete function
let todo = {
    taskList: [],
    getInput:
        function (){
            if(event.keyCode === 13) {
                console.log(this.value);
                todo.taskList.push(this.value);
                console.log(todo.taskList);
            }
        },
    addTask:
        function (){
            if(event.keyCode === 13) {
                // Build task item html here
                todoBody.listBody.innerHTML +=
                    "<li class='checkbox'>" + this.value + "</li>" +
                    "<span class='delete'>(X)</span>";
                todoUtil.applyCheck();
                todoUtil.applyDelete();
            }

        },
    deleteTask:
        function (){
            let deleteIndex = todo.taskList.indexOf(this);
            console.log("We're looking for the value " + this.value);
            console.log("Delete index is: " + deleteIndex);
            todo.taskList.splice(deleteIndex, 1);
        }
};

let todoUtil = {
    applyCheck:
        function() {
            // Need to loop through the node list and apply listener each time a task is added
            // ApplyCheck is run at the end of todo.addTask
            for (let i = 0; i < todoBody.listItems.length; i++) {
                todoBody.listItems[i].addEventListener("click", function() {
                    todoBody.listItems[i].classList.toggle("checked");
                }, false);
            }
        },
    applyDelete:
        function(that) {
            for (let i = 0; i < todoBody.deleteIcons.length; i++) {
                let deleteButton = todoBody.deleteIcons[i];
                console.log(that);
                todo.deleteTask.apply(deleteButton);
                todoBody.deleteIcons[i].addEventListener("click", todo.deleteTask, false);
            }
        }
};

(function (){
    for (let i = 0; i < todoBody.input.length; i++) {
        // Both listeners are applied to the input field - they don't overwrite each other
        todoBody.input[i].addEventListener("keydown", todo.getInput, false);
        todoBody.input[i].addEventListener("keydown", todo.addTask, false);
    }
})();


