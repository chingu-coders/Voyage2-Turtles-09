(function (){
  "use strict";
  $(document).ready(function(){
    let targetNum;
    let newTargetNumber;
    let taskPanel = $(".task-panel");
    let listPanel = $(".list-panel");
    let numTodos = 0;
    let numLists = 0;
    let listNumsArr = [];

    activateTodo();
    todoHandler();
    addNewList();
    addNewTask();

    function activateTodo() {
      $(".activate-todo").on("click", function(e){
        $(".todo-slider").slideToggle("slow");
      });
    }

    function dayElapsed(timeConstraint) {
      let currentTimeStamp = Date.now();
      let flag;
      chrome.storage.sync.get("todo_time_stamp", function(data) {
        let prevTimeStamp = data["todo_time_stamp"];
        // Querying local storage first to see if last time is available
        if (prevTimeStamp !== undefined) {
          // Checking if 30s have elapsed since the time recorded in storage
          if (currentTimeStamp >= timeConstraint) {
            //* Updating the previous time stamp in storage to the current time
            prevTimeStamp = currentTimeStamp;
            chrome.storage.sync.set({"todo_time_stamp": prevTimeStamp});
            flag = true;
            chrome.storage.sync.set({"day_elapsed": flag});
          } else {
            flag = false;
            chrome.storage.sync.set({"day_elapsed": flag});
          }
        } else {
          // If there is no timestamp, current time is stored
          prevTimeStamp = currentTimeStamp;
          flag = false;
          chrome.storage.sync.set({"todo_time_stamp": prevTimeStamp, "day_elapsed": flag});
        }
      });
    }

    function storeTodo() {
      listPanel = $(".list-panel").html();
      taskPanel = $(".task-panel").html();
      chrome.storage.sync.set ({
        "todo": {
          "list_panel": listPanel,
          "task_panel": taskPanel,
          "todo_num": numTodos,
          "list_num": numLists,
          "list_nums_arr": listNumsArr
        }
      });
    }

    function getStoredTodo() {
      chrome.storage.sync.get(null, function (data) {
        if (data["todo"] !== undefined) {

          let savedLists = data["todo"]["list_panel"];
          let savedTasks = data["todo"]["task_panel"];
          let savedNumTodos = data["todo"]["todo_num"];
          let savedNumLists = data["todo"]["list_num"];
          let savedListNumsArr = data["todo"]["list_nums_arr"] || [];

          listPanel.html(savedLists);
          numLists = savedNumLists;
          numTodos = savedNumTodos;
          taskPanel.html(savedTasks);
          listNumsArr = savedListNumsArr;
          // All event handlers to be added to dynamically created elements
          applyCheck();
          applyDelete();
          deleteList();
          addNewList();
          addNewTask();
          applyDefaultListSelect();
          applySelectToggle();
          renderTodoStatus();
          taskReveal();
          deleteHover();
        }
      });
    }

    function todoHandler() {
      let time = new Date(new Date().setHours(24,0,0,0));
      dayElapsed(time);
      // The day elapsed flag is set on page load. The first storage 'get' request returns the old flag, the second
      // gets the updated flag
      chrome.storage.sync.get(null, function() {
        chrome.storage.sync.get(null, function(data) {
          if(data["day_elapsed"]) {
            deleteTodo();
          } else {
            getStoredTodo();
          }
        });
      });
    }

    function deleteTodo() {
      chrome.storage.sync.get(null, function(){
        chrome.storage.sync.remove("todo", function() {
        });
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

    function updateListNum(isDelete, e) {
      if (!isDelete) {
        numLists++;
        listNumsArr.push(newTargetNumber);
      }
      if (isDelete) {
        numLists--;
        // TODO remove list number from array
        listNumsArr = listNumsArr.filter(function(num) {
          return num != $(e.target).parent().attr("data-target");
        });
      }
    }

    function deleteCascade(e) {
      // List name is linked to it's corresponding <ul> via same data-target num
      targetNum = $(e.target).parent().attr("data-target");
      let linkedList = $(`ul[data-target=${targetNum}]`);
      let numTodosToDelete = linkedList.find(".task").length;
      numTodos -= numTodosToDelete;
      linkedList.remove();
      renderTodoStatus();
    }

    function applyDefaultListSelect() {
      $(".list-panel").find("li[data-target='general']").addClass("list-selected");
      taskReveal();
    }

    function deleteHover() {
      function handlerIn() {
        $(this).find(".delete").removeClass("hidden");
      }
      function handlerOut() {
        $(this).find(".delete").addClass("hidden");
      }
      $(".item").hover(handlerIn, handlerOut);
    }

    function applyDelete() {
      // .off() prevents multiple listeners from being added to a single task
      $(".task").find(".todo-delete").off().on("click", function(e) {
        updateTodoStatus(true);
        $(e.target).parent().fadeOut().remove();
        // Save to storage
        storeTodo();
      });
      deleteHover();
    }

    function deleteList() {
      $(".list").find(".list-delete").off().on("click", function(e) {
        e.stopPropagation();
        deleteCascade(e);
        $(e.target).parent().fadeOut(function(){
          // Only switch to the general list if the list
          // being deleted has the "list-selected" class.
          if ($(e.target).parent().hasClass("list-selected")) {
            applyDefaultListSelect();
          }
        }).remove();
        updateListNum(true, e);
        // Save to storage
        storeTodo();
      });
      deleteHover();
    }

    function applyCheck() {
      let check = (e) => {
        // consistent behavior when user clicks either the task value or the checkbox
        let target = $(e.target);
        if(!target.is(":checked")){
          target.attr("checked", false);
          target.parent().toggleClass("checked", "");
        }else {
          target.attr("checked", true);
          target.parent().toggleClass("checked", "");
        }
        // Save to storage
        storeTodo();
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

    function addNewList() {
      $(".list-input").off().on("keydown", function(e) {
        if (event.which === 13 && e.target.value.trim() !== "") {

          // Removes selected class from all li's so newest list is selected
          $(".list-panel li").removeClass("list-selected");
          newTargetNumber = getNewTargetNumber();
          let list = `
            <li data-target="${newTargetNumber}" class="item list list-selected">${e.target.value}
            <span class="delete list-delete hidden">x</span>
            </li>`;

          updateListNum(false);

          // Append list to list panel
          $(".list-panel").find("ul").prepend(list);
          applySelectToggle();
          deleteList();

          // Append an empty ul with matching data-target to task panel
          $(".task-panel").append(`<ul data-target="${newTargetNumber}"></ul>`);
          taskReveal();

          // Save to storage
          storeTodo();

          // Clear the input after user hits enter
          $(".list-input").val("");
        }
      });
    }

    function getNewTargetNumber() {
      if (listNumsArr.length === 0) {
        return 1;
      }
      else {
        newTargetNumber = 1;
        // find largest num in array, and make next newTargetNumber 1 higher
        for (let i = 0; i < numLists; i++) {
          if (listNumsArr[i] >= newTargetNumber) {
            newTargetNumber = listNumsArr[i] + 1;
          }
        }
        return newTargetNumber;
      }
    }

    function addNewTask() {
      $(".task-input").off().on("keydown", function(e) {
        if (e.which === 13 && e.target.value.trim() !== "") {
          let newItem =
            `<li class="item task">
            <input type="checkbox">
            ${e.target.value}
            <span class="delete todo-delete hidden">x</span></li>`;
          if(targetNum === undefined || targetNum === 0) {
            $(".task-panel").find(`[data-target="general"]`).append(newItem);
          } else {
            $(".task-panel").find(`[data-target=${targetNum}]`).append(newItem);
          }
          applyDelete();
          applyCheck();
          $(".task-input").val("");

          // Increases # tasks
          updateTodoStatus(false);

          // Save to storage
          storeTodo();
        }
      });
    }

  });
})();
