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

    function todoHandler() {
      // All event handlers to be added to dynamically created elements

      applyDelete();
      addNewList();
      addNewTask();
      applySelectToggle();
      renderTodoStatus();
      taskReveal();
    }

    function getStoredTodo() {
      chrome.storage.sync.get(null, function (data) {
        if (data["task_panel"] !== undefined) {

          let savedLists = data["list_panel"];
          let savedTasks = data["task_panel"];
          let savedNumTodos = data["todo_num"];
          let savedNumLists = data["list_num"];

          listPanel.html(savedLists);
          numLists = savedNumLists;
          numTodos = savedNumTodos;
          taskPanel.html(savedTasks);
        }
          todoHandler();
      });
    }
    getStoredTodo();

    function storeTodo() {
      // Content html string is stored when applyDelete() and addTask() fires
      // TODO: store content when tab is closed
      listPanel = $(".list-panel").html();
      taskPanel = $(".task-panel").html();
      chrome.storage.sync.set ({
        "list_panel": listPanel,
        "task_panel": taskPanel,
        "todo_num": numTodos,
        "list_num": numLists
      });
    }

      function renderTodoStatus() {
        $(".todo-status").html(numTodos + " todos");
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
      // The delete hover function is stripped then reapplied to all li's for consistent application of event handlers
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


    function prepareTaskList(){
      // Adds a hidden ul to task panel
        $(".task-panel").append(`<ul data-target="${numLists}" class="task-inactive"></ul>`);
    }

    function taskReveal() {
      // The lists on the left panel are linked to the tasks on the right panel via data-target
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
        $(".task-input").off().on("keydown", function(event) {
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
  });
})();


