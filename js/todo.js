"use strict";
(function (){
  $(document).ready(function(){
    let targetNum;
    let allTasks = document.getElementsByClassName("task");
    let deleteIcons = document.getElementsByClassName("todo-delete");
    let todoInput = document.getElementById("todo-input");
    let addListBtn = document.getElementsByClassName("add-new-todo-list")[0];
    let taskPanel = $(".task-panel");
    let listPanel = $(".list-panel");
    let todoStatus = document.getElementsByClassName("todo-status")[0];
    let numTodos = 0;

      function renderTodoStatus() {
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


    function getStoredTodo() {
      chrome.storage.sync.get(null, function (data) {
        if (data["list_panel"] !== undefined) {

          let savedLists = data["list_panel"];
          let savedTasks = data["task_panel"];
          let savedNumTodos = data["todo_status"];

          listPanel.html(savedLists);
          taskPanel.html(savedTasks);
          todoStatus.innerHTML = savedNumTodos;

          addNewTask();
          addNewList();
          applySelectToggle();
          applyDelete();
        }
      });
    }

    getStoredTodo();

    function storeTodo() {
      listPanel = $(".list-panel").html();
      taskPanel = $(".task-panel").html();
      chrome.storage.sync.set ({
        "list_panel": listPanel,
        "task_panel": taskPanel,
        "todo_status": numTodos
      });
    }




  });
})();


