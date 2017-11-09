"use strict";
(function (){
  $(document).ready(function(){
    let targetNum;
    let allTasks = document.getElementsByClassName("task");
    let deleteIcons = document.getElementsByClassName("todo-delete");
    let taskPanel = $(".task-panel");
    let listPanel = $(".list-panel");
    //removed todoStatus
    let numTodos = 0;
    let numLists = 0;

    function getStoredTodo() {
      chrome.storage.sync.get(null, function (data) {
        if (data["list_panel"] !== undefined) {

          let savedLists = data["list_panel"];
          let savedTasks = data["task_panel"];
          let savedNumTodos = data["todo_num"];
          let savedNumLists = data["list_num"];

          numTodos = savedNumTodos;
          // console.log("num todo's from storage is " + savedNumTodos);
          numLists = savedNumLists;
          listPanel.html(savedLists);
          taskPanel.html(savedTasks);
          taskReveal();
          applySelectToggle();
          applyDelete();
          addNewList();
          addNewTask();
          renderTodoStatus();
        }


      });
    }

    getStoredTodo();

      function renderTodoStatus() {
        console.log("Todo status rendered");
        $(".todo-status").html(numTodos + " todos.");
      }

      function updateTodoStatus(isDelete) {
        if (!isDelete) {
          numTodos++;
        }
        if (isDelete) {
          numTodos--;
        }
        console.log("todo status updated to: " + numTodos + ". The type of numTodo is: " + typeof numTodos);
        renderTodoStatus();
      }

      function updateListNum(isDelete) {
        if (!isDelete) {
          numLists++;
        }
        if (isDelete) {
          numLists--;
        }

      }

    function applyDelete() {
      // .off() to prevent multiple listeners from being added to a single task
      $(".task-panel li").find(deleteIcons).off().on("click", function(e) {
        $(this).parent().fadeOut();
        updateTodoStatus(true);
      });
      // The delete hover function is stripped then reapplied to all li's for consistent handler application
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
        let prepUl = `<ul data-target="${numLists}" class="task-inactive"></ul>`;
        $(".task-panel").append(prepUl);
    }

    function taskReveal() {
      targetNum = $(".list-panel").find(".list-selected").attr("data-target");
      $(".task-panel ul").addClass("task-inactive");
      $(`ul[data-target=${targetNum}]`).removeClass("task-inactive");
    }

    function applySelectToggle() {
      $(".list-panel li").off().on("click", function(e){
        e.stopPropagation();
        $(".list-panel li").removeClass("list-selected");
        $(this).addClass("list-selected");
        taskReveal();
      });
    }

    // Adds new lists to list panel
    function addNewList() {
      $(".list-input").on("keydown", function(e) {
        if (event.which === 13) {
          // List's data-target# attribute == listNum
          updateListNum(false);
          console.log("Num of new list is " + numLists);

          let list = `<li data-target="${numLists}">${e.target.value}</li>`;
          // Append list to list panel
          $(".list-panel").find("ul").append(list);
          applySelectToggle();
          prepareTaskList();

          // Clear the input after user hits enter
          $(".list-input").val("");
        }
      });
    }

    addNewList();

      function addNewTask() {
        $(".task-input").on("keydown", function(event) {
          console.log("key press");
          if (event.which === 13) {
            let newItem =
              `<li class="task">
              <input type="checkbox">
              ${event.target.value}
              <span class="todo-delete hidden">x</span></li>`;

            $(".task-panel").find(`[data-target=${targetNum}]`).append(newItem);
            applyDelete();
            $(".task-input").val("");

            // Increases # tasks
            updateTodoStatus(false);
            storeTodo();
          }
        });
      }

    addNewTask();




    function storeTodo() {
      listPanel = $(".list-panel").html();
      taskPanel = $(".task-panel").html();
      console.log("Im storing this many todo's " + numTodos );
      chrome.storage.sync.set ({
        "list_panel": listPanel,
        "task_panel": taskPanel,
        "todo_num": numTodos,
        "list_num": numLists
      });
    }
  });
})();


