"use strict";

const todoBody = {
    listBody: document.getElementById("todo-list"),
    listItems: document.getElementsByClassName("checkbox"),
    input: document.getElementsByTagName("input"),
};


//TODO: Make delete function

let todo = {
    taskArray: [],
    taskList: [],
    getInput:
        function () {
            if(event.keyCode === 13) {
                console.log(this.value);
                todo.taskList.push(this.value);
                console.log(todo.taskList);
            }
        },
    addTask:
        function () {
            if(event.keyCode === 13) {
                todoBody.listBody.innerHTML += "<li class='checkbox'>" + this.value + "</li>";
                for (let i = 0; i < todoBody.listItems.length; i++) {
                    todoBody.listItems[i].addEventListener("click", todo.checkTask, false);
                }
            }

        },
    checkTask:
        function () {
            this.classList.toggle("checked");
    },
};

(function (){
    for (let i = 0; i < todoBody.input.length; i++) {
        // Both listeners are applied to the input field - they don't overwrite each other
        todoBody.input[i].addEventListener("keydown", todo.getInput, false);
        todoBody.input[i].addEventListener("keydown", todo.addTask, false);
    }
}());

