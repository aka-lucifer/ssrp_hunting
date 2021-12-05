const Menu = new Vue({
  el: "#menu",
  data: {
      // Important Data
      resource: "qb=hunting",
      visible: false,

      // Menu
      MenuPosition: "middle-right",
      MenuName: "Default",
      MenuComponents: [],
      MenuOption: 0
  },
  methods: {
      SetResourceData(data) {
          this.resource = data.resource;
      },
      OpenMenu(data) {
          this.MenuPosition = data.position;
          this.MenuName = data.name;
          this.MenuComponents = data.components;
          this.MenuOption = data.option;
          this.visible = true;
      },
      CloseMenu() {
          this.MenuName = "";
          this.MenuComponents = {};
          this.MenuOption = 0;
          this.visible = false;
      },
      SetMenuOption(data) {
          this.MenuOption = data.option;
          const element = document.getElementById(`${this.MenuOption}`);
          element.scrollIntoView();
      },
      SetCheckboxState(data) {
          const comp = this.GetMenuIndexById(data.id)
          if (comp != null) {
              this.MenuComponents[comp].state = data.state
          }
      },
      SetListItem(data) {
          this.MenuComponents.forEach(comp => {
              if (comp.index == data.index) {
                  comp.listIndex = data.listIndex
              }
          });
      },
      GetMenuIndexById(id) {
          for (let a = 0; a < this.MenuComponents.length; a++) {
              if (this.MenuComponents[a].index == id) {
                  return a
              }
          }
          return null;
      }
  },
  mounted() {
      RegisterEvent("set_resource_data", this.SetResourceData);
      RegisterEvent("open_menu", this.OpenMenu);
      RegisterEvent("close_menu", this.CloseMenu);
      RegisterEvent("set_menu_option", this.SetMenuOption);
      RegisterEvent("set_checkbox_state", this.SetCheckboxState);
      RegisterEvent("set_list_item", this.SetListItem);

      // setTimeout(function() {
      //     dragElement("drag_test_container");
      // }, 0);
  }
})

const ProgressBar = new Vue({
  el: "#progressBar",
  data: {
    // Element
    element: null,

    // Booleans
    running: false,

    // Dials
    customDial: false
  },

  methods: {
    ProcessProgress(data) {
      console.log("PROCESS DA TING!");
      if (data.display && !ProgressBar.running) {
        ProgressBar.customDial = new RadialProgress({
          r: data.radius,
          s: data.stroke,
          x: data.x,
          y: data.y,
          color: data.colour,
          bgColor: data.backgroundColour,
          rotation: data.rotation,
          maxAngle: data.maxAngle,
          progress: data.from,
          onStart: function() {
            ProgressBar.running = true;
  
            this.container.classList.add(`label-${data.LabelPosition}`);
            this.label.textContent = data.Label;
  
            ProgressBar.Post("progress_start")
          },
          
          onChange: function(progress, t, duration) {
            if (data.useTime) {
              this.indicator.style.fontSize = "18"; // Better Sized Overall
              this.indicator.textContent = `${((duration - t) / 1000).toFixed(1)}`;
            }
              
            if (data.usePercent) {
              this.indicator.textContent = `${Math.ceil(progress)}%`;
            }                
          },     
          
          onComplete: function () {
            this.indicator.textContent = "";
            this.label.textContent = "";
            this.container.classList.add("done");
            setTimeout(() => {
                this.remove();
            }, 1000)

            ProgressBar.Post("progress_complete");
              
            ProgressBar.running = false;
          }
        });
  
        ProgressBar.customDial.render(ProgressBar.element);
  
        ProgressBar.customDial.start(data.to, data.from, data.duration);
      } else if (data.stop && customDial) {
        ProgressBar.running = false;
        ProgressBar.customDial.stop();	
        ProgressBar.customDial = false;
        ProgressBar.Post("progress_stop");
      }
    },
    Post(type, object) {
      if (object === undefined) {	
        object = {};
      }

      $.post(`http://qb-hunting/${type}`, JSON.stringify(object));
    }
  },

  mounted() {
    this.element = document.getElementById("progressBar");
    window.addEventListener('message', function (event) {
      if (event.data.action == "update_label") {
        if (customDial) { // Using Custom Dial
          customDial.label.textContent = event.data.new_label;
        }
      }

      if (event.data.type == "create_progress") {
        ProgressBar.ProcessProgress(event.data.data);
      }
    });
  }
});