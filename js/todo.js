"use strict";
(function (){
  $(document).ready(function(){
    let targetNum;



      let listBody = document.getElementsByClassName("todo-list");
      let allTasks = document.getElementsByClassName("task");
      let deleteIcons = document.getElementsByClassName("todo-delete");
      let todoInput = document.getElementById("todo-input");
      let addListBtn = document.getElementsByClassName("add-new-todo-list")[0];
      let numTodos = 0;
      let numLists = 0;


      // function renderTodoStatus() {
      //   let todoStatus = document.getElementsByClassName("todo-status")[0];
      //   todoStatus.innerText = numTodos + " todos";
      // }

      function updateTodoStatus(isDelete) {
        if (!isDelete) {
          numTodos++;
        }
        if (isDelete) {
          numTodos--;
        }
        // renderTodoStatus();
      }

      function updateListNum(isDelete) {
        if(!isDelete) {
          numLists++;
        }
        if(isDelete) {
          numLists--;
        }
      }

    function applyDelete() {
      // .off() to prevent multiple listeners from being added to a single task
      $(".task-panel li").find(deleteIcons).off().on("click", function(e) {
        // e.stopPropagation();
        $(this).parent().fadeOut();
        updateTodoStatus(true);
      });
      deleteHover();
    }

    function deleteHover() {

      function handlerIn() {
        console.log("hover");
        $(this).find(deleteIcons).removeClass("hidden");
      }
      function handlerOut() {
        $(this).find(deleteIcons).addClass("hidden");
      }
      $(allTasks).hover(handlerIn, handlerOut);
    }


    // Adds a hidden ul to task panel
    function prepareTaskList(){
        let prepUl = `<ul data-target="${numLists}" class="task-inactive"><li>New List Added!</li></ul>`;
        $(".task-panel").append(prepUl);
    }


    function applySelectToggle() {
      $(".list-panel li").off().on("click", function(e){
        e.stopPropagation();
        $(".list-panel li").removeClass("list-selected");
        $(this).addClass("list-selected");
        taskReveal();
      });
    }

    function taskReveal() {
      targetNum = $(".list-panel").find(".list-selected").attr("data-target");
      $(".task-panel ul").addClass("task-inactive");
      $(`ul[data-target=${targetNum}]`).removeClass("task-inactive");
    }

    // Adds new lists to list panel
    $(".list-input").on("keydown", function(e) {
      if (event.which === 13) {
        // List's data-target# attribute == listNum
        updateListNum(false);

        let list = `<li data-target="${numLists}">${e.target.value}</li>`;
        // Append list to list panel
        $(".list-panel").find("ul").append(list);
        applySelectToggle();
        prepareTaskList();


        // Clear the input after user hits enter
        $(".list-input").val("");
      }
    });

    // For testing --- delete later
    $(".list-panel").find("li").on("click", function(){
      $(".list-panel li").removeClass("list-selected");
      $(this).addClass("list-selected");
    });

    function renderItem(newItem) {
      let newListItem =
          '<li class="task">' +
          '<input type="checkbox">'
          + newItem
          + '<span class="todo-delete hidden">x</span>'
          + '</li>';
      return newListItem;
    }

      function addNewTask() {
        $(".task-input").on("keydown", function(event) {
          if (event.which === 13) {

            let newItem =
              `<li class="task">
              <input type="checkbox">
              ${event.target.value}
              <span class="todo-delete hidden">x</span></li>`;

            $(".task-panel").find(`[data-target=${targetNum}]`).append(newItem);
            applyDelete();
            $(".task-input").val("");








            // addToList(getActiveList(), newItem);
            //
            // applyDelete($(allTasks).find("span"));

            // Increases # tasks
            updateTodoStatus(false);
          }
        });
      }

      addNewTask();




  });
})();


