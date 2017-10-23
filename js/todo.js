"use strict";
(function (){

  let listBody = document.getElementById("todo-list");
  let listItems = document.getElementsByClassName("checkbox");
  let deleteIcons = document.getElementsByClassName("todo-delete");
  let todoInput = document.getElementById("todo-input");
  let taskList = [];

  function renderItem(item) {
    console.log("item passed in is " + item);

    let newItem = '<li class="checkbox"><input type="checkbox">' + item + '</li>';
    $(listBody).append(newItem);

    $(listItems).on("click", function() {
      console.log("you've clicked on " + this.innerText);
    });

    renderDeleteIcon(newItem);
  }

  function deleteHOnHover() {
    function handlerIn() {
      $(this).find(deleteIcons).removeClass("hidden");
    }
    function handlerOut() {
      $(this).find(deleteIcons).addClass("hidden");
    }

    $(listItems).hover(handlerIn, handlerOut);
  }

  function renderDeleteIcon(newItem) {
    $(listItems).last().append('<span class="todo-delete hidden">x</span>');
    deleteHOnHover();
    $(deleteIcons).on("click", function(){
      // console.log("removing " + this.addBack());
      $(this).parent().fadeOut();
      event.stopPropagation();
    });
  }


  function addTask() {
    $(todoInput).on("keydown", event => {
      if (event.which === 13) {
        taskList.push(event.target.value);
        console.log(taskList);
        renderItem(event.target.value);

        todoInput.value = "";
      }
    });
  }
  addTask();


})();


