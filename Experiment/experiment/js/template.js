$( document ).ready(function() {
    console.log( "ready!" );
    var clickedToyA = false;
    var clickedToyB = false;
    // decrease opacity 
    $(function(){
      $(".toy-btn").hover(function(){
          $( this ).css({"opacity": ".6"});
      },function(){
          $( this ).css({"opacity": "1"});
      });
    });

    $("#redbtn").click(function() {
      if (clickedToyA) {
        console.log("redbtn clicked, toy unactivated");
        $("#unactivatedToyA").attr("src","images/toys/unactivatedToyA.jpg");
        clickedToyA = false;
      } else {
        console.log("redbtn clicked, toy activated");
        $("#unactivatedToyA").attr("src","images/toys/activatedToyA.jpg");
        clickedToyA = true;
      }
    });
    $("#yellowbtn4").click(function() {
      if (clickedToyB) {
        console.log("yellowbtn clicked, toy unactivated");
        $("#unactivatedToyB").attr("src","images/toys/unactivatedToyB.jpg");
        clickedToyB = false;
      } else {
        console.log("yellowbtn clicked, toy activated");
        $("#unactivatedToyB").attr("src","images/toys/activatedToyB.jpg");
        clickedToyB = true;
      }
    });
});



function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.single_trial = slide({
    name : "single_trial",
    // start : function() {
      // might want the manipulation here, as well as a start time and end time to keep track of
      // how long it takes for them to explore the toy
    // }
    button : function() {
      exp.go();
    }

  });

  slides.response_trial = slide({
    name: "response_trial",
    
    start: function() {
      $(".err").hide();
      $(".err2").hide();
      this.startTime = Date.now();
      // $("#manipulation").html("Manipulation: toys are <b>" + exp.condition + "</b>.");
    },
    
    buttonToyA : function() {
      // response_red = $("#text_response_red").val();
      // response_green = $("#text_response_green").val();
      // response_purple = $("#text_response_purple").val();
      // response_blue = $("#text_response_blue").val();

      // if ($("#text_response_red").val().length == 0 || $("#text_response_green").val().length == 0 || 
      // $("#text_response_purple").val().length == 0 || $("#text_response_blue").val().length == 0) {
      //   $(".err").show();
      // } else {
      // if (!(($("#text_response_red").val()!='' && $("#text_response_red").val()>=0 && $("#text_response_red").val()<=100) &&
      // ($("#text_response_green").val()!='' && $("#text_response_green").val()>=0 && $("#text_response_green").val()<=100) &&
      // ($("#text_response_purple").val()!='' && $("#text_response_purple").val()>=0 && $("#text_response_purple").val()<=100) &&
      // ($("#text_response_blue").val()!='' && $("#text_response_blue").val()>=0 && $("#text_response_blue").val()<=100))) {
      //   $(".err2").show();
      //   $(".err").hide();
      // } else {
      	 this.endTime = Date.now()
      	 this.rt = (this.endTime - this.startTime)/1000;
        exp.data_trials.push({
          "trial_type" : "subject_responses",
          "response": "toyA",
          "rt_in_seconds": this.rt
        });
        exp.toy_taught = "toyA";
        exp.go(); //make sure this is at the *end*, after you log your data
    },
    buttonToyB : function() {
      // response_red = $("#text_response_red").val();
      // response_green = $("#text_response_green").val();
      // response_purple = $("#text_response_purple").val();
      // response_blue = $("#text_response_blue").val();

      // if ($("#text_response_red").val().length == 0 || $("#text_response_green").val().length == 0 || 
      // $("#text_response_purple").val().length == 0 || $("#text_response_blue").val().length == 0) {
      //   $(".err").show();
      // } else {
      // if (!(($("#text_response_red").val()!='' && $("#text_response_red").val()>=0 && $("#text_response_red").val()<=100) &&
      // ($("#text_response_green").val()!='' && $("#text_response_green").val()>=0 && $("#text_response_green").val()<=100) &&
      // ($("#text_response_purple").val()!='' && $("#text_response_purple").val()>=0 && $("#text_response_purple").val()<=100) &&
      // ($("#text_response_blue").val()!='' && $("#text_response_blue").val()>=0 && $("#text_response_blue").val()<=100))) {
      //   $(".err2").show();
      //   $(".err").hide();
      // } else {
         this.endTime = Date.now()
         this.rt = (this.endTime - this.startTime)/1000;
        exp.data_trials.push({
          "trial_type" : "subject_responses",
          "response" : "toyB",
          "rt_in_seconds": this.rt
        });
        exp.toy_taught = "toyB";
        exp.go(); //make sure this is at the *end*, after you log your data
      // }}
    },
  });

// slides.color_check = slide({
// 	name: "color_check",
// 	start: function () {
// 		$(".err3").hide();
// 	},
// 	button : function() {
	
// 	response_color_red = $("#text_response_color_red").val();
// 	response_color_green = $("#text_response_color_green").val();
// 	response_color_purple = $("#text_response_color_purple").val();
// 	response_color_blue = $("#text_response_color_blue").val();
// 	debugger;

// 	if (($("#text_response_color_red").val().length == 0 || isNaN($("#text_response_color_red").val()) == false) || 
// 	($("#text_response_color_green").val().length == 0 || isNaN($("#text_response_color_green").val()) == false) || 
//       ($("#text_response_color_purple").val().length == 0 || isNaN($("#text_response_color_purple").val()) == false) || 
//       ($("#text_response_color_blue").val().length == 0 || isNaN($("#text_response_color_blue").val()) == false)) {
//         $(".err3").show();
//         } else {
//         exp.data_trials.push({
//           "trial_type" : "color_check",
//           "response_color_red" : response_color_red,
//           "response_color_green" : response_color_green,
//           "response_color_purple" : response_color_purple,
//           "response_color_blue" : response_color_blue  
//         });
//         exp.go(); //make sure this is at the *end*, after you log your data
//       }
//     },
//   });

slides.teach_explanation =  slide({
    name : "teach_explanation",
    start: function() {
      console.log(exp.condition);
      console.log(exp.toy_taught);
      if (exp.toy_taught == "toyA") {
        console.log("Subject chose Toy A");
        $("#toy_taught_img").attr("src","images/toys/teachToyA.jpg");
      } else {
        console.log("Subject chose Toy B");
        $("#toy_taught_img").attr("src","images/toys/teachToyB.jpg");
      }
    
     },
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      
      exp.why_data = $("#teach_explanation_response").val();
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

 slides.hard_choice = slide({
    name : "hard_choice",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    //present : [
      //{subject: "dog", object: "ball"},
      //{subject: "cat", object: "windowsill"},
      //{subject: "bird", object: "shiny object"},
   // ],

    //this gets run only at the beginning of the block
    start : function() {
     $(".err").hide();

      // this.stim = stim; //I like to store this information in the slide so I can record it later.


      //$(".prompt").html(stim.subject + "s like " + stim.object + "s.");
      this.init_sliders();
      exp.sliderPost = null; //erase current slider value
    },

    button : function() {
      if (exp.sliderPost == null) {
        $(".err").show();
      } else {
        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }
    },

    init_sliders : function() {
      utils.make_slider("#single_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "hard_choice",
        "response" : exp.sliderPost
      });
    }
  });
  
   slides.cool_choice = slide({
    name : "cool_choice",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    //present : [
      //{subject: "dog", object: "ball"},
      //{subject: "cat", object: "windowsill"},
      //{subject: "bird", object: "shiny object"},
   // ],

    //this gets run only at the beginning of the block
   present_handle : function(stim) {
     $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.


      //$(".prompt").html(stim.subject + "s like " + stim.object + "s.");
      this.init_sliders();
      exp.sliderPost = null; //erase current slider value
    },

    button : function() {
      if (exp.sliderPost == null) {
        $(".err").show();
      } else {
        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }
    },

    init_sliders : function() {
      utils.make_slider("#cool_choice", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "cool_choice",
        "response" : exp.sliderPost
      });
    }
  });
  
  
  
  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        // colorblind : $('input[name="colorblind"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "teach_explanation" : exp.why_data,
          // "toy_taught": exp.toy_choice,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000,
          "fingerprintData" : fingerprint
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = "lowcosthighvaltoyA_highcostlowvaltoyB";
  // exp.condition = _.sample(["eqc_uneqv", "hclv_lchv"])
  // exp.condition = _.sample(["the red", "the purple", "another"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "single_trial", "response_trial", "teach_explanation", "hard_choice", "cool_choice", 'subj_info', 'thanks'];
  // exp.structure=["i0", "instructions", "single_trial", "response_trial", "teach_explanation", 'subj_info', 'thanks'];
  exp.toy_taught = "";
  
  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);
  $('.slide').hide(); //hide everything

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined


  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide

}







