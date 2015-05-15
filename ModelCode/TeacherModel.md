#Computational Model of Efficient Teaching

##Different Teaching Scenarios


###Comparing equal cost and equal value toy:

~~~~
; handing over instructions

; learner does not know anything about the world
(define (learner how-toy-works goal?)
  (rejection-query
   (define t1-action (t1-action-prior))
   (define t2-action (t2-action-prior))

   (define a-effects (first (first how-toy-works)))
   (define b-effects (second (first how-toy-works)))

   (define c-effects (first (second how-toy-works)))
   (define d-effects (second (second how-toy-works)))
  

   (define how-learner-thinks-toy1-works (make-toy1 a-effects b-effects))
   (define how-learner-thinks-toy2-works 
     (make-toy2 c-effects d-effects))

   (list t1-action t2-action)

   (goal? (how-learner-thinks-toy1-works t1-action) (how-learner-thinks-toy2-works t2-action))
   ;true
   ))
;;;
(define (t1-action-prior) (uniform-draw '(a b)))
(define (t2-action-prior) (uniform-draw '(c d)))
;; buttons function to define priors

(define (make-toy1 a-effects b-effects)
  (lambda (action)
    (case action
          (('a) (multinomial (list (list "light") (list "nothing")) a-effects))
          (('b) (multinomial (list (list "light") (list "nothing")) b-effects))
          (else 'nothing))))

(define (make-toy2 c-effects d-effects)
  (lambda (action)
    (case action
          (('c) (multinomial (list (list "light") (list "nothing")) c-effects))
          (('d) (multinomial (list (list "light") (list "nothing")) d-effects))
          (else 'nothing))))

(define make-naive-intuitions-about-buttons 
  (lambda (list-of-buttons)
    (map (lambda (x) (list (/ 1 (length list-of-buttons)) 
                           (/ (- (length list-of-buttons) 1) (length list-of-buttons))))
         list-of-buttons)))

  (define count-lights
    (lambda (outcome-list)
      (sum (map (lambda (x) (boolean->number (equal? 'light x))) outcome-list))))

  ;In this case, teaching either toy is equally helpful
  (define (teacher)
    (rejection-query

     (define a-effects '(0.9 0.1))
     (define b-effects '(0.1 0.9))

     (define c-effects '(0.9 0.1))
     (define d-effects '(0.1 0.9))
     
     (define (message-prior) (uniform-draw '("Low Cost, Low Value Toy1" "Low Cost, Low Value Toy2")))

     (define how-toy1-actually-works (make-toy1 a-effects b-effects))
     (define how-toy2-actually-works 
       (make-toy2 c-effects d-effects))

     ;utility is a continuous things, higher => more probable to be goal
     ;0 1 2 3 >> there is more value in learning both toys, want most # of lights
     (define learner-goal? (lambda (outcome-toy1 outcome-toy2)
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8))
                                 (count-lights (append outcome-toy1 outcome-toy2)))))


     (define teacher-goal? (lambda (learner-actions) 
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8)) 
                                 (count-lights 
                                  (append (how-toy1-actually-works (first learner-actions))
                                          (how-toy2-actually-works (second learner-actions)))))))

     (define message (message-prior))

     (define message-dictionary 
       (lambda (m) 
         (case m 
               (("Low Cost, Low Value Toy2") (list 
                            (make-naive-intuitions-about-buttons '(a b))
                            (list c-effects d-effects)))
               (("Low Cost, Low Value Toy1") (list 
                       (list a-effects b-effects)
                       (make-naive-intuitions-about-buttons '(c d)))))))


     message

     (teacher-goal? (learner (message-dictionary message) learner-goal?))
     ))

  (hist (repeat 1000 teacher) "Probability Teacher Teaches Toy1")

~~~~

###Comparing two toys with equal cost but unequal value:

~~~~
; handing over instructions

; ; learner does not know anything about the world
(define (learner how-toy-works goal?)
  (rejection-query
   (define t1-action (t1-action-prior))
   (define t2-action (t2-action-prior))

   (define a-effects (first (first how-toy-works)))
   (define b-effects (second (first how-toy-works)))

   (define c-effects (first (second how-toy-works)))
   (define d-effects (second (second how-toy-works)))
  

   (define how-learner-thinks-toy1-works (make-toy1 a-effects b-effects))
   (define how-learner-thinks-toy2-works 
     (make-toy2 c-effects d-effects))

   (list t1-action t2-action)

   (goal? (how-learner-thinks-toy1-works t1-action) (how-learner-thinks-toy2-works t2-action))
   ;true
   ))
;;;
(define (t1-action-prior) (uniform-draw '(a b)))
(define (t2-action-prior) (uniform-draw '(c d)))
;; buttons function to define priors

(define (make-toy1 a-effects b-effects)
  (lambda (action)
    (case action
          (('a) (multinomial (list (list "light" "light") (list "nothing")) a-effects))
          (('b) (multinomial (list (list "light" "light") (list "nothing")) b-effects))
          (else 'nothing))))

(define (make-toy2 c-effects d-effects)
  (lambda (action)
    (case action
          (('c) (multinomial (list (list "light") (list "nothing")) c-effects))
          (('d) (multinomial (list (list "light") (list "nothing")) d-effects))
          (else 'nothing))))

(define make-naive-intuitions-about-buttons 
  (lambda (list-of-buttons)
    (map (lambda (x) (list (/ 1 (length list-of-buttons)) 
                           (/ (- (length list-of-buttons) 1) (length list-of-buttons))))
         list-of-buttons)))

  (define count-lights
    (lambda (outcome-list)
      (sum (map (lambda (x) (boolean->number (equal? 'light x))) outcome-list))))

  ;helpful teacher would send message about high value toy to learner
  (define (teacher)
    (rejection-query

     (define a-effects '(0.9 0.1))
     (define b-effects '(0.1 0.9))

     (define c-effects '(0.9 0.1))
     (define d-effects '(0.1 0.9))
     
     (define (message-prior) (uniform-draw '("Low Cost, High Value Toy" "Low Cost, Low Value Toy")))

     (define how-toy1-actually-works (make-toy1 a-effects b-effects))
     (define how-toy2-actually-works 
       (make-toy2 c-effects d-effects))

     ;utility is a continuous things, higher => more probable to be goal
     ;0 1 2 3 >> there is more value in learning both toys, want most # of lights
     (define learner-goal? (lambda (outcome-toy1 outcome-toy2)
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8))
                                 (count-lights (append outcome-toy1 outcome-toy2)))))


     (define teacher-goal? (lambda (learner-actions) 
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8)) 
                                 (count-lights 
                                  (append (how-toy1-actually-works (first learner-actions))
                                          (how-toy2-actually-works (second learner-actions)))))))

     (define message (message-prior))

     (define message-dictionary 
       (lambda (m) 
         (case m 
               (("Low Cost, Low Value Toy") (list 
                            (make-naive-intuitions-about-buttons '(a b))
                            (list c-effects d-effects)))
               (("Low Cost, High Value Toy") (list 
                       (list a-effects b-effects)
                       (make-naive-intuitions-about-buttons '(c d)))))))

     message

     (teacher-goal? (learner (message-dictionary message) learner-goal?))
     ))

  (hist (repeat 1000 teacher) "Probability Teacher Teaches High Value Toy")
~~~~


###Comparing two toys unequal in cost with equal (low) value:

~~~~

; handing over instructions

; ; learner does not know anything about the world
(define (learner how-toy-works goal?)
  (rejection-query
   (define t1-action (t1-action-prior))
   (define t2-action (t2-action-prior))

   (define a-effects (first (first how-toy-works)))
  

   (define c-effects (first (second how-toy-works)))
   (define d-effects (second (second how-toy-works)))
   (define e-effects (third (second how-toy-works)))
   (define f-effects (fourth (second how-toy-works)))
   (define g-effects (fifth (second how-toy-works)))
   (define h-effects (sixth (second how-toy-works)))
   (define i-effects (seventh (second how-toy-works)))

   (define how-learner-thinks-toy1-works (make-toy1 a-effects))
   (define how-learner-thinks-toy2-works 
     (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects))

   (list t1-action t2-action)

   (goal? (how-learner-thinks-toy1-works t1-action) (how-learner-thinks-toy2-works t2-action))
   ;true
   ))
;;;
(define (t1-action-prior) (uniform-draw '(a)))
(define (t2-action-prior) (uniform-draw '(c d e f g h i)))
;; buttons function to define priors

;; Low cost toy, low value
(define (make-toy1 a-effects)
  (lambda (action)
    (case action
          (('a) (multinomial (list (list "light") (list "nothing")) a-effects))
          (else 'nothing))))

;; High cost toy, low value
(define (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects)
  (lambda (action)
    (case action
          (('c) (multinomial (list (list "light") (list "nothing")) c-effects))
          (('d) (multinomial (list (list "light") (list "nothing")) d-effects))
          (('e) (multinomial (list (list "light") (list "nothing")) e-effects))
          (('f) (multinomial (list (list "light") (list "nothing")) f-effects))
          (('g) (multinomial (list (list "light") (list "nothing")) g-effects))
          (('h) (multinomial (list (list "light") (list "nothing")) h-effects))
          (('i) (multinomial (list (list "light") (list "nothing")) i-effects))
          (else 'nothing))))

(define make-naive-intuitions-about-buttons 
  (lambda (list-of-buttons)
    (map (lambda (x) (list (/ 1 (length list-of-buttons)) 
                           (/ (- (length list-of-buttons) 1) (length list-of-buttons))))
         list-of-buttons)))

  (define count-lights
    (lambda (outcome-list)
      (sum (map (lambda (x) (boolean->number (equal? 'light x))) outcome-list))))

  ;helpful teacher would send message about high cost toy to learner
  (define (teacher)
    (rejection-query

     (define a-effects '(0.9 0.1))

     (define c-effects '(0.9 0.1))
     (define d-effects '(0.1 0.9))
     (define e-effects '(0.1 0.9))
     (define f-effects '(0.1 0.9))
     (define g-effects '(0.1 0.9))
     (define h-effects '(0.1 0.9))
     (define i-effects '(0.1 0.9))

     (define (message-prior) (uniform-draw '("Low Cost, Low Value Toy" "High Cost, Low Value Toy")))

     (define how-toy1-actually-works (make-toy1 a-effects))
     (define how-toy2-actually-works 
       (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects))

     ;utility is a continuous things, higher => more probable to be goal
     ;0 1 2 3 >> there is more value in learning both toys, want most # of lights
     (define learner-goal? (lambda (outcome-toy1 outcome-toy2)
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8))
                                 (count-lights (append outcome-toy1 outcome-toy2)))))


     (define teacher-goal? (lambda (learner-actions) 
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8)) 
                                 (count-lights 
                                  (append (how-toy1-actually-works (first learner-actions))
                                          (how-toy2-actually-works (second learner-actions)))))))

     (define message (message-prior))
     
;; Helpful for this model is defined as sending the instructions for the high cost toy
     (define message-dictionary 
       (lambda (m) 
         (case m 
               (("High Cost, Low Value Toy") (list 
                            (make-naive-intuitions-about-buttons '(a))
                            (list c-effects d-effects e-effects f-effects g-effects h-effects i-effects)))
               (("Low Cost, Low Value Toy") (list 
                       (list a-effects)
                       (make-naive-intuitions-about-buttons '(c d e f g h i)))))))

 

     message

     (teacher-goal? (learner (message-dictionary message) learner-goal?))
     ))

  (hist (repeat 1000 teacher) "Probability Teacher Teaches High Cost Toy")
~~~~

###Comparing two toys unequal in cost with equal (high) value:

~~~~

; handing over instructions

; ; learner does not know anything about the world
(define (learner how-toy-works goal?)
  (rejection-query
   (define t1-action (t1-action-prior))
   (define t2-action (t2-action-prior))

   (define a-effects (first (first how-toy-works)))
  

   (define c-effects (first (second how-toy-works)))
   (define d-effects (second (second how-toy-works)))
   (define e-effects (third (second how-toy-works)))
   (define f-effects (fourth (second how-toy-works)))
   (define g-effects (fifth (second how-toy-works)))
   (define h-effects (sixth (second how-toy-works)))
   (define i-effects (seventh (second how-toy-works)))

   (define how-learner-thinks-toy1-works (make-toy1 a-effects))
   (define how-learner-thinks-toy2-works 
     (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects))

   (list t1-action t2-action)

   (goal? (how-learner-thinks-toy1-works t1-action) (how-learner-thinks-toy2-works t2-action))
   ;true
   ))
;;;
(define (t1-action-prior) (uniform-draw '(a)))
(define (t2-action-prior) (uniform-draw '(c d e f g h i)))
;; buttons function to define priors

;; Low cost toy, low value
(define (make-toy1 a-effects)
  (lambda (action)
    (case action
          (('a) (multinomial (list (list "light" "light") (list "nothing")) a-effects))
          (else 'nothing))))

;; High cost toy, low value
(define (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects)
  (lambda (action)
    (case action
          (('c) (multinomial (list (list "light" "light") (list "nothing")) c-effects))
          (('d) (multinomial (list (list "light" "light") (list "nothing")) d-effects))
          (('e) (multinomial (list (list "light" "light") (list "nothing")) e-effects))
          (('f) (multinomial (list (list "light" "light") (list "nothing")) f-effects))
          (('g) (multinomial (list (list "light" "light") (list "nothing")) g-effects))
          (('h) (multinomial (list (list "light" "light") (list "nothing")) h-effects))
          (('i) (multinomial (list (list "light" "light") (list "nothing")) i-effects))
          (else 'nothing))))

(define make-naive-intuitions-about-buttons 
  (lambda (list-of-buttons)
    (map (lambda (x) (list (/ 1 (length list-of-buttons)) 
                           (/ (- (length list-of-buttons) 1) (length list-of-buttons))))
         list-of-buttons)))

  (define count-lights
    (lambda (outcome-list)
      (sum (map (lambda (x) (boolean->number (equal? 'light x))) outcome-list))))

  ;helpful teacher would send message about high cost toy to learner
  (define (teacher)
    (rejection-query

     (define a-effects '(0.9 0.1))

     (define c-effects '(0.9 0.1))
     (define d-effects '(0.1 0.9))
     (define e-effects '(0.1 0.9))
     (define f-effects '(0.1 0.9))
     (define g-effects '(0.1 0.9))
     (define h-effects '(0.1 0.9))
     (define i-effects '(0.1 0.9))

     (define (message-prior) (uniform-draw '("Low Cost, High Value Toy" "High Cost, High Value Toy")))

     (define how-toy1-actually-works (make-toy1 a-effects))
     (define how-toy2-actually-works 
       (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects))

     ;utility is a continuous things, higher => more probable to be goal
     ;0 1 2 3 >> there is more value in learning both toys, want most # of lights
     (define learner-goal? (lambda (outcome-toy1 outcome-toy2)
                             (<= (multinomial '(0 1 2 3 4) '(0 1 2 3 8))
                                 (count-lights (append outcome-toy1 outcome-toy2)))))


     (define teacher-goal? (lambda (learner-actions) 
                             (<= (multinomial '(0 1 2 3 4) '(0 1 2 3 8)) 
                                 (count-lights 
                                  (append (how-toy1-actually-works (first learner-actions))
                                          (how-toy2-actually-works (second learner-actions)))))))

     (define message (message-prior))
     
;; Helpful for this model is defined as sending the instructions for the high cost toy
     (define message-dictionary 
       (lambda (m) 
         (case m 
               (("High Cost, High Value Toy") (list 
                            (make-naive-intuitions-about-buttons '(a))
                            (list c-effects d-effects e-effects f-effects g-effects h-effects i-effects)))
               (("Low Cost, High Value Toy") (list 
                       (list a-effects)
                       (make-naive-intuitions-about-buttons '(c d e f g h i)))))))

 

     message

     (teacher-goal? (learner (message-dictionary message) learner-goal?))
     ))

  (hist (repeat 1000 teacher) "Probability Teacher Teaches High Cost Toy")

~~~~


###Comparing a toy of high cost with a high value against a toy of low cost with a low value:

~~~~

; handing over instructions

; learner does not know anything about the world
(define (learner how-toy-works goal?)
  (rejection-query
   (define t1-action (t1-action-prior))
   (define t2-action (t2-action-prior))

   (define a-effects (first (first how-toy-works)))

   (define c-effects (first (second how-toy-works)))
   (define d-effects (second (second how-toy-works)))
   (define e-effects (third (second how-toy-works)))
   (define f-effects (fourth (second how-toy-works)))
   (define g-effects (fifth (second how-toy-works)))
   (define h-effects (sixth (second how-toy-works)))
   (define i-effects (seventh (second how-toy-works)))

   (define how-learner-thinks-toy1-works (make-toy1 a-effects))
   (define how-learner-thinks-toy2-works 
     (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects))

   (list t1-action t2-action)

   (goal? (how-learner-thinks-toy1-works t1-action) (how-learner-thinks-toy2-works t2-action))
   ;true
   ))
;;;
(define (t1-action-prior) (uniform-draw '(a)))
(define (t2-action-prior) (uniform-draw '(c d e f g h i)))
;; buttons function to define priors

(define (make-toy1 a-effects)
  (lambda (action)
    (case action
          (('a) (multinomial (list (list "light") (list "nothing")) a-effects))
          (else 'nothing))))

(define (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects)
  (lambda (action)
    (case action
          (('c) (multinomial (list (list "light" "light") (list "nothing")) c-effects))
          (('d) (multinomial (list (list "light" "light") (list "nothing")) d-effects))
          (('e) (multinomial (list (list "light" "light") (list "nothing")) e-effects))
          (('f) (multinomial (list (list "light" "light") (list "nothing")) f-effects))
          (('g) (multinomial (list (list "light" "light") (list "nothing")) g-effects))
          (('h) (multinomial (list (list "light" "light") (list "nothing")) h-effects))
          (('i) (multinomial (list (list "light" "light") (list "nothing")) i-effects))
          (else 'nothing))))

(define make-naive-intuitions-about-buttons 
  (lambda (list-of-buttons)
    (map (lambda (x) (list (/ 1 (length list-of-buttons)) 
                           (/ (- (length list-of-buttons) 1) (length list-of-buttons))))
         list-of-buttons)))

  (define count-lights
    (lambda (outcome-list)
      (sum (map (lambda (x) (boolean->number (equal? 'light x))) outcome-list))))

  ;helpful teacher would send message about high cost toy to learner
  (define (teacher)
    (rejection-query

     (define a-effects '(0.9 0.1))

     (define c-effects '(0.9 0.1))
     (define d-effects '(0.1 0.9))
     (define e-effects '(0.1 0.9))
     (define f-effects '(0.1 0.9))
     (define g-effects '(0.1 0.9))
     (define h-effects '(0.1 0.9))
     (define i-effects '(0.1 0.9))

     (define (message-prior) (uniform-draw '("High Cost, High Value Toy" "Low Cost, Low Value Toy")))

     (define how-toy1-actually-works (make-toy1 a-effects))
     (define how-toy2-actually-works 
       (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects))

     ;utility is a continuous things, higher => more probable to be goal
     ;0 1 2 3 >> there is more value in learning both toys, want most # of lights
     (define learner-goal? (lambda (outcome-toy1 outcome-toy2)
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8))
                                 (count-lights (append outcome-toy1 outcome-toy2)))))


     (define teacher-goal? (lambda (learner-actions) 
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8)) 
                                 (count-lights 
                                  (append (how-toy1-actually-works (first learner-actions))
                                          (how-toy2-actually-works (second learner-actions)))))))

     (define message (message-prior))

     (define message-dictionary 
       (lambda (m) 
         (case m 
               (("High Cost, High Value Toy") (list 
                            (make-naive-intuitions-about-buttons '(a))
                            (list c-effects d-effects e-effects f-effects g-effects h-effects i-effects)))
               (("Low Cost, Low Value Toy") (list 
                       (list a-effects)
                       (make-naive-intuitions-about-buttons '(c d e f g h i)))))))

     ;;#args to dirichlet == #effects

     message

     (teacher-goal? (learner (message-dictionary message) learner-goal?))
     ))

  (hist (repeat 1000 teacher) "Probability Teacher Teaches High Cost Toy")

~~~~

###**Critical Comparison:** Comparing a toy of high cost with a low value and a toy of low cost with a high value (i.e., pitting cost against value)

~~~~

; handing over instructions

; learner does not know anything about the world
(define (learner how-toy-works goal?)
  (rejection-query
   (define t1-action (t1-action-prior))
   (define t2-action (t2-action-prior))

   (define a-effects (first (first how-toy-works)))

   (define c-effects (first (second how-toy-works)))
   (define d-effects (second (second how-toy-works)))
   (define e-effects (third (second how-toy-works)))
   (define f-effects (fourth (second how-toy-works)))
   (define g-effects (fifth (second how-toy-works)))
   (define h-effects (sixth (second how-toy-works)))
   (define i-effects (seventh (second how-toy-works)))

   (define how-learner-thinks-toy1-works (make-toy1 a-effects))
   (define how-learner-thinks-toy2-works 
     (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects))

   (list t1-action t2-action)

   (goal? (how-learner-thinks-toy1-works t1-action) (how-learner-thinks-toy2-works t2-action))
   ;true
   ))
;;;
(define (t1-action-prior) (uniform-draw '(a)))
(define (t2-action-prior) (uniform-draw '(c d e f g h i)))
;; buttons function to define priors

(define (make-toy1 a-effects)
  (lambda (action)
    (case action
          (('a) (multinomial (list (list "light" "light") (list "nothing")) a-effects))
          (else 'nothing))))

(define (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects)
  (lambda (action)
    (case action
          (('c) (multinomial (list (list "light") (list "nothing")) c-effects))
          (('d) (multinomial (list (list "light") (list "nothing")) d-effects))
          (('e) (multinomial (list (list "light") (list "nothing")) e-effects))
          (('f) (multinomial (list (list "light") (list "nothing")) f-effects))
          (('g) (multinomial (list (list "light") (list "nothing")) g-effects))
          (('h) (multinomial (list (list "light") (list "nothing")) h-effects))
          (('i) (multinomial (list (list "light") (list "nothing")) i-effects))
          (else 'nothing))))

(define make-naive-intuitions-about-buttons 
  (lambda (list-of-buttons)
    (map (lambda (x) (list (/ 1 (length list-of-buttons)) 
                           (/ (- (length list-of-buttons) 1) (length list-of-buttons))))
         list-of-buttons)))

  (define count-lights
    (lambda (outcome-list)
      (sum (map (lambda (x) (boolean->number (equal? 'light x))) outcome-list))))

  ;helpful teacher would send message about high cost toy to learner
  (define (teacher)
    (rejection-query

     (define a-effects '(0.9 0.1))

     (define c-effects '(0.9 0.1))
     (define d-effects '(0.1 0.9))
     (define e-effects '(0.1 0.9))
     (define f-effects '(0.1 0.9))
     (define g-effects '(0.1 0.9))
     (define h-effects '(0.1 0.9))
     (define i-effects '(0.1 0.9))

     (define (message-prior) (uniform-draw '("High Cost, Low Value Toy" "Low Cost, High Value Toy")))

     (define how-toy1-actually-works (make-toy1 a-effects))
     (define how-toy2-actually-works 
       (make-toy2 c-effects d-effects e-effects f-effects g-effects h-effects i-effects))

     ;utility is a continuous things, higher => more probable to be goal
     ;0 1 2 3 >> there is more value in learning both toys, want most # of lights
     (define learner-goal? (lambda (outcome-toy1 outcome-toy2)
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8))
                                 (count-lights (append outcome-toy1 outcome-toy2)))))


     (define teacher-goal? (lambda (learner-actions) 
                             (<= (multinomial '(0 1 2 3) '(0 1 2 8)) 
                                 (count-lights 
                                  (append (how-toy1-actually-works (first learner-actions))
                                          (how-toy2-actually-works (second learner-actions)))))))

     (define message (message-prior))

     (define message-dictionary 
       (lambda (m) 
         (case m 
               (("High Cost, Low Value Toy") (list 
                            (make-naive-intuitions-about-buttons '(a))
                            (list c-effects d-effects e-effects f-effects g-effects h-effects i-effects)))
               (("Low Cost, High Value Toy") (list 
                       (list a-effects)
                       (make-naive-intuitions-about-buttons '(c d e f g h i)))))))

     message

     (teacher-goal? (learner (message-dictionary message) learner-goal?))
     ))

  (hist (repeat 1000 teacher) "Probability Teacher Teaches High Cost, Low Value Toy")

~~~~
