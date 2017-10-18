"use strict";

    function handleTodo() {
    let listBody = document.getElementById("todo-list");
    let boxes = document.getElementsByClassName("checkbox");
    let check = "X";
    let uncheck = " ";
    let help = document.getElementById("help");
    function handleCheck() {
        console.log("I've clicked on " + this);
        event.stopPropagation();
        if (this.innerHTML == "") {
            this.innerHTML = "[ ]";
        }
        else if (this.innerHTML == "[x]") {
            console.log(this.innerHTML);
            this.innerHTML = "[ ]";
            this.classList.remove("checked");
            this.classList.add("unchecked");
        } else if (this.innerHTML == "[ ]" ) {
            console.log(this.innerHTML);
            this.innerHTML = "[x]";
            this.classList.remove("unchecked");
            this.classList.add("checked");

        } else {
            console.log("sorry");
        }

    }


        for(let i = 0; i < boxes.length; i++) {
            boxes[i].addEventListener("click", handleCheck, false);
        }


}

handleTodo();

