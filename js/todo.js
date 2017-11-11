"use strict";
(function (){
  $(document).ready(function(){
    let targetNum;
    let deleteIcons = $(".todo-delete");
    let taskPanel = $(".task-panel");
    let listPanel = $(".list-panel");
    let numTodos = 0;
    let numLists = 0;

    function todoHandler() {
      // All event handlers to be added to dynamically created elements
      applyCheck();
      applyDelete();
      addNewList();
      addNewTask();
      applySelectToggle();
      renderTodoStatus();
      taskReveal();
      deleteHover();
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
      // Content html string is stored when applyDelete(), addTask(), addList() fires
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

      function deleteCascade(e) {
      // Finds the corresponsing task list via data-target, counts the number of tasks and adjusts the numOfTasks var
        targetNum = $(e.target).parent().attr("data-target");
        let taskNumToDelete = $(`ul[data-target=${targetNum}]`).find(".task").length;
        numTodos -= taskNumToDelete;
        renderTodoStatus();
        $(`ul[data-target=${targetNum}]`).remove();
      }
    function applyDelete() {
      // .off() to prevent multiple listeners from being added to a single task
      $(".item").find(".todo-delete").off().on("click", function(e) {
        deleteCascade(e);
        // Prevents todoNum from being altered by deleting a list
        if(!$(e.target).parent().hasClass("list")) {
          updateTodoStatus(true);
        } else {
          updateListNum(true);
        }
        e.stopPropagation();
        $(e.target).parent().fadeOut();
        storeTodo();
      });
      // The delete hover function is stripped then reapplied to all li's for consistent application of event handlers
      deleteHover();
    }

    function deleteHover() {
      function handlerIn() {
        console.log("hover");
        $(this).find(".todo-delete").removeClass("hidden");
      }
      function handlerOut() {
        $(this).find(".todo-delete").addClass("hidden");
      }
      $(".item").hover(handlerIn, handlerOut);
    }

    function applyCheck() {
      let check = (e) => {
        // consistent behavior when user clicks either the task value or the checkbox
        let target = $(e.target);
        if(!target.is(":checked")){
          target.prop("checked", false);
          target.parent().toggleClass("checked", "");
        }else {
          target.prop("checked", true);
          target.parent().toggleClass("checked", "");
        }
      };

      $(".task > input").off().on("click", check);
    }

    function taskReveal() {
      // The lists on the left panel are linked to the tasks on the right panel via data-target
      targetNum = $(".list-panel").find(".list-selected").attr("data-target");
      $(".task-panel ul").addClass("inactive");
      $(`ul[data-target=${targetNum}]`).removeClass("inactive");
    }

    function applySelectToggle() {
      $(".list-panel li").off().on("click", function(e){
        $(".list-panel li").removeClass("list-selected");
        $(this).addClass("list-selected");
        taskReveal();
      });
    }

    // Adds new lists to list panel
    function addNewList() {
      $(".list-input").off().on("keydown", function(e) {
        if (event.which === 13) {
          // List's data-target# attribute == listNum
          updateListNum(false);

          // Removes selected class from all li's so newest list is selected
          $(".list-panel li").removeClass("list-selected");
          let list = `<label><li data-target="${numLists}" class="item list list-selected">${e.target.value}
          <span class="todo-delete hidden">x</span>
          </li></label>`;


          // Append list to list panel
          $(".list-panel").find("ul").prepend(list);
          applySelectToggle();
          applyDelete();

          // Append an empty ul with matching data-target to task panel
          $(".task-panel").append(`<ul data-target="${numLists}"></ul>`);
          taskReveal();

          // Clear the input after user hits enter
          $(".list-input").val("");

          storeTodo();
        }
      });
    }

    addNewList();

      function addNewTask() {
        $(".task-input").off().on("keydown", function(e) {
          if (e.which === 13) {
            let newItem =
              `<label><li class="item task">
              <input type="checkbox">
              ${e.target.value}
              <span class="todo-delete hidden">x</span></li></label>`;

            $(".task-panel").find(`[data-target=${targetNum}]`).append(newItem);
            applyDelete();
            applyCheck();
            $(".task-input").val("");

            // Increases # tasks
            updateTodoStatus(false);
            storeTodo();
          }
        });
      }

    addNewTask();

    function activateTodo() {
      $(".activate-todo").on("click", function(e){
        $(".todo-slider").slideToggle("slow");
      });
    }
    activateTodo();

  });
})();


