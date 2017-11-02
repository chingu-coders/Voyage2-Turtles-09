"use strict";
(function (){
  $(document).ready(function(){



      let listBody = document.getElementsByClassName("todo-list");
      let allTasks = document.getElementsByClassName("task");
      let deleteIcons = document.getElementsByClassName("todo-delete");
      let todoInput = document.getElementById("todo-input");
      let addListBtn = document.getElementsByClassName("add-new-todo-list")[0];
      let numTodos = 0;
      let numLists = 0;

//TODO: Clicking on a task name opens the task list on the right side

      function renderTodoStatus() {
        let todoStatus = document.getElementsByClassName("todo-status")[0];
        todoStatus.innerText = numTodos + " todos";
      }

      function updateTodoStatus(isDelete) {
        if (!isDelete) {
          numTodos++;
        }
        if (isDelete) {
          numTodos--;
        }
        renderTodoStatus();
      }

      function updateListNum(isDelete) {
        if(!isDelete) {
          numLists++;
        }
        if(isDelete) {
          numLists--;
        }
      }

    function applyDelete(task) {
      // .off() to prevent multiple listeners from being added to a single task
      $(task).off().on("click", function(e) {
        e.stopPropagation();
        $(e.target).parent().fadeOut();
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

    // function applyListToggle() {
    //   // Toggle active list
    //   console.log("applyListToggle is running");
    //   // Applying listener to last element only so each elements gets 1 listener only
    //   $(listCollapsible).last().on("click", function(e){
    //     e.stopPropagation();
    //     // Removing all classes prevents multiple lists from being selected
    //     $(listCollapsible).find(".todo-list-title").removeClass("todo-list-selected");
    //     $(this).find(".todo-list-title").addClass("todo-list-selected");
    //     $(this).find(".todo-list").slideToggle();
    //   });
    // }

      // function renderNewList(listName) {
      //   let newList =
      //       '<li class="todo-multilist-item">' +
      //       '<h4 class="todo-list-title">' + listName + '</h4>' +
      //       '<ul class="todo-list"></ul>' +
      //       '</li>';
      //   $(listPanel).append(newList);
      //   applyListToggle();
      // }

    // function getActiveList() {
    //   // The active list is tracked by the selected class
    //     activeList = $(listCollapsible).find(".todo-list-selected");
    //     return activeList;
    // }

    // Adds a hidden ul to task panel
    function prepareTaskList(){
        let prepUl = `<ul data-target="${numLists}" class="task-inactive"></ul>`;
        $(".task-panel").append(prepUl);
    }


    function applySelectToggle() {
      $(".list-panel").last().on("click", function(e){
        $(".list-panel li").removeClass("list-selected");
        $(e.target).addClass("list-selected");
      });
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

    // function addToList(list, newItem) {
    //   $(list).append(renderItem(newItem));
    // }

      function taskReveal() {
        let targetNum = $(".list-panel").find(".list-selected").attr("data-target");
        console.log(targetNum);

        // $(".task-panel").find("ul").attr("data-target[value=" + targetNum + "]\"").removeClass("task-inactive");

        console.log($(".list-panel").find(".list-selected").attr("data-target"));
      }

      function addNewTask() {
        $(".task-input").on("keydown", function(event) {
          if (event.which === 13) {

            let newItem =
              `<li class="task">
              <input type="checkbox">
              ${event.target.value}
              <span class="todo-delete hidden">x</span></li>`;

            taskReveal();
            $(".task-panel").find("ul").append(newItem);



            todoInput.value = "";








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


