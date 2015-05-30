#Computational Model of Efficient Teaching

##Here we define a model of a teacher and learner. The learner is reasoning about how to
activate two toys (ToyA and ToyB). The learner's goal is to activate both toys and observe
the effects each produces. The teacher's goal is to teach one toy and let the learner figure out
the other on her own such that she maximizes the probability that learner gets to see the effects
of both toys (i.e., successfully activates both toys).

~~~~ 

(define model
  (lambda (both-toys-buttons&effects-probs)
;; Here we define the buttons and the effect for each toy 
    (define toy1-buttons&effects (first both-toys-buttons&effects-probs))
    (define toy2-buttons&effects (second both-toys-buttons&effects-probs))
    
;; Here we define the probability that each button on each toy produces the effect
    (define toy1-probs (third both-toys-buttons&effects-probs))
    (define toy2-probs (fourth both-toys-buttons&effects-probs))
   
;; Here we define the learner model. The learner does not know how either of the toys works a priori.
;; She can use the message from the teacher to figure out the toy the teacher taught, but must
;; figure out the other toy on her own. Her goal is to activate both toys.
    
    (define learner 
      (mem
       (lambda (how-toy-works goal?)
         (enumeration-query
          (define t1-action (t1-action-prior))
          (define t2-action (t2-action-prior))

          (define learner-toy1-probs (first how-toy-works))
          (define learner-toy2-probs (second how-toy-works))

          (define how-learner-thinks-toy1-works (make-toy toy1-buttons&effects learner-toy1-probs))
          (define how-learner-thinks-toy2-works 
            (make-toy toy2-buttons&effects learner-toy2-probs))

          ;; Query for the list of actions the learner makes on toy 1 and toy 2
          (list t1-action t2-action)

          (goal? (how-learner-thinks-toy1-works t1-action) (how-learner-thinks-toy2-works t2-action))
          ))))
    
;; Here we define the learner's action prior on each toy as a random draw from the list of 
;; buttons on each toy
    (define (t1-action-prior) (uniform-draw (first toy1-buttons&effects)))
    (define (t2-action-prior) (uniform-draw (first toy2-buttons&effects)))
    
;; Here we define the function make-toy which takes in a list of buttons and effects, as well
;; as a list of the probabilities each button will produce that effect
    (define (make-toy buttons&effects button-probs)
      (lambda (action)
        (define index (position (first buttons&effects) action))
        (define prob (list-ref button-probs index))
        (multinomial (list (second buttons&effects) (list "nothing")) (list prob (- 1 prob)))
        ))

;; Here we define the naive intuitions about the probability that each buttons produces the effect
;; (i.e., naive intuitions about how the toy works). We assume that if you do not know how the toy
;; works, then you believe each button is equally likely to produce the effect and the probability
;; for any given button producing the effect is 1 / total-number-of-buttons.
    
    (define make-naive-intuitions-about-buttons 
      (lambda (list-of-buttons)
        (map (lambda (x) (/ 1 (length list-of-buttons)) 
               )
             list-of-buttons)))

    ;; count-lights counts the number of lights each toy produces
    (define count-lights
      (lambda (outcome-list)
        (sum (map (lambda (x) (boolean->number (equal? 'light x))) outcome-list))))

;; Here we define the teacher model. The teacher selects a toy to teach and sends the 
;; actual probability of each button producing the desired effect to the learner for that toy. For the
;; other toy, she send naive intuitions about the buttons (i.e., she sends no information about the
;; other toy). The teacher's goal is that the learner will activate both toys.
   
    (define (teacher)
      (enumeration-query

;; Here we define the message-prior (or teach prior) for the teacher as a uniform draw from the list 
;; of toys (always two toys, Toy A (toy1) and Toy B (toy2))
       (define (message-prior) (uniform-draw '("ToyA" "ToyB")))

;; The teacher knows how each toy works.
       (define how-toy1-actually-works (make-toy toy1-buttons&effects toy1-probs))
       (define how-toy2-actually-works 
         (make-toy toy2-buttons&effects toy2-probs))

;; Here we define the learner's goal as a value function in which she wants to see all of the effects
;; There is more value in learning both toys because the learner wants the summed reward of both toys.
;; learner-goal? returns true most often when all effects have been observed (i.e., returns true
;; most often when learner’s actions bring about the maximal effect across the two toys, 
;; but sometimes it returns true for sub-optimal returns.)
       
       (define learner-goal? (lambda (outcome-toy1 outcome-toy2)
                               (<= (multinomial '(0 1 2 3) '(0 1 4 10))
                                   (count-lights (append outcome-toy1 outcome-toy2)))))

;; Here we define the teacher's goal as a probabilistic value function. Returns true most often
;; when learner’s actions bring about the maximal effect across the two toys, 
;; but sometimes it returns true for sub-optimal returns.
       
       (define teacher-goal? (lambda (learner-actions) 
                               (<= (multinomial '(0 1 2 3) '(0 1 4 10)) 
                                   (count-lights 
                                    (append (how-toy1-actually-works (first learner-actions))
                                            (how-toy2-actually-works (second learner-actions)))))))
       
;; Here we define what message the teacher sends to the learner (i.e., what toy she chooses to teach)
       (define message (message-prior))

;; Here we translate the message the teacher passes on to the learner into knowledge of the actual
;; probability of effect associated with each button for the toy she chose to teach, and naive 
;; intuitions about the probability of effect associated with each button for the other toy.
       
       (define message-dictionary 
         (lambda (m) 
           (case m 
                 (("ToyB") (list 
                                                (make-naive-intuitions-about-buttons 
                                                 (first toy1-buttons&effects))
                                                toy2-probs))
                 (("ToyA") (list 
                                                toy1-probs
                                                (make-naive-intuitions-about-buttons 
                                                 (first toy2-buttons&effects))
                                                )))))

       ;; Query for message teacher sends learner

       message

       (teacher-goal? (apply multinomial (learner (message-dictionary message) learner-goal?)))
       ))

    (teacher)

    ))

;; Here we define all of the different conditions (i.e., different toy comparisons varying in
;; cost and value)

(define all-conditions
  (list 

   (list (list '(a) (list "light")) 
         (list '(c) (list "light"))
         '(0.9)
         '(0.9))

   (list (list '(a) (list "light" "light")) 
         (list '(c) (list "light"))
         '(0.9)
         '(0.9))

   (list (list '(a b) (list "light" "light")) 
         (list '(c d) (list "light"))
         '(0.9 .01)
         '(0.9 0.1))

   (list (list '(a) (list "light")) 
         (list '(c d e f g h i j k l) (list "light"))
         '(0.9)
         '(0.9 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1))

    (list (list '(a) (list "light")) 
         (list '(c d e f g h i j k l) (list "light" "light"))
         '(0.9)
         '(0.9 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1))

    (list (list '(a) (list "light" "light")) 
         (list '(c d e f g h i j k l) (list "light"))
         '(0.9)
         '(0.9 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1))
   ))




;; Condition Names
(define plot-titles (list "Equal Low Cost, Equal Low Value" 
                          "Equal Low Cost, Unequal Value (high value Toy A)"
                          "Equal Medium Cost, Unequal Value (high value Toy A)"
                          "Unequal Cost, Equal Low Value (high cost Toy B)"
                          "Unequal Cost, Unequal Value (high cost, high value Toy B)"
                          "Unequal Cost, Unequal Value (high cost, low value Toy B)"))

;; Barplot of predictions for each condition (toy1 = ToyA; toy2 = ToyB)
(map barplot (map model all-conditions) plot-titles)

~~~~


###Different Conditions (Varying Comparisons of Toys):

1. "Equal Low Cost, Equal Low Value" 
2. "Equal Low Cost, Unequal Value (high value Toy A)"
3. "Equal Medium Cost, Unequal Value (high value Toy A)"
4. "Unequal Cost, Equal Low Value (high cost Toy B)"
5. "Unequal Cost, Unequal Value (high cost, high value Toy B)"
6. "Unequal Cost, Unequal Value (high cost, low value Toy B)"

~~~~


