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

  slides.display_toys = slide({
    name : "display_toys",
    start : function() {
      $("#display_ToyA").attr("src",exp.unactivatedToyA_img);
      $("#display_ToyB").attr("src",exp.unactivatedToyB_img);
      console.log(exp.unactivatedToyA_img);
      console.log(exp.unactivatedToyB_img);
    },
    button : function() {
      exp.go();
    }
  });

  slides.explore_toyA = slide({
    name: "explore_toyA",
    start : function() {
      $(".err").hide();
      this.startTime = Date.now();

      $("#unactivated_ToyA").attr("src",exp.unactivatedToyA_img);
      if (exp.conditionToyA[0] == 'L') {
        init_lowCostButtonToyA();
        init_buttonstyle();
        init_lowCostButtonClickToyA();
      } else {
        init_highCostButtonsToyA();
        init_buttonstyle();
        init_highCostButtonClickToyA();
      }
    },
    button : function() {
      if (exp.activatedToyA) {
        this.endTime = Date.now()
        this.rt = (this.endTime - this.startTime)/1000;
        exp.data_trials.push({
        "trial_type" : "explore_ToyA",
        "rt_in_seconds": this.rt
        });
        exp.go();
      } else {      
        $(".err").show();
      }
    }
  });

  slides.catch_trial_toyA =  slide({
    name : "catch_trial_toyA",
    start: function() {
      $(".err").hide();
      this.startTime = Date.now();
      $("#catch_ToyA").attr("src",exp.unactivatedToyA_img);
      if (exp.conditionToyA[0] == 'L') {
        init_catchLowCostButtonsToyA();
      } else {
        init_catchHighCostButtonsToyA();
      }

     },
    button : function(){
      this.endTime = Date.now()
      this.rt = (this.endTime - this.startTime)/1000;
      this.response = $("#how_toyA_works").val();
      // console.log(this.response)
      if (this.response != '' && this.response > 0 && this.response <= 10) {
        exp.catch_trials.push({
        "condition" : "catch_toyA",
        "response": this.response,
        "rt_in_seconds" : this.rt });
        exp.go(); //use exp.go() if and only if there is no "present" data.
       
      } else {
        console.log("Catch trial: bad response given.")
        $(".err").show();
      }
    }
  });

   slides.explore_toyB = slide({
    name: "explore_toyB",
    start : function() {
      $(".err").hide();
      this.startTime = Date.now();

      $("#unactivated_ToyB").attr("src",exp.unactivatedToyB_img);
      if (exp.conditionToyB[0] == 'L') {
        init_lowCostButtonToyB();
        init_buttonstyle();
        init_lowCostButtonClickToyB();
      } else {
        init_highCostButtonsToyB();
        init_buttonstyle();
        init_highCostButtonClickToyB();
      }
    },
    button : function() {
      if (exp.activatedToyB) {
        this.endTime = Date.now()
        this.rt = (this.endTime - this.startTime)/1000;
        exp.data_trials.push({
        "trial_type" : "explore_ToyB",
        "rt_in_seconds": this.rt
        });
        exp.go();
      } else {      
        $(".err").show();
      }
    }
  });

  slides.catch_trial_toyB =  slide({
    name : "catch_trial_toyB",
    start: function() {
      $(".err").hide();
      this.startTime = Date.now();
      $("#catch_ToyB").attr("src",exp.unactivatedToyB_img);
      if (exp.conditionToyB[0] == 'L') {
        init_catchLowCostButtonsToyB();
      } else {
        init_catchHighCostButtonsToyB();
      }

     },
    button : function(){
      this.endTime = Date.now()
      this.rt = (this.endTime - this.startTime)/1000;
      this.response = $("#how_toyB_works").val();
      if (this.response != '' && this.response > 0 && this.response <= 10) {
        exp.catch_trials.push({
        "condition" : "catch_toyB",
        "response": this.response,
        "rt_in_seconds" : this.rt });
        exp.go(); //use exp.go() if and only if there is no "present" data.
       
      } else {
        console.log("Bad response given.")
        $(".err").show();
      }
    }
  });

  // Response is 2AFC
  slides.response_trial = slide({
    name: "response_trial",
    
    start: function() {
      $(".err").hide();
      $(".err2").hide();
      this.startTime = Date.now();
      $("#choose_ToyA").attr("src",exp.activatedToyA_img);
      $("#choose_ToyB").attr("src",exp.activatedToyB_img);
      // $("#manipulation").html("Manipulation: toys are <b>" + exp.condition + "</b>.");
    },
    
    buttonToyA : function() {
      	 this.endTime = Date.now()
      	 this.rt = (this.endTime - this.startTime)/1000;
        exp.data_trials.push({
          "trial_type" : "subject_responses",
          "response": "toyA",
          "rt_in_seconds": this.rt
        });
        exp.toy_taught = "Toy A";
        exp.go(); //make sure this is at the *end*, after you log your data
    },
    buttonToyB : function() {
        this.endTime = Date.now()
        this.rt = (this.endTime - this.startTime)/1000;
        exp.data_trials.push({
          "trial_type" : "subject_responses",
          "response" : "toyB",
          "rt_in_seconds": this.rt
        });
        exp.toy_taught = "Toy B";
        exp.go(); //make sure this is at the *end*, after you log your data
      // }}
    },
  });

slides.confidence_level = slide({
    name : "confidence_level",

   start : function(stim) {
      $(".err").hide();
      this.startTime = Date.now();
      var prompt = "How confident are you in your choice to teach " + exp.toy_taught + "?";
      $("#conf_prompt").text(prompt);
      if (exp.toy_taught == "Toy A") {
        console.log("Subject chose Toy A");
        $("#confidence_img").attr("src",exp.teachToyA_img);
      } else {
        console.log("Subject chose Toy B");
        $("#confidence_img").attr("src",exp.teachToyB_img);
      }
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
        exp.go();
      }
    },

    init_sliders : function() {
      utils.make_slider("#confidence_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      this.endTime = Date.now()
      this.rt = (this.endTime - this.startTime)/1000;
      exp.data_trials.push({
        "trial_type" : "confidence_level",
        "response" : exp.sliderPost,
        "rt_in_seconds": this.rt
      });
    }
  });
slides.teach_explanation =  slide({
    name : "teach_explanation",
    start: function() {
      $(".err").hide();
      this.startTime = Date.now();

      console.log(exp.condition);
      console.log(exp.toy_taught);
      if (exp.toy_taught == "Toy A") {
        console.log("Subject chose Toy A");
        $("#toy_taught_img").attr("src",exp.teachToyA_img);
      } else {
        console.log("Subject chose Toy B");
        $("#toy_taught_img").attr("src",exp.teachToyB_img);
      }
    
     },
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      this.endTime = Date.now()
      this.rt = (this.endTime - this.startTime)/1000;
      this.response = $("#teach_explanation_response").val();

      if (this.response == "") {
        console.log("No response given.")
        $(".err").show();
      } else {
        exp.why_data = {
        "response": this.response,
        "rt_in_seconds" : this.rt };
        exp.go(); //use exp.go() if and only if there is no "present" data.
      }
    }
  });

 slides.hard_choice = slide({
    name : "hard_choice",

    start : function() {
    $(".err").hide();
    this.startTime = Date.now();      
    $("#hardchoice_ToyA").attr("src",exp.activatedToyA_img);
    $("#hardchoice_ToyB").attr("src",exp.activatedToyB_img);

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
        exp.go();
      }
    },

    init_sliders : function() {
      utils.make_slider("#hard_choice_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      this.endTime = Date.now()
      this.rt = (this.endTime - this.startTime)/1000;
      exp.data_trials.push({
        "trial_type" : "hard_choice",
        "response" : exp.sliderPost,
        "rt_in_seconds": this.rt
      });
    }
  });
  
   slides.cool_choice = slide({
    name : "cool_choice",
   start : function(stim) {
     $(".err").hide();
    this.startTime = Date.now();
    $("#coolchoice_ToyA").attr("src",exp.activatedToyA_img);
    $("#coolchoice_ToyB").attr("src",exp.activatedToyB_img);
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
        exp.go();
      }
    },

    init_sliders : function() {
      utils.make_slider("#cool_choice_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      this.endTime = Date.now()
      this.rt = (this.endTime - this.startTime)/1000;
      exp.data_trials.push({
        "trial_type" : "cool_choice",
        "response" : exp.sliderPost,
        "rt_in_seconds": this.rt
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

function init_buttonstyle(){
  $(".toy-btn").hover(function(){
      $( this ).css({"opacity": ".6"});
  },function(){
      $( this ).css({"opacity": "1"});
  });
}

function init_lowCostButtonClickToyA(){
 $("#redbtn").click(function() {
    console.log("redbtn clicked, toy activated");
    $("#unactivated_ToyA").attr("src",exp.activatedToyA_img);
    setTimeout(function(){$("#unactivated_ToyA").attr("src",exp.unactivatedToyA_img);},380);
    exp.activatedToyA = true;
    $(".err").hide();
  });
}
function init_lowCostButtonClickToyB(){
 $("#yellowbtn").click(function() {
    console.log("yellow btn clicked, toy activated");
    $("#unactivated_ToyB").attr("src",exp.activatedToyB_img);
    setTimeout(function(){$("#unactivated_ToyB").attr("src",exp.unactivatedToyB_img);},380);
    exp.activatedToyB = true;
    $(".err").hide();
  });
}

function init_catchLowCostButtonsToyA() {
  console.log("initialize catch trial lc buttons for Toy A");
  $("#catch_ToyA_div").html("<img src='images/toys/redbutton1.png' width=50>");
}
function init_catchHighCostButtonsToyA() {
  console.log("initialize catch trial hc buttons for Toy A");
  $("#catch_ToyA_div").html("<div class='toy-div-btn-panel'><table><tr><td><img src='images/toys/redbutton1.png' width=50></td><td><img src='images/toys/redbutton2.png' width=50></td><td><img src='images/toys/redbutton3.png' width=50></td><td><img src='images/toys/redbutton4.png' width=50></td><td><img src='images/toys/redbutton5.png' width=50></td></tr><tr><td><img src='images/toys/redbutton6.png' width=50></td><td><img src='images/toys/redbutton7.png' width=50></td><td><img src='images/toys/redbutton8.png' width=50></td><td><img src='images/toys/redbutton9.png' width=50></td><td><img src='images/toys/redbutton10.png' width=50></td></tr></table></div>");
}
function init_catchLowCostButtonsToyB() {
  console.log("initialize catch trial lc buttons for Toy B");
  $("#catch_ToyB_div").html("<img src='images/toys/yellowbutton1.png' width=50>");
}

function init_catchHighCostButtonsToyB() {
  console.log("initialize catch trial hc buttons for Toy B");
  $("#catch_ToyB_div").html("<div class='toy-div-btn-panel'><table><tr><td><img src='images/toys/yellowbutton1.png' width=50></td><td><img src='images/toys/yellowbutton2.png' width=50></td><td><img src='images/toys/yellowbutton3.png' width=50></td><td><img src='images/toys/yellowbutton4.png' width=50></td><td><img src='images/toys/yellowbutton5.png' width=50></td></tr><tr><td><img src='images/toys/yellowbutton6.png' width=50></td><td><img src='images/toys/yellowbutton7.png' width=50></td><td><img src='images/toys/yellowbutton8.png' width=50></td><td><img src='images/toys/yellowbutton9.png' width=50></td><td><img src='images/toys/yellowbutton10.png' width=50></td></tr></table></div>");
}

function init_lowCostButtonToyA() {
  console.log("initializing low cost button for Toy A");
  $("#explore_ToyA_div").html("<img class='toy-btn' id='redbtn' src='images/toys/redbutton1.png' width=50>");
}
function init_lowCostButtonToyB() {
  console.log("initializing low cost button for Toy B");
  $("#explore_ToyB_div").html("<img class='toy-btn' id='yellowbtn' src='images/toys/yellowbutton1.png' width=50>");
}

function init_highCostButtonClickToyB() {
    $("#yellowbtn4").click(function() {
    console.log("yellowbtn clicked, toy activated");
    $("#unactivated_ToyB").attr("src",exp.activatedToyB_img);
    setTimeout(function(){$("#unactivated_ToyB").attr("src",exp.unactivatedToyB_img);},380);
    exp.activatedToyB = true;
    $(".err").hide();
  });
}
function init_highCostButtonClickToyA() {
  $("#redbtn4").click(function() {
    console.log("redbtn clicked, toy activated");
    $("#unactivated_ToyA").attr("src",exp.activatedToyA_img);
    setTimeout(function(){$("#unactivated_ToyA").attr("src",exp.unactivatedToyA_img);},380);
    exp.activatedToyA= true;
    $(".err").hide();
  });
}

function init_highCostButtonsToyB() {
  console.log("initializing hc buttons for Toy B");
  // $("#explore_ToyB_div").html("<div class='toy-div-btn-panel'><table><tr><td><img class='toy-btn' id='yellowbtn1' src='images/toys/yellowbutton.png' width=50></td><td><img class='toy-btn' id='yellowbtn2' src='images/toys/yellowbutton.png' width=50></td><td><img class='toy-btn' id='yellowbtn3' src='images/toys/yellowbutton.png' width=50></td><td><img class='toy-btn' id='yellowbtn4' src='images/toys/yellowbutton.png' width=50></td><td><img class='toy-btn' id='yellowbtn5' src='images/toys/yellowbutton.png' width=50></td></tr><tr><td><img class='toy-btn' id='yellowbtn6' src='images/toys/yellowbutton.png' width=50></td><td><img class='toy-btn' id='yellowbtn7' src='images/toys/yellowbutton.png' width=50></td><td><img class='toy-btn' id='yellowbtn8' src='images/toys/yellowbutton.png' width=50></td><td><img class='toy-btn' id='yellowbtn9' src='images/toys/yellowbutton.png' width=50></td><td><img class='toy-btn' id='yellowbtn10' src='images/toys/yellowbutton.png' width=50></td></tr></table></div>");
  $("#explore_ToyB_div").html("<div class='toy-div-btn-panel'><table><tr><td><img class='toy-btn' id='yellowbtn1' src='images/toys/yellowbutton1.png' width=50></td><td><img class='toy-btn' id='yellowbtn2' src='images/toys/yellowbutton2.png' width=50></td><td><img class='toy-btn' id='yellowbtn3' src='images/toys/yellowbutton3.png' width=50></td><td><img class='toy-btn' id='yellowbtn4' src='images/toys/yellowbutton4.png' width=50></td><td><img class='toy-btn' id='yellowbtn5' src='images/toys/yellowbutton5.png' width=50></td></tr><tr><td><img class='toy-btn' id='yellowbtn6' src='images/toys/yellowbutton6.png' width=50></td><td><img class='toy-btn' id='yellowbtn7' src='images/toys/yellowbutton7.png' width=50></td><td><img class='toy-btn' id='yellowbtn8' src='images/toys/yellowbutton8.png' width=50></td><td><img class='toy-btn' id='yellowbtn9' src='images/toys/yellowbutton9.png' width=50></td><td><img class='toy-btn' id='yellowbtn10' src='images/toys/yellowbutton10.png' width=50></td></tr></table></div>");

}
function init_highCostButtonsToyA() {
  console.log("initializing hc buttons for Toy A");
  // $("#explore_ToyA_div").html("<div class='toy-div-btn-panel'><table><tr><td><img class='toy-btn' id='redbtn1' src='images/toys/redbutton.png' width=50></td><td><img class='toy-btn' id='redbtn2' src='images/toys/redbutton.png' width=50></td><td><img class='toy-btn' id='redbtn3' src='images/toys/redbutton.png' width=50></td><td><img class='toy-btn' id='redbtn4' src='images/toys/redbutton.png' width=50></td><td><img class='toy-btn' id='redbtn5' src='images/toys/redbutton.png' width=50></td></tr><tr><td><img class='toy-btn' id='redbtn6' src='images/toys/redbutton.png' width=50></td><td><img class='toy-btn' id='redbtn7' src='images/toys/redbutton.png' width=50></td><td><img class='toy-btn' id='redbtn8' src='images/toys/redbutton.png' width=50></td><td><img class='toy-btn' id='redbtn9' src='images/toys/redbutton.png' width=50></td><td><img class='toy-btn' id='redbtn10' src='images/toys/redbutton.png' width=50></td></tr></table></div>");
  $("#explore_ToyA_div").html("<div class='toy-div-btn-panel'><table><tr><td><img class='toy-btn' id='redbtn1' src='images/toys/redbutton1.png' width=50></td><td><img class='toy-btn' id='redbtn2' src='images/toys/redbutton2.png' width=50></td><td><img class='toy-btn' id='redbtn3' src='images/toys/redbutton3.png' width=50></td><td><img class='toy-btn' id='redbtn4' src='images/toys/redbutton4.png' width=50></td><td><img class='toy-btn' id='redbtn5' src='images/toys/redbutton5.png' width=50></td></tr><tr><td><img class='toy-btn' id='redbtn6' src='images/toys/redbutton6.png' width=50></td><td><img class='toy-btn' id='redbtn7' src='images/toys/redbutton7.png' width=50></td><td><img class='toy-btn' id='redbtn8' src='images/toys/redbutton8.png' width=50></td><td><img class='toy-btn' id='redbtn9' src='images/toys/redbutton9.png' width=50></td><td><img class='toy-btn' id='redbtn10' src='images/toys/redbutton10.png' width=50></td></tr></table></div>");

}
/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];

// Possible conditions:
// 1. LCLVvLCLV  (e.g., equal (low) cost and equal (low) value)
// 2. LCHVvLCLV (e.g., low cost, high value v. low cost, low value)
// 3. LCLVvHCLV
// 4. LCLVvHCHV
// 5. LCHVvHCLV
// activatedLCHVToyA
// activatedLCLVToyB
// unactivatedLCHVToyA
// unactivatedLCLVToyB
// teachactivatedLCHVToyA
// teachunactivatedLCHVToyA
// teachactivatedLCLVToyB
// teachunactivatedLCLVToyB

  // exp.condition = "LCHV_HCLV"; 
  exp.condition = _.sample(["LCLV_LCLV", "LCHV_LCLV", "LCLV_HCLV", "LCLV_HCHV", "LCHV_HCLV"]);
  console.log(exp.condition)
  var res = exp.condition.split("_");
  exp.conditionToyA = res[0];
  exp.conditionToyB = res[1];
  exp.unactivatedToyA_img = "makeToysallConditions_images/"+exp.condition+"/unactivated"+exp.conditionToyA+"ToyA.jpg";
  exp.unactivatedToyB_img = "makeToysallConditions_images/"+exp.condition+"/unactivated"+exp.conditionToyB+"ToyB.jpg";
  exp.activatedToyA_img = "makeToysallConditions_images/"+exp.condition+"/activated"+exp.conditionToyA+"ToyA.jpg";
  exp.activatedToyB_img = "makeToysallConditions_images/"+exp.condition+"/activated"+exp.conditionToyB+"ToyB.jpg";
  exp.teachToyA_img = "makeToysallConditions_images/"+exp.condition+"/teachactivated"+exp.conditionToyA+"ToyA.jpg";
  exp.teachToyB_img = "makeToysallConditions_images/"+exp.condition+"/teachactivated"+exp.conditionToyB+"ToyB.jpg";


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
  exp.structure=["i0", "instructions", "display_toys", "explore_toyA", "catch_trial_toyA", "explore_toyB","catch_trial_toyB", "response_trial", "confidence_level",
  "teach_explanation", "hard_choice", "cool_choice", 'subj_info', 'thanks'];
  // exp.structure=["i0", "instructions", "single_trial", "response_trial", "teach_explanation", 'subj_info', 'thanks'];
  exp.toy_taught = "";

  // following variables keep track of whether subject accurately activateed toy A and B
  exp.activatedToyA = false;
  exp.activatedToyB = false;
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







